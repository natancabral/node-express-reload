/**
 * You need to install on terminal (node.js):
 * -----------------------------------------------------
 * $ npm install node-express-reload
 * -----------------------------------------------------
 * Run this file:
 * -----------------------------------------------------
 * $ node server-silent.js
 * -----------------------------------------------------
 * 
 */
const path = require('path');
const express = require("express");
const app = express();
const PORT = 8099;

// Silent Reload module
const requireWatcher = require("node-express-reload")('require-watcher');
app.use('/home', requireWatcher( __dirname + '/home/index.js'))
// or
// app.use('/home', requireWatcher( __dirname + '/home/'))

app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => res.send(`I'm pid ${process.pid} and port ${PORT}`));

app.listen(PORT);