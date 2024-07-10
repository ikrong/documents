const fetch = require("node-fetch");
const fs = require("fs");
const decompress = require("decompress");
const path = require("path");

function getMarkdownHeader(content, filepath) {
    return content
        .split(/\n/g)
        .reduce(
            (data, line) => {
                if (line === "---" && !data.process) {
                    data.process = true;
                } else if (line === "---" && data.process) {
                    data.end = true;
                } else if (data.process && !data.end) {
                    if (String(line).startsWith("slug:")) {
                        line = `slug: ${path.parse(filepath).name}`;
                    }
                }
                data.content.push(line);
                return data;
            },
            { content: [], process: false, end: false },
        )
        .content.join("\n");
}

!(async () => {
    const languages = ["zh-CN", "fr", "de", "ja", "pt-BR", "ru", "es-ES"];
    for (let i = 0; i < languages.length; i++) {
        const data = await (
            await fetch(`https://crowdin.com/backend/download/project/electron/${languages[i]}.zip`, {
                headers: {
                    referer: "https://crowdin.com/project/electron/",
                },
            })
        ).buffer();
        await decompress(data, "./source/", {
            map: function (file) {
                if (file.path.toLocaleLowerCase().endsWith(".md")) {
                    file.data = Buffer.from(getMarkdownHeader(file.data.toString("utf8"), file.path));
                }
                return file;
            },
        });
    }
})();
