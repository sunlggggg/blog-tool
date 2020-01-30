const http = require('http');
const url = require('url');
const util = require('util');
const marked = require('marked');
const fs = require('fs-extra');

http.createServer(function (req, res) {
    const path = req.url.substring(1);
    console.log(path);
    if ('.md' === req.url.substring(req.url.length - 3) && fs.existsSync(path)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(marked(fs.readFileSync(path).toString()) +
            `<style type="text/css">
            img {
                max-width: 720px;
                text-align: center;
            }
            body {
                min-width: 740px;
                margin-top: 20px;
                margin-left: 300px;
                margin-right:  300px;
            }
      </style>`);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404');
    }

}).listen(3000);