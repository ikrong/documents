const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const glob = require("glob").globSync;

const HOST_DIR = process.argv[2];

fetch("https://sponsors.vuejs.org/data.json")
    .then((res) => res.text())
    .then(async (text) => {
        const file = path.join(HOST_DIR, "sponsors.vuejs.org/data.json");
        const dir = path.dirname(file);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(file, text);
        const data = JSON.parse(text);
        const imgs = Object.values(data)
            .flat()
            .map((a) => a.img)
            .filter(Boolean);
        for (const img of imgs) {
            const url = `https://sponsors.vuejs.org/images/${img}`;
            const file = path.join(HOST_DIR, "sponsors.vuejs.org/images", img.replace(/\.png$/, ".avif").split("?")[0]);
            const dir = path.dirname(file);
            fs.mkdirSync(dir, { recursive: true });
            const buff = await fetch(url).then((res) => res.buffer());
            fs.writeFileSync(file, buff);
        }
    });

// !(() => {
//     const matchFiles = glob(path.join(HOST_DIR, "./**/*.html"));
//     for(const file of matchFiles) {
//         const content = fs.readFileSync(file).toString();
//         const $ = cheerio.load(content);
//         $('head').append('<style>.VPNavBarSearch.search {display:none!important;}</style>');
//         fs.writeFileSync(file, $.html());
//     }
// })()
