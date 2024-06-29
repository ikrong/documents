const fs = require("fs");
const path = require("path");


const adTextEjs = path.join(HOST_DIR, "themes/vue/layout/partials/ad-text.ejs");
fs.writeFileSync(adTextEjs, "")