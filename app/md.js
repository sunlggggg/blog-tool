const fs = require('fs-extra');

const marked = require('marked');

const base = require('../config').baseDir;


function renderMd(url) {
  return marked(fs.readFileSync(base + url).toString());
}

module.exports = {
  renderMd
};