const fs = require("fs");
const path = require("path");
const glob = require("glob").globSync;

const HOST_DIR = process.argv[2];

if (!HOST_DIR) {
    console.log("no dist dir");
    return process.exit(1);
}

const content = fs.readFileSync(path.join(HOST_DIR, "./hugo.toml")).toString();

fs.writeFileSync(
    path.join(HOST_DIR, "./hugo.toml"),
    content
        .split("\n")
        .map((line) => {
            if (line.startsWith("baseURL")) {
                return `baseURL = "/"`;
            } else {
                return line;
            }
        })
        .join("\n"),
);

const matchFiles = glob(path.join(HOST_DIR, "./content/**/*.{md,html}"));

for (let i = 0; i < matchFiles.length; i++) {
    const file = matchFiles[i];
    let content = fs.readFileSync(file).toString();
    if (content.includes("https://gin-gonic.com")) {
        content = content.split("https://gin-gonic.com").join("");
        fs.writeFileSync(file, content);
    }
}
