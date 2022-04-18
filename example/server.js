/**
 * You need to install on terminal (node.js):
 * -----------------------------------------------------
 * $ npm install node-express-reload
 * -----------------------------------------------------
 * Run this file:
 * -----------------------------------------------------
 * $ node server.js
 * -----------------------------------------------------
 * 
 */
const path = require('path');
const express = require("express");
const app = express();
const PORT = 8099;

// ** Secure change ** 
// ** change route /ner to /any-another-word **
app.use('/ner', require("node-express-reload")({
  username: 'admin', // if not defined, your username will be admin
  password: '&HSN15KQi!Ç', // required
  serverfile: __filename, // ./index.js or ./server.js. call on restart
  // pwcache: 12, // password cache in minutes
  // storage: 'session', // cookie, session, memory 
  watcher: ['.'], // {array}  __filename | . | ./ | index.js | /path-name 
  depth: 10,
}));

// const requireWatcher = require("node-express-reload")('require-watcher-router');
// app.use('/home', requireWatcher('./home/index.js'))

app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => res.send(`I'm pid ${process.pid} and port ${PORT}`));

app.listen(PORT);