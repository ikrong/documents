const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const HOST_DIR = process.argv[2];

fetch("https://sponsors.vuejs.org/data.json")
    .then((res) => res.text())
    .then((text) => {
        const file = path.join(HOST_DIR, "sponsors.vuejs.org/data.json");
        const dir = path.dirname(file);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(file, text);
    });
