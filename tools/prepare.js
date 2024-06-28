const core = require('@actions/core');
const fetch = require('node-fetch');

const args = process.argv.slice(2);

async function prepareRepoRevision(repos) {
    // git@github.com:owner/repo.git#revision
    // https://api.github.com/repos/owner/repo/commits?per_page=1
    const arr = repos.split(',').map(a=>a.trim()).filter(Boolean);
    const result = await Promise.all(arr.map(async (repo) => {
        const url = `https://api.github.com/repos/${repo}/commits?per_page=1`;
        const res = await (await fetch(url)).json();
        return `git@github.com:${repo}#${res[0].sha}`;
    }));
    core.exportVariable('DOCWORLD_SOURCE', result.join(','));
}

function main() {
    const fn = {
        'repo-revision': prepareRepoRevision,
    }
    fn[args[0]](...args.slice(1));
}

main()