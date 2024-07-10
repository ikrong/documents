const fs = require("fs");
const cheerio = require("cheerio");
const glob = require("glob").globSync;
const path = require("path");
const fetch = require("node-fetch");
const css = require("rrweb-cssom");
const postcss = require("postcss");
const { URL } = require("url");
const mime = require("mime-types");
const crypto = require("crypto");

const HOST_DIR = process.argv[2];

if (!HOST_DIR) {
    console.log("no dist dir");
    return process.exit(1);
}

const urlCaches = {};

// 根据字符串生成一个唯一对应的字符串
function generateUniqueId(inputString) {
    const hash = crypto.createHash("sha1");
    hash.update(inputString);
    const uniqueId = hash.digest("hex");
    return uniqueId;
}

async function fetchResource(link, process) {
    const urlinfo = new URL(link);
    let formatPath = path.join("cdn-resource-cached", urlinfo.host, urlinfo.pathname);
    let dist = path.join(HOST_DIR, formatPath);
    let ext = path.extname(dist);
    let uuid = generateUniqueId(link);
    if (!ext) {
        formatPath = path.join("cdn-resource-cached", urlinfo.host, path.dirname(urlinfo.pathname), uuid);
        dist = path.join(HOST_DIR, formatPath);
    }
    const dir = path.dirname(dist);
    if (fs.existsSync(dist)) {
        return `/${formatPath}`;
    }
    if (urlCaches[uuid]) {
        return urlCaches[uuid];
    }
    const resp = await fetch(link);
    ext = mime.extension(resp.headers.get("content-type"));
    if (ext && !path.extname(dist)) {
        formatPath += "." + ext;
        dist += "." + ext;
    }
    let buff = await resp.buffer();
    if (typeof process === "function") {
        buff = buff.toString();
        buff = await process(buff);
    }
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(dist, buff);
    urlCaches[uuid] = `/${formatPath}`;
    return `/${formatPath}`;
}

/**替换大法 */
async function cacheUrl(url, process) {
    const dist = await fetchResource(url, process);
    return dist;
}

