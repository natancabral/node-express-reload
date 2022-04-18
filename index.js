module.exports = function (settings) {

  const { exec } = require("child_process");
  // Cookie
  const cookieParser = require("cookie-parser");
  // Importing express module
  const express = require("express");
  // Importing express-session module
  const session = require("express-session");
  // Importing file-store module
  const filestore = require("session-file-store")(session);
  // Router
  const router = express.Router();
  
  let { username, password, application, pwcache, production, serverfile, neruservar, storage } = settings;

  serverfile || (serverfile = "index.js");
  pwcache || (pwcache = 1); // 1h
  neruservar || (neruservar = 'ner_user_auth');
  storage || (storage = 'cookie'); // session
  username || (username = 'admin');
  application = router;

  // // set
  // res.cookie(cookie_name, 'value', {
  //   maxAge: 1000 * 60 * 60, // 1 hour
  // });
  // // get
  // req.cookies.username;
  // // delete
  // res.clearCookie(cookieName);
  // // redirect
  // res.redirect('/');

  if(storage === 'cookie') {
    // Use Cookie
    application.use(
      cookieParser()
    );
  } else {
    // Use Session
    application.use(
      session({
        name: "session-ner-name",
        secret: "session-ner-key", // Secret key,
        saveUninitialized: false,
        resave: false,
        // store: new filestore(),
      })
    );
  }
  
  const HTML_PRE = `"<html><pre>`;

  const SECURE_MESSAGE = `
    Change your password. 
    <li>uppercase</li> 
    <li>lowercase</li> 
    <li>number</li> 
    <li>special character</li> 
    <li>6 length</li> 
  `;

  // check pw strong
  const checkPassWord = (p) => p.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/);

  // Asking for the authorization
  function auth(req, res, next) {
    
    if(!password) {
      const err = 'Set password on node-express-load package.\nhttps://www.npmjs.com/package/node-express-reload';
      res.send(`<pre>Error: ${err}`)
      throw new Error(err);
      return;
    }

    // console.log(
    //   req.cookies,
    //   req.signedCookies,
    //   req.headers.authorization,
    //   req.headers
    // )

    const getData = () => {
      const authHeader = req.headers.authorization;
      return authHeader ? new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':') : ['', ''];
    }

    const noAuthenticate = () => {
      console.log('Unauthorized');
      res.setHeader("WWW-Authenticate", "Basic")
      res.sendStatus(401);
    } 

    let userSTORAGE;
    
    if(storage === 'cookie') {
      userSTORAGE = req.cookies[neruservar];
      // console.log('cookie', userSTORAGE);
    } else {
      userSTORAGE = req.session[neruservar];
      // console.log('session', userSTORAGE);
    }

    // Checking for the authorization
    if (userSTORAGE === username) {
      // Allow
      next();
    } else if (!userSTORAGE) {
      // Get headers authorization
      const [usernameAUTH, passwordAUTH] = getData();
      // Check user and pass
      if (usernameAUTH === username && passwordAUTH === password) {
        // Storage
        // ----------------------------------------------------------
        if(storage === 'cookie') {
          res.cookie(`${neruservar}`, username, {
            path: '/ner',
            // maxAge: 1000 * 60 * 60 * cache, // 1 hour
            maxAge: 1000 * 60 * pwcache, // 1 min
            // overwrite: true,
            httpOnly: true,
          });
        } else {
          // console.log('Entrou(2)');
          req.session[neruservar] = username;
        }
        // ----------------------------------------------------------
        console.log('Authenticate');
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

  function execScript(scrpt) {
    return new Promise((resolve, reject) => {
      try {
        exec(scrpt, (error, stdout, stderr) => {
          if (error instanceof Error) {
            console.error(error);
            //throw new Error(error);
            reject(error);
          }
          console.log("stdout:\n", stdout);
          console.log("stderr:\n", stderr);
          let output = stdout + stderr;
          resolve(output);
        });            
      } catch (error) {
        reject(error);        
      }
    });
  }

  // refresh
  // res.redirect(req.get('referer'));
  // https://www.npmjs.com/package/chokidar
    
  router.get("/", auth, (req, res) => {
    // console.log(req.baseUrl);
    // res.send("👋 HI, Welcome node-express-reload.");
    res.sendFile( __dirname + '/src/terminal.html');
  });

  router.get("/pid", (req, res) => {
    res.send(`${process.pid}`);
  });

  router.get("/dirname", (req, res) => {
    res.send(`${__dirname}`);
  });

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
      req.locals[neruservar] = null;
      // req.session.destroy();  
      // req.logout();
    }
    res.send("Logout. 👋 Clear all cookies and session.");
  });

  router.get("/kill-port/:port", auth, function (req, res) {
    // import exec method from child_process module
    const port = req.params.port >> 0;
    console.log(`Killing port ${port}`);
    exec(`npx kill-port ${port}`);
    return res.send(`Port ${port}`);
  });

  router.get("/reload-port/:port", auth, function (req, res) {
    // import exec method from child_process module
    const port = req.params.port >> 0;
    console.log(`reload port ${port}`);
    exec(`npx kill-port ${port} && node ${serverfile}`);
    return res.send(`Reload ${port}`);
  });

  router.get("/kill/:pid?", auth, function (req, res) {
    // import exec method from child_process module
    const pid = req.params.pid || process.pid;
    console.log(`Killing pid ${pid}`);
    exec(`kill -9 ${pid}`);
    return res.send(`Kill pid ${pid}`);
  });

  // path.basename('/foo/bar/baz/asdf/file.html'); // out: file.html

  // Message:
  // Incomplete response received from application
  // Solution:
  // usar spawn

  router.get("/reload/:pid?", auth, function (req, res) {
    // import exec method from child_process module
    const pid = req.params.pid || process.pid;
    console.log(`Reload pid ${pid}`);
    try {
      exec(`kill -9 ${pid} && node ${serverfile}`);
    } catch (error) {
      console.log(error);
      res.send(`${error}`);
    }
    return res.send(`Reload pid ${pid}`);
  });

  router.get("/list", auth, async function (req, res) {
    let output = "";
    output += await execScript("ps -aef | grep 'node'");
    res.send(HTML_PRE + output)
  });

  router.get("/list-all", auth, async function (req, res) {
    let output = "";
    output += await execScript("ps -aef");
    output += await execScript("lsof -i");
    res.send(HTML_PRE + output)
  });

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

    const scrpt = `npm ${type} ${list}`;
    const output = await execScript(scrpt);
    res.send(HTML_PRE + output)
  });

  router.get("/npm/fix", auth, async function (req, res) {
    const scrpt = `npm audit fix`;
    const output = await execScript(scrpt);
    res.send(HTML_PRE + output)
  });

  router.get("/npm/install", auth, async function (req, res) {
    const scrpt = `npm install`;
    const output = await execScript(scrpt);
    res.send(HTML_PRE + output)
  });

  router.get("/npm/ls", auth, async function (req, res) {
    const scrpt = `npm ls`;
    const output = await execScript(scrpt);
    res.send(HTML_PRE + output)
  });

  router.get("/npm/audit", auth, async function (req, res) {
    const scrpt = `npm audit`;
    const output = await execScript(scrpt);
    res.send(HTML_PRE + output)
  });

  return router;
};