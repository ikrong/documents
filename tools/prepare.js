const core = require("@actions/core");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);

async function prepareRepoRevision(repos, branch) {
    // git@github.com:owner/repo.git#revision
    // git url format： https://gist.github.com/mmngreco/24a4429c8ab3afa859fef5a8f317fe5b
    // https://api.github.com/repos/owner/repo/commits?per_page=1
    const arr = repos
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);
    const result = await Promise.all(
        arr.map(async (repo) => {
            const url = `https://api.github.com/repos/${repo}/commits${branch ? `/${branch}` : ""}?per_page=1`;
            const res = await (
                await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                        "X-GitHub-Api-Version": "2022-11-28",
                        Accept: "application/vnd.github+json",
                    },
                })
            ).json();
            return `git@github.com:${repo}#${res.sha || res[0].sha}`;
        }),
    );
    core.exportVariable("DOCWORLD_SOURCE", result.join(","));
}

async function updateDockerReadme(username, password, repo) {
    const readme = fs.readFileSync(path.join(__dirname, "..", repo, "README.md")).toString();
    let resp = await (
        await fetch("https://hub.docker.com/v2/users/login", {
            body: JSON.stringify({
                username,
                password,
            }),
            headers: {
                "content-type": "application/json",
            },
            method: "post",
        })
    ).json();
    const token = resp.token;
    resp = await fetch(`https://hub.docker.com/v2/repositories/${username}/${repo}`, {
        body: JSON.stringify({
            description: "有时候国内访问文档特别慢，所以做了一个镜像，方便本地查看文档。",
            full_description: readme,
        }),
        headers: {
            "content-type": "application/json",
            authorization: `JWT ${token}`,
        },
        method: "patch",
    });
    console.log(`修改docker readme: ${resp.status}`);
    resp = await fetch(`https://hub.docker.com/v2/repositories/${username}/${repo}/categories/`, {
        body: JSON.stringify([
            { slug: "developer-tools", name: "developer-tools" },
            { slug: "internet-of-things", name: "internet-of-things" },
        ]),
        headers: {
            "content-type": "application/json",
            authorization: `JWT ${token}`,
        },
        method: "patch",
    });
    console.log(`修改docker categories: ${resp.status}`);
}

async function getLatestReleaseTag(repo, variableName = "tag_name") {
    const url = `https://api.github.com/repos/${repo}/releases/latest`;
    const res = await (
        await fetch(url, {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                "X-GitHub-Api-Version": "2022-11-28",
                Accept: "application/vnd.github+json",
            },
        })
    ).json();
    core.exportVariable(variableName, res.tag_name);
}

function main() {
    const fn = {
        "repo-revision": prepareRepoRevision,
        "repo-release-tag": getLatestReleaseTag,
        "update-readme": updateDockerReadme,
    };
    fn[args[0]](...args.slice(1));
}

main();
