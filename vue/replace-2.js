const fs = require("fs");
const path = require("path");

const HOST_DIR = process.argv[2];

const adTextEjs = path.join(HOST_DIR, "themes/vue/layout/partials/ad-text.ejs");
fs.writeFileSync(adTextEjs, "");
