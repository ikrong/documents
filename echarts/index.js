const fs = require("fs");
const cheerio = require("cheerio");
const glob = require("glob").globSync;
const path = require("path");

/**替换大法 */
function replaceHost(txt) {
  txt = txt.replace(
    /window\.EC_WWW_CDN_PAY_ROOT = 'https:\/\/echarts.apache.org'/g,
    `window.EC_WWW_CDN_PAY_ROOT = ''`
  );
  txt = txt.replace(
    /acorn@8.7.1\/dist\/acorn.min.js/g,
    "acorn@8.7.1/dist/acorn.js"
  );
  txt = txt.replace(
    /codemirror@5.56.0\/lib\/codemirror.min.js/g,
    "codemirror@5.56.0/lib/codemirror.js"
  );
  txt = txt.replace(
    /highlight.js@9.12.0\/styles\/github-gist.min.css/g,
    "highlight.js@9.12.0/styles/github-gist.css"
  );
  txt = txt.replace(
    /code-prettify@0.1.0\/src\/prettify.min.js/g,
    "code-prettify@0.1.0/src/prettify.js"
  );

  txt = txt.replace(/https:\/\/echarts.apache.org\//g, "/");
  txt = txt.replace(/https:\/\/echarts.apache.org/g, "/");

  txt = txt.replace(
    /https:\/\/fastly.jsdelivr.net\/npm\//g,
    "https://unpkg.com/"
  );
  txt = txt.replace(
    /\/\/fastly.jsdelivr.net\/npm\//g,
    "//unpkg.com/"
  );
  return txt;
}

function replaceHTML(file) {
  const content = fs.readFileSync(file).toString();
  const $ = cheerio.load(content);
  const tags = {
    link: ["href"],
    script: ["src"],
    a: ["href"],
    img: ["src"],
    iframe: ["data-src", "src"],
  };
  Object.keys(tags).map((tag) => {
    const attrs = tags[tag];
    attrs.map((attr) => {
      Array.from($(`${tag}[${attr}]`)).map((el) => {
        el.attribs[attr] = replaceHost(el.attribs[attr]);
      });
    });
  });
  Array.from($("script")).map((el) => {
    $(el).text(replaceHost($(el).text()));
  });
  fs.writeFileSync(file, $.html());
}

function replaceText(file) {
  const content = fs.readFileSync(file).toString();
  fs.writeFileSync(file, replaceHost(content));
}

async function main() {
  const matchFiles = glob("/app/echarts-website/**/*.{js,json,html,css}");

  for (let i = 0; i < matchFiles.length; i++) {
    const file = matchFiles[i];
    const { ext } = path.parse(file);
    switch (ext) {
      case ".html":
        replaceHTML(file);
        break;
      default:
        replaceText(file);
        break;
    }
  }
}

main();
