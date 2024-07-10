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
            if ($(script).text().includes("platform.twitter.com/widgets.js")) {
                $(script).remove();
            }
        });
        $("head").append("<style>.sl-r-banner .sl-c-alert{display:none!important;}</style>");
        fs.writeFileSync(file, $.html());
    }
})();
