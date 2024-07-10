const fs = require("fs");
const path = require("path");

const tpl = `<script setup></script><template><div></div></template><style></style>`;

const HOST_DIR = process.argv[2];

const files = [
    //
    ".vitepress/theme/components/TextAd.vue",
    ".vitepress/theme/components/WwAds.vue",
];

for (let file of files) {
    fs.writeFileSync(path.join(HOST_DIR, file), tpl);
}

const sponsors = path.join(HOST_DIR, ".vitepress/theme/components/sponsors.ts");
fs.writeFileSync(
    sponsors,
    fs
        .readFileSync(sponsors)
        .toString()
        .split("\n")
        .map((line) => {
            if (line.startsWith("export const base ")) {
                return `export const base = '/sponsors.vuejs.org'`;
            }
            return line;
        })
        .join("\n"),
);
