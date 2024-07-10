const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const glob = require("glob").globSync;

const HOST_DIR = process.argv[2];

!(() => {
    const matchFiles = glob(path.join(HOST_DIR, "./**/*.{html,js,css}"));
    for (const file of matchFiles) {
        const content = fs.readFileSync(file).toString();
        fs.writeFileSync(file, content.replace(/https:\/\/docs\.docker\.com\//g, "/"));
    }
})();
