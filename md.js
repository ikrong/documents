const fs = require("fs");

const documents = [
    {
        name: "vue",
        tags: ["latest", "zh-latest", "2", "zh-2"],
    },
    {
        name: "react",
        tags: ["latest", "zh-latest"],
    },
    {
        name: "angular",
        tags: ["latest"],
    },
    {
        name: "docker",
        tags: ["latest"],
    },
    {
        name: "echarts",
        tags: ["latest"],
    },
    {
        name: "element-plus",
        tags: ["latest"],
    },
    {
        name: "electron",
        tags: ["latest"],
    },
    {
        name: "sass",
        tags: ["latest"],
    },
    {
        name: "gorm",
        tags: ["latest"],
    },
    {
        name: "gin",
        tags: ["latest"],
    },
    {
        name: "tailwindcss",
        tags: ["latest"],
    },
];

function buildMarkdownTableCol(cols) {
    return `| ${cols.join(" | ")} |`;
}

function buildMarkdownTable(headers, list) {
    return [
        //
        buildMarkdownTableCol(headers.map((h) => h.replace(/^:|:$/g, ""))),
        buildMarkdownTableCol(
            headers.map((h) => {
                let sp = "------";
                if (h.startsWith(":")) {
                    sp = ":" + sp;
                }
                if (h.endsWith(":")) {
                    sp = sp + ":";
                }
                return sp;
            }),
        ),
        ...list.map(buildMarkdownTableCol),
    ].join("\n");
}

function generateMarkdownStatusTable() {
    const content = fs
        .readFileSync("./README.md")
        .toString()
        .split(/\n/g)
        .reduce(
            (data, line) => {
                if (line.startsWith("<!-- supports table start -->")) {
                    data.process = true;
                    data.content.push(line + "\n");
                } else if (line.startsWith("<!-- supports table end -->")) {
                    data.process = false;
                    data.content.push(
                        buildMarkdownTable(
                            // header
                            ["Name", "UpdatedAt", "Status", "Docker Image Tag", "Docker Pulls"],
                            documents.map((item) => {
                                const url = `https://worker.ikrong.com/dockerhub/manifest/docworld/${item.name}?lang=zh-cn`;
                                const shieldsUrl = new URL("https://img.shields.io/badge/dynamic/json");
                                shieldsUrl.searchParams.set("url", url);
                                shieldsUrl.searchParams.set("query", "$.last_updated");
                                shieldsUrl.searchParams.set("style", "flat-square");
                                shieldsUrl.searchParams.set("label", "");
                                shieldsUrl.searchParams.set("color", "#25c2a0");
                                return [
                                    //
                                    item.name,
                                    `[![${item.name}](${shieldsUrl.toString()})](https://hub.docker.com/r/docworld/${item.name})`,
                                    `[![${item.name} workflow](https://img.shields.io/github/actions/workflow/status/ikrong/documents/${item.name}.yml?style=flat-square)](https://github.com/ikrong/documents/actions/workflows/${item.name}.yml)`,
                                    item.tags.map((tag) => `docworld/${item.name}:${tag}`).join("<br/>"),
                                    `[![${item.name} pulls](https://img.shields.io/docker/pulls/docworld/${item.name}?color=%232d9cec&label=%2B&style=flat-square)](https://hub.docker.com/r/docworld/${item.name})`,
                                ];
                            }),
                        ) + "\n",
                    );
                    data.content.push(line);
                } else if (!data.process) {
                    data.content.push(line);
                }
                return data;
            },
            {
                content: [],
                process: false,
            },
        )
        .content.join("\n")
        .trim();

    fs.writeFileSync("./README.md", content);
}

generateMarkdownStatusTable();