async function replaceCssContent(href, content) {
    return (
        await postcss([
            {
                postcssPlugin: "download-assets",
                Once: async (root) => {
                    const promiseAll = [];
                    root.walkAtRules((atRule) => {
                        promiseAll.push(async () => {
                            switch (atRule.name) {
                                case "import":
                                    {
                                        const match = atRule.params.match(/^url\(['"]?([\s\S]+?)['"]?\)/i);
                                        if (match) {
                                            const url = formatUrl(match[1]);
                                            const newUrl = await cacheUrl(url, (t) => replaceCssContent(url, t));
                                            atRule.params = `url("${newUrl}")`;
                                        }
                                    }
                                    break;
                            }
                        });
                    });
                    root.walkDecls((decl) => {
                        promiseAll.push(async () => {
                            switch (decl.prop) {
                                case "src":
                                    {
                                        const reg = /\(['"]?([\s\S]+?)['"]?\)[ ]+format\(['"]?([a-z0-9-]+?)['"]?\)/i;
                                        if (reg.test(decl.value)) {
                                            reg.lastIndex = 0;
                                            decl.value = (
                                                await Promise.all(
                                                    decl.value.split(",").map(async (value) => {
                                                        const m = value.match(reg);
                                                        if (m) {
                                                            const src = m[1];
                                                            const type = m[2];
                                                            let nsrc = "";
                                                            if (src.match(/^https?:\/\//i)) {
                                                                nsrc = src;
                                                            } else if (href) {
                                                                nsrc = new URL(src, href).toString();
                                                            }
                                                            if (nsrc) {
                                                                nsrc = await cacheUrl(nsrc);
                                                                return `url("${nsrc}") format("${type}")`;
                                                            } else {
                                                                return value;
                                                            }
                                                        }
                                                        return value;
                                                    }),
                                                )
                                            ).join(",");
                                        }
                                    }
                                    break;
                            }
                        });
                    });
                    return await Promise.all(promiseAll.map((p) => p()));
                },
            },
        ]).process(content, { from: "undefined" })
    ).css;
    // const ast = css.parse(content);
    // await Promise.all(
    //     ast.cssRules.map(async (rule) => {
    //         // cdn css中的字体文件也缓存下来
    //         if (rule.type === css.CSSRule.FONT_FACE_RULE) {
    //             if (rule.style.src) {
    //                 rule.style.src = (
    //                     await Promise.all(
    //                         rule.style.src.split(",").map(async (value) => {
    //                             const m = value.match(
    //                                 /\(['"]?([-a-zA-Z0-9._~!$&'()*+,;=:@%\/?]+?)['"]?\)[ ]+format\(['"]?([a-z0-9-]+?)['"]?\)/i
    //                             );
    //                             if (m && href) {
    //                                 const src = m[1];
    //                                 const type = m[2];
    //                                 const nsrc = await cacheUrl(new URL(src, href).toString());
    //                                 return `url("${nsrc}") format("${type}")`;
    //                             }
    //                             return value;
    //                         })
    //                     )
    //                 ).join(",");
    //             }
    //         } else if (rule.type === css.CSSRule.IMPORT_RULE) {
    //             const url = formatUrl(rule.href);
    //             if (url) {
    //                 const href = await cacheUrl(url, (t) => replaceCssContent(rule.href, t));
    //                 rule.href = href;
    //             }
    //         }
    //     })
    // );
    // return ast.toString();
}

function formatUrl(url) {
    if (![/^https?:\/\//, /^\/\//].some((r) => r.test(url))) {
        return;
    }
    if (String(url).startsWith("//")) {
        return `http:${url}`;
    }
    return url;
}

async function replaceHTML(file) {
    const content = fs.readFileSync(file).toString();
    const $ = cheerio.load(content);
    // scripts
    const scripts = Array.from($("script"));
    for (const el of scripts) {
        delete el.attribs.integrity;
        delete el.attribs.nonce;
        if (!el.attribs.src) {
            const content = $(el).text();
            if (["www.googletagmanager.com"].some((u) => content.includes(u))) {
                $(el).remove();
            }
            continue;
        }
        let src = formatUrl(el.attribs.src);
        if (src) {
            // script标签来自这些主机地址，则删除，因为这个是广告性质的，与文档内容无关
            if (
                [
                    "www.googletagmanager.com",
                    "cdn.usefathom.com",
                    "cdn.carbonads.com",
                    "vueschool.io/banner.js",
                    "https://extend.vimeocdn.com/ga",
                    "servedby-buysellads.com",
                    "cdn.wwads.cn/js/",
                    "https://www.google-analytics.com",
                    "hm.baidu.com/hm.js",
                ].some((u) => src.includes(u))
            ) {
                $(el).remove();
                continue;
            }
            // polyfill因为包含恶意代码，已经无法访问或者应该停止引用，所以开始使用cloudflare代替
            if (String(src).startsWith("https://polyfill.io")) {
                src = src.replace(/https:\/\/polyfill.io/, "https://cdnjs.cloudflare.com/polyfill");
            }
            el.attribs.src = await cacheUrl(src);
        }
    }
    // styles
    // <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    const styles = Array.from($('link[rel="stylesheet"]'));
    for (const el of styles) {
        delete el.attribs.integrity;
        delete el.attribs.nonce;
        const href = formatUrl(el.attribs.href);
        if (href) {
            el.attribs.href = await cacheUrl(href, (t) => replaceCssContent(href, t));
        } else if (el.attribs.href) {
            const file = path.join(HOST_DIR, String(el.attribs.href).split("?")[0]);
            if (fs.existsSync(file)) {
                const content = fs.readFileSync(file).toString();
                fs.writeFileSync(file, await replaceCssContent("", content));
            }
        }
    }
    const preloads = Array.from($('link[rel="preload"]'));
    for (const el of preloads) {
        const href = formatUrl(el.attribs.href);
        if (href && ["font"].includes(el.attribs.as)) {
            el.attribs.href = await cacheUrl(href);
        }
    }
    // imgs
    // <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    const imgs = Array.from($("img"));
    for (const el of imgs) {
        const src = formatUrl(el.attribs.src);
        if (src) {
            el.attribs.src = await cacheUrl(src);
        }
    }

    fs.writeFileSync(file, $.html());
}

async function replaceStyle(file) {
    const content = fs.readFileSync(file).toString();
    fs.writeFileSync(file, await replaceCssContent("", content));
}

async function main() {
    const matchFiles = glob(path.join(HOST_DIR, "./**/*.{js,json,html,css}"));

    for (let i = 0; i < matchFiles.length; i++) {
        const file = matchFiles[i];
        const { ext } = path.parse(file);
        switch (ext) {
            case ".html":
                await replaceHTML(file);
                break;
            case ".css":
                await replaceStyle(file);
                break;
            default:
                // replaceText(file);
                break;
        }
    }
}

main();
