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
  
  const SECURE_MESSAGE = `
    Change your password. 
    <li>uppercase</li> 
    <li>lowercase</li> 
    <li>number</li> 
    <li>special character</li> 
    <li>6 length</li> 
  `;

  const SECURE_PROMPT_HTML = `
    <script type="text/javascript">
      var password = window.prompt("Enter KEY");
      // send post value
    </script>
  `;

  // check pw strong
  const checkPassWord = (p) => p.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/);

  // Asking for the authorization
  function authSimple(req, res, next) {
    if (checkPassWord(key)) {
      res.send(SECURE_PROMPT_HTML);
    } else {
      res.send(SECURE_MESSAGE);
    }
  }

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
        // -----------------------------------------
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
        // -----------------------------------------
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
    
  // welcome
  router.get("/", auth, (req, res) => {
    // console.log(req.baseUrl);
    // res.send("👋 HI, Welcome node-express-reload.");
    res.sendFile( __dirname + '/src/terminal.html');
  });

  router.get("/pid", (req, res) => {
    res.send(`PID ${process.pid}`);
  });

  router.get("/dirname", (req, res) => {
    res.send(`PID ${__dirname}`);
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

  // init securety
  router.get("/secure", authSimple, (req, res) => {
    res.send("Secure - Simple Authentication.");
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
      // usar spawn
      exec(`kill -9 ${pid} && node ${serverfile}`);
    } catch (error) {
      console.log(error);
    }
    return res.send(`Reload pid ${pid}`);
  });

  router.get("/list", auth, function (req, res) {
    let out = "";
    exec("ps -aef | grep 'node'", (e, stdout, stderr) => {
      if (e instanceof Error) {
        console.error(e);
        //throw e;
      }
      console.log("stdout:\n", stdout);
      console.log("stderr:\n", stderr);

      out += stdout;
      out += stderr;

      exec("lsof -i", (e, stdout, stderr) => {
        if (e instanceof Error) {
          console.error(e);
          //throw e;
        }
        console.log("stdout:\n", stdout);
        console.log("stderr:\n", stderr);

        out += stdout;
        out += stderr;

        res.send("<html><pre>" + out);
      });
    });
  });

  // https://expressjs.com/en/guide/routing.html

  function listall(req, res) {
    let out = "";
    exec("ps -aef", (e, stdout, stderr) => {
      if (e instanceof Error) {
        console.error(e);
        //throw e;
      }
      console.log("stdout:\n", stdout);
      console.log("stderr:\n", stderr);

      out += stdout;
      out += stderr;

      exec("lsof -i", (e, stdout, stderr) => {
        if (e instanceof Error) {
          console.error(e);
          //throw e;
        }
        console.log("stdout:\n", stdout);
        console.log("stderr:\n", stderr);

        out += stdout;
        out += stderr;

        res.send("<html><pre>" + out);
      });
    });
  }

  router.get("/list-all", auth, listall);
  router.get("/listall", auth, listall);

  router.get("/npm/:type/:list", auth, function (req, res) {
    const list = String(req.params.list)
      .replace(/\|/g, "/")
      .split(",")
      .join(" ");

    let type =
      req.params.type === "u"
        ? "uninstall"
        : req.params.type === "i"
        ? "i"
        : false;

    if (!type || list.length < 4) {
      res.send("Error");
      return;
    }

    let out = "";
    const scrpt = `npm ${type} ${list}`;
    exec(scrpt, (e, stdout, stderr) => {
      if (e instanceof Error) {
        console.error(e);
        //throw e;
      }
      console.log("stdout:\n", stdout);
      console.log("stderr:\n", stderr);

      out += stdout;
      out += stderr;

      res.send("<html><pre>" + out);
    });
  });

  router.get("/npm/fix", auth, function (req, res) {
    let out = "";
    const scrpt = `npm audit fix`;
    exec(scrpt, (e, stdout, stderr) => {
      if (e instanceof Error) {
        console.error(e);
        //throw e;
      }
      console.log("stdout:\n", stdout);
      console.log("stderr:\n", stderr);

      out += stdout;
      out += stderr;

      res.send("<html><pre>" + out);
    });
  });

  router.get("/npm/install", auth, function (req, res) {
    let out = "";
    const scrpt = `npm install`;
    exec(scrpt, (e, stdout, stderr) => {
      if (e instanceof Error) {
        console.error(e);
        //throw e;
      }
      console.log("stdout:\n", stdout);
      console.log("stderr:\n", stderr);

      out += stdout;
      out += stderr;

      res.send("<html><pre>" + out);
    });
  });

  router.get("/npm/ls", auth, function (req, res) {
    let out = "";
    const scrpt = `npm ls`;
    exec(scrpt, (e, stdout, stderr) => {
      if (e instanceof Error) {
        console.error(e);
        //throw e;
      }
      console.log("stdout:\n", stdout);
      console.log("stderr:\n", stderr);

      out += stdout;
      out += stderr;

      res.send("<html><pre>" + out);
    });
  });

  router.get("/npm/audit", auth, function (req, res) {
    let out = "";
    const scrpt = `npm audit`;
    exec(scrpt, (e, stdout, stderr) => {
      if (e instanceof Error) {
        console.error(e);
        //throw e;
      }
      console.log("stdout:\n", stdout);
      console.log("stderr:\n", stderr);

      out += stdout;
      out += stderr;

      res.send("<html><pre>" + out);
    });
  });

  return router;
};
