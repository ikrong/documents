const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const glob = require("glob").globSync;

const HOST_DIR = process.argv[2];

!(() => {
    const matchFiles = glob(path.join(HOST_DIR, "./**/*.js"));
    for (const file of matchFiles) {
        let content = fs.readFileSync(file).toString();
        const reg = /['"]https:\/\/(react\.dev\/fonts\/[\s\S]+?)['"]/g;
        if (reg.test(content)) {
            content = content.replace(reg, (_, path) => {
                return `"/cdn-resource-cached/${path}"`;
            });
            fs.writeFileSync(file, content);
        }
    }
})();
