const http = require('http');
const url = require('url');
const marked = require('./md').renderMd;
const fs = require('fs-extra');
const base = require('../config').baseDir;
const ejs = require('ejs');
const getFiles = require('./dir')

function generateLink(fileRelativePath) {
  return `<p>
            <a href="${fileRelativePath}">
             ${fileRelativePath.split('.').reverse()[1].split('/').reverse()[0]}
            </a>
          </p>`
}

function generateHtml(req, res, generate) {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  ejs.renderFile('./ejs/index.ejs', {
      title: req.url.split('\/').reverse()[0],
      content: generate(req.url),
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.end(data);
      }
    })
}
function getDate(e){
  return e.split('/')
  .filter(e => e !== '' && Number.isInteger(Number(e))).reduce((a, b) => a + "/" + b);
}
http.createServer(function (req, res) {
  if (req.url == '/list') {
    generateHtml(req, res, () => {
      const dateMap = new Map();
      const mds = getFiles(base + '/post')
        .filter(e => e.split('.').reverse()[0] !== 'DS_Store');
      const links = mds.map(e => generateLink('.' + e.replace(base, ''))); 
      let pre;
      const res = new Array();
      mds.forEach(e => {
          if (e !== pre){
            pre = getDate(e);
            const set = new Set();
            links.forEach(e => {
              if( getDate(e).match(pre)){
                set.add(e);
              }
            })
            dateMap.set(pre, set);
          }
        });
        let html = '';
        dateMap.forEach( (v,k)=> {
          console.log(k)
          html += `<h3><a href="./post/${k}">${k.split('/').reduce((a,b) => a + ' ' + b)}</a></h3>`;
          v.forEach(e=>{
            html += e;
          });
        });
        return html;
    });
  } else {
    if ('.md' === req.url.substring(req.url.length - 3) && fs.existsSync(base + req.url)) {
      generateHtml(req, res, () => {
        return marked(req.url)
      });
    }
  }
}).listen(4000);