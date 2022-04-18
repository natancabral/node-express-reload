var chokidar = require('chokidar');
var path = require('path');

module.exports = function(dir){
  console.log('Router watch', dir)
  let rootFolder = dir
  if(dir.charAt(dir.length - path.sep.length) !== path.sep) {
    console.log('Testing if the folder is a folder')
    rootFolder = path.dirname(dir).replace(new RegExp('\\' + path.sep, 'g'), '/')
  }
  var watcherlive = chokidar.watch(rootFolder)
  var re = new RegExp(rootFolder)
  console.log('regex created', re)
  watcherlive.on('ready', function() {
    watcherlive.on('all', function() {
      console.log('Clearing ' + rootFolder + ' module cache from server')
      Object.keys(require.cache).forEach(function(id) {
        if (re.test(id.replace(new RegExp('\\' + path.sep, 'g'), '/'))) {
          console.log('deleting cache key')
          delete require.cache[id]
        }
      })
    })
  })
  require(dir);
  return function(req, res, next) {
    console.log('require hot reload')
    require(dir)(req, res, next);
  }
}