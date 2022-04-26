module.exports = function (settings) {

  if(typeof settings === 'string' && settings === 'require-watcher') {
    return require('./require-watcher');
  }
  // OS
  const os = require('os');
  // Child Process
  const { exec } = require("child_process");
  // Cookie
  const cookieParser = require("cookie-parser");
  // Importing express module
  const express = require("express");
  // Importing express-session module
  const session = require("express-session");
  const { MemoryStore } = session;
  // Watcher
  const chokidar = require('chokidar');
  // Importing file-store module
  const filestore = require("session-file-store")(session);
  // Router
  const router = express.Router();
  const path = require('path');
  // Kill process
  const { kill, killer } = require('cross-port-killer');

  // Variables
  let { username, password, application, pwcache, production, serverfile, neruservar, storage, removeterminal, watcher, depth, port } = settings;
  let watcherlive = null;

  // Validate
  serverfile || (serverfile = 'index.js');
  pwcache || (pwcache = 1); // 1h
  neruservar || (neruservar = 'ner_user_auth');
  storage || (storage = 'cookie'); // cookie | session | memory
  username || (username = 'admin');
  application || (application = router);
  watcher || (watcher = null);
  // production || (process.env.NODE_ENV)

  // Storage
  // - cookie
  // - session
  // - momey 
  if(storage === 'cookie') {
    // Use Cookie
    application.use(
      cookieParser()
    );
  } else {
    // Use Session
    application.use(
      session({
        path: '/ner',
        name: "session-nerw-name",
        secret: "session-ner-key", // Secret key,
        saveUninitialized: false,
        resave: false,
        unset: 'destroy',
        maxAge: 1000 * 60 * pwcache, // 1 min
        store: storage === 'memory' ? new MemoryStore({ checkPeriod: 1000 * 60 * pwcache, path: '/ner' }) : new filestore({}),
      })
    );
  }
  
  // Base HTML <pre>
  const HTML_PRE = '<html><pre>';

  // ----------------------------------------------------------------
  // Authentication
  // ----------------------------------------------------------------

  // Check pw strong
  const checkPassWord = (p) => p.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/);

  // Asking for the authorization
  function auth(req, res, next) {
    
    // No password
    if(!password) {
      const err = 'Set password on node-express-load package. \nhttps://www.npmjs.com/package/node-express-reload';
      res.send(`${HTML_PRE}Error: ${err}`)
      // throw new Error(err);
      return;
    }

    // Bad password
    if(!checkPassWord(password)) {
      const err = `Change your password. \n- uppercase\n- lowercase\n- number\n- special character\n- 6 length`;
      res.send(`${HTML_PRE}Error: ${err}`)
      // throw new Error(err);
      return;
    }

    // console.log(
    //   req.cookies,
    //   req.signedCookies,
    //   req.headers.authorization,
    //   req.headers
    // )

    // Get values authorization
    const getData = () => {
      const {authorization} = req.headers;
      return authorization ? new Buffer.from(authorization.split(' ')[1], 'base64').toString().split(':') : ['', ''];
    }

    // Open dialog
    const noAuthenticate = () => {
      console.log('Unauthorized');
      res.setHeader("WWW-Authenticate", "Basic")
      res.sendStatus(401);
    } 

    // Get user from storage
    let userSTORAGE;    
    if(storage === 'cookie') {
      userSTORAGE = req.cookies[neruservar];
    } else {
      userSTORAGE = req.session[neruservar];
    }

    // Checking authorization
    if (userSTORAGE === username) {
      // Allowed :))
      next();
    } else if (!userSTORAGE) {
      // Get headers authorization
      const [usernameAUTH, passwordAUTH] = getData();
      // Check user and pass
      if (usernameAUTH === username && passwordAUTH === password) {
        // Storage
        if(storage === 'cookie') {
          // Cookie
          res.cookie(`${neruservar}`, username, {
            path: '/ner',
            maxAge: 1000 * 60 * pwcache, // 1 min
          });
        } else {
          // Session
          req.session[neruservar] = username;
        }
        // Allowed :))
        next();
      } else {
        // Ops :(
        return noAuthenticate();
      }
    } else {
      // Ops :(
      return noAuthenticate();
    }
  }

  // Run script
  function execScript(script) {
    return new Promise((resolve, reject) => {
      try {
        exec(script, (error, stdout, stderr) => {
          if (error instanceof Error) {
            console.error(error);
            //throw new Error(error);
            reject(error);
          } else {
            // console.log("stdout:\n", stdout);
            // console.log("stderr:\n", stderr);
            let out = stdout + stderr;
            if(script.match(/kill/gi) && String(out).toLowerCase().match(/incomplete response received from application/gi)) {
              resolve('Goodbye 👋 (maybe reload)');
            } else {
              resolve(out);
            }            
          }
        });            
      } catch (error) {
        reject(error);        
      }
    });
  }

  // Routers
  // ----------------------------------------------------------------

  // refresh
  // res.redirect(req.get('referer'));
  // https://www.npmjs.com/package/chokidar
  
  // Terminal
  router.get("/", auth, (req, res) => {
    // req.baseUrl;
    if(removeterminal === true) {
      res.send("👋 HI, Welcome node-express-reload.");
    } else {
      res.sendFile( __dirname + '/src/terminal.html');
    }
  });

  // List sessions and cookies
  router.get("/sessions", auth, function(req, res){
    console.log(req.session);
    res.send({ session: req.session || {}, cookie: req.cookies || {} });
  });

  // Post
  router.get("/port", (req, res) => {
    res.send(`${req.socket.localPort}`);
  });

  // PID
  router.get("/pid", (req, res) => {
    res.send(`${process.pid}`);
  });

  // __dirname
  router.get("/dirname", auth, (req, res) => {
    res.send(`${__dirname}`);
  });

  // Logout
  router.get("/logout", (req, res) => {
    res.setHeader("WWW-Authenticate", "Basic"); // realm="Access to the staging site", charset="UTF-8"
    res.status(401);
    if(storage === 'cookie') {
      // Clear cookie
      res.cookie(neruservar, '', { path: '/ner', maxAge: 1, expires: Date.now(0), overwrite: true, httpOnly: true });
      res.clearCookie(neruservar);
    } else {
      // Clear session
      req.session[neruservar] = null;
      delete req.session[neruservar];
    }
    res.send("Logout. 👋 Clear all cookies and session.");
  });

  // Destroy all
  router.get("/destroy", auth, (req, res) => {
    try {
      // Destroy cookies
      if(req.cookies){
        for(const name in req.cookies) {
          res.clearCookie(name);
        }  
      }
      // Destroy sessions
      if(req.session){
        req.session.cookie.expires = Date.now();
        req.session.cookie.maxAge = 0;
        req.session.destroy();
      }
      // Remove autehntication
      res.setHeader("WWW-Authenticate", "Basic"); // realm="Access to the staging site", charset="UTF-8"
      res.status(401);
      // Message
      res.send("Destroy all cookies and session.");
    } catch (error) {
      res.send("Ops. :(");      
    }
  });
  
  // Kill port
  router.get("/kill-port/:port?", auth, function (req, res) {
    // import exec method from child_process module
    const port = req.params.port || req.socket.localPort;
    console.log(`Killing port ${port}`);
    // Unix
    exec(`npx kill-port ${port}`);
    return res.send(`Port ${port}`);
  });

  // 1
  // https://www.npmjs.com/package/cross-port-killer
  // 2
  // https://www.npmjs.com/package/tree-kill

  // Kill PID
  router.get("/kill/:pid?", auth, function (req, res) {
    // import exec method from child_process module
    const pid = req.params.pid || process.pid;
	  let script = '';
    console.log(`Killing pid ${pid}`);

    killer.killByPids([pid]).then(() => console.log('done')).catch(err => {

      // 'aix', 'darwin', 'freebsd','linux', 'openbsd', 'sunos', and 'win32'
      switch(os.platform()) {
        case 'win32':
          script = `Taskkill /F /PID ${pid}`; break;
        default:
          script = `kill -9 ${pid}`; break;
      }
        
      execScript(script);

    });

    req.params.pid || process.exit();
    return res.send(`Kill pid ${pid}`);
  });

  // path.basename('/foo/bar/baz/asdf/file.html'); // out: file.html

  // Message:
  // Incomplete response received from application
  // Solution:
  // usar spawn

  // Reload PID
  router.get("/reload/:pid?", auth, async function (req, res) {
    // import exec method from child_process module
    const pid = req.params.pid || process.pid;
  	let script = '';
    console.log(`Reload pid ${pid}`);

    // 'aix', 'darwin', 'freebsd','linux', 'openbsd', 'sunos', and 'win32'
  	switch(os.platform()) {
      case 'win32': script = `Taskkill /F /PID ${pid} 1>2 & node ${serverfile}`; break;
      default:      script = `kill -9 ${pid} && node ${serverfile}`;
  	}

    execScript(script);
    return res.send( script ? `Reload pid ${pid}` : `Ops!` );
  });

  // List process
  router.get("/list", auth, async function (req, res) {
    let output = "";
	  let script = '';
    // 'aix', 'darwin', 'freebsd','linux', 'openbsd', 'sunos', and 'win32'
	  switch(os.platform()) {
      case 'win32': script = `tasklist /NH | findstr /I node`; break;
      default:      script = `ps -aef | grep 'node'`;
	  }
    output += await execScript(script);
    res.send(HTML_PRE + output)
  });

  // List all processes
  router.get("/list-all", auth, async function (req, res) {
    let output = "";
    // 'aix', 'darwin', 'freebsd','linux', 'openbsd', 'sunos', and 'win32'
	  switch(os.platform()) {
      case 'win32': output += await execScript("tasklist /NH");	 break;
      default:      output += await execScript("ps -aef");
		                output += await execScript("lsof -i"); 
	}
    res.send(HTML_PRE + output)
  });

  // NPM install and uninstall
  router.get("/npm/:type/:list", auth, async function (req, res) {
    const list = String(req.params.list)
      .replace(/[\n\r\t]/g, '') // scape
      .replace(/[\'\"\`]/g, '') // scape
      .replace(/\&/g, '') // scape
      .replace(/\:/g, '') // scape
      .replace(/\-\-/g,'') // scape
      .replace(/\|/g, '/')
      .split(",")
      .join(" ");

    let type =
      req.params.type === "u"
        ? "uninstall"
        : req.params.type === "i"
        ? "install"
        : false;

    if (!type || list.length < 4) {
      res.send("Error");
      return;
    }

    const script = `npm ${type} ${list}`;
    const output = await execScript(script);
    res.send(HTML_PRE + output)
  });

  // NPM fix
  router.get("/npm/fix", auth, async function (req, res) {
    const script = `npm audit fix`;
    const output = await execScript(script);
    res.send(HTML_PRE + output)
  });

  // NPM install package.json
  router.get("/npm/install", auth, async function (req, res) {
    const script = `npm install`;
    const output = await execScript(script);
    res.send(HTML_PRE + output)
  });

  // NPM ls
  router.get("/npm/ls", auth, async function (req, res) {
    const script = `npm ls`;
    const output = await execScript(script);
    res.send(HTML_PRE + output)
  });

  // NPM audit
  router.get("/npm/audit", auth, async function (req, res) {
    const script = `npm audit`;
    const output = await execScript(script);
    res.send(HTML_PRE + output)
  });

  // ----------------------------------------------------------------
  // Watcher
  // ----------------------------------------------------------------

  // Watcher - Close
  function watchClose() {
    // Stop watching.
    // The method is async!
    watcherlive && watcherlive.close().then(() => console.log('closed'));
  }

  // Watcher - Start
  (function(wtch) {

    if(!wtch) return;

    let dir = Array.isArray(wtch) ? wtch : [ String(wtch) ];

    watcherlive = chokidar.watch(dir, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      // ignored: '*.txt',
      persistent: true,
      depth: depth || 10,
    }).on('all', (event, path) => {
      console.log(event, path);
    });
    
    // watcherlive
      // .on('add', path => console.log(`File ${path} has been added`))
      // .on('change', path => {
      //   exec(`kill -9 ${process.pid} && node ${serverfile}`);
      //   console.log(`File ${path} has been changed @@@@`)
      // })
      // .on('unlink', path => console.log(`File ${path} has been removed`));

    // More possible events.
    // watcherlive
    //   .on('addDir', path => console.log(`Directory ${path} has been added`))
    //   .on('unlinkDir', path => console.log(`Directory ${path} has been removed`))
    //   .on('error', error => console.log(`Watcher error: ${error}`))
    //   .on('ready', () => console.log('Initial scan complete. Ready for changes'))
      // .on('raw', (event, path, details) => { // internal
      //   console.log('Raw event info:', event, path, details);
      // });

    // 'add', 'addDir' and 'change' events also receive stat() results as second
    // argument when available: https://nodejs.org/api/fs.html#fs_class_fs_stats
    watcherlive.on('change', (path, stats) => {
      if (stats) console.log(`File ${path} changed size to ${stats.size}`);

      switch(os.platform()) {
        case 'win32': script = `Taskkill /F /PID ${process.pid}`; break;
        default:      script = `kill -9 ${process.pid} && node ${serverfile}`;
      }

      execScript(script);
      process.exit();
    });

  })(watcher);

  // Routers
  // ----------------------------------------------------------------

  router.get("/watcher/:close?", auth, (req, res) => {
    const {close} = req.params || {};
    if(close === 'close' || close === 'exit') {
      watchClose();
      res.send(`Close watcher list.`);
    } else {
      if(watcher) {
        res.send(`Start watcher files and folders... ${Array.isArray(watcher) ? watcher.join(', ') : watcher }`);
      } else {
        res.send(`No have watcher list.`);
      }
    }
  });

  return router;
};