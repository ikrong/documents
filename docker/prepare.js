const core = require("@actions/core");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const HOST_DIR = process.argv[2];

const goModContent = fs.readFileSync(path.join(HOST_DIR, "./go.mod")).toString();
const [, version] = /github\.com\/docker\/cli v([0-9.]+?)\+/.exec(goModContent);

core.exportVariable("tag_name", version);
