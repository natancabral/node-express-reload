var express = require('express');
var app = express.Router();

app.get('/', (req, res) => {
  res.send('Hello World 1');
})

module.exports = app