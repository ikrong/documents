const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const glob = require("glob").globSync;

const HOST_DIR = process.argv[2];

!(() => {
    const matchFiles = glob(path.join(HOST_DIR, "./**/*.{html,js,css}"));
    for (const file of matchFiles) {
        let content = fs.readFileSync(file).toString();
        if (file.endsWith(".html")) {
            const $ = cheerio.load(content);
            Array.from($("script")).map((el) => {
                const src = el.attribs.src;
                if (!src) {
                    const content = $(el).text();
                    if (content.includes("https://hm.baidu.com/hm.js")) {
                        return $(el).remove();
                    }
                    $(el).text(replaceHost(content));
                } else {
                    el.attribs.src = replaceHost(src);
                }
            });
            Array.from($("a")).map((el) => {
                if (el.attribs.href) el.attribs.href = replaceHost(el.attribs.href);
            });
            Array.from($("img")).map((el) => {
                if (el.attribs.src) el.attribs.src = replaceHost(el.attribs.src);
            });
            Array.from($("iframe")).map((el) => {
                if (el.attribs.src) el.attribs.src = replaceHost(el.attribs.src);
                if (el.attribs["data-src"]) el.attribs["data-src"] = replaceHost(el.attribs["data-src"]);
            });
            Array.from($("link")).map((el) => {
                if (el.attribs.href) el.attribs.href = replaceHost(el.attribs.href);
            });
            $("body").append(
                '<script>document.getElementById("apache-banner")&&document.getElementById("apache-banner").remove()</script>',
            );
            content = $.html();
        } else if (file.endsWith(".js")) {
            content = content
                .replace('"https://echarts.apache.org"', "location.origin")
                .replace(/https:\/\/echarts.apache.org\//g, "/")
                .replace(/https:\/\/echarts.apache.org/g, "/");
        }
        fs.writeFileSync(file, content);
    }
})();

function replaceHost(txt) {
    return txt
        .replace(/window\.EC_WWW_CDN_PAY_ROOT = 'https:\/\/echarts.apache.org'/g, `window.EC_WWW_CDN_PAY_ROOT = ''`)
        .replace(/https:\/\/echarts.apache.org\//g, "/")
        .replace(/https:\/\/echarts.apache.org/g, "/");
}

// NODE_PATH=$(npm root --quiet -g) node  /Users/ikrong/Documents/MyFun/documents/echarts/index.js `pwd`
