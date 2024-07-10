const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const glob = require("glob").globSync;

const HOST_DIR = process.argv[2];

!(() => {
    const matchFiles = glob(path.join(HOST_DIR, "./**/*.html"));
    for (const file of matchFiles) {
        const content = fs.readFileSync(file).toString();
        const $ = cheerio.load(content);
        Array.from($("script")).map((script) => {
            const content = $(script).text();
            if (content.includes("https://fonts.googleapis.com/css")) {
                const [, url] = content.match(/['"](https?:\/\/[-a-zA-Z0-9._~!$&'()*+|,;=:@%\/?]+?)['"]/i);
                if (url) {
                    $(script).remove();
                    $("head").append(`<link rel="stylesheet" href="${url}">`);
                }
            }
        });
        fs.writeFileSync(file, $.html());
    }
})();
