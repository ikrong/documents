const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const glob = require("glob").globSync;

const HOST_DIR = process.argv[2];

const analyticsFile = path.join(HOST_DIR, "adev/src/app/core/services/analytics/analytics.service.ts");
let analyticsServiceContent = fs.readFileSync(analyticsFile).toString();
analyticsServiceContent = analyticsServiceContent.replace("this._installGlobalSiteTag()", "//this._installGlobalSiteTag()");
fs.writeFileSync(analyticsFile, analyticsServiceContent);
