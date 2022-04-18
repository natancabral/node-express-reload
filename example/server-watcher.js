/**
 * You need to install on terminal (node.js):
 * -----------------------------------------------------
 * $ npm install node-express-reload
 * -----------------------------------------------------
 * Run this file:
 * -----------------------------------------------------
 * $ node server-watcher.js
 * -----------------------------------------------------
 * 
 */
const path = require('path');
const express = require("express");
const app = express();
const PORT = 8099;

app.use('/ner', require("node-express-reload")({
  serverfile: __filename,
  watcher: ['.'], // {array}  __filename | . | ./ | index.js | /path-name 
  depth: 10,
}));

app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => res.send(`I'm pid ${process.pid} and port ${PORT}`));

app.listen(PORT);