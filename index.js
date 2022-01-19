const { send } = require("process");

module.exports = function (settings) {
  
  const { exec } = require("child_process");
  const express = require("express");
  const cookieParser = require('cookie-parser');
  const router = express.Router();

  let {key, application, cache, production, serverfile } = settings;

  // SET cookie
  application.use(cookieParser());

  serverfile || (serverfile = 'index.js');
  cache || (cache = 1); // 1h

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

  const GET_PID = `Im pid ${process.pid}`;
  const SECURE_PROMPT_HTML = `
  <script type="text/javascript">
    var password = window.prompt("Enter KEY");
    if(password === '${key}'){
      document.write('👍 ${GET_PID}');
      // window.location='/';
    } else {
      document.write('👎');      
    } 
  </script>
  `;
  const SECURE_MESSAGE = `Change your password. <li>uppercase</li> <li>lowercase</li> <li>number</li> <li>special character</li> <li>6 length</li> `;

  // check pw strong
  const checkPassWord = (p) => p.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/);

  // welcome
  router.get("/", (req, res) => {
    console.log(req.cookies.pwkey); 
    res.send('👋 HI, Welcome node-express-reload.');
  });

  // init securety
  router.get("/secure", (req, res) => {

    console.log(req.cookies.pwkey);
    res.cookie('pwkey', key, {
      maxAge: 1000 * 60 * 60 * cache, // 1 hour
    });

    if(checkPassWord(key)){
      res.send(SECURE_PROMPT_HTML);
    } else {
      res.send(SECURE_MESSAGE);
    }
  });

  router.get("/kill-port/:port", function (req, res) {
    // import exec method from child_process module
    const port = req.params.port >> 0;
    console.log(`Killing port ${port}`);
    exec(`npx kill-port ${port}`);
    return res.send(`Port ${port}`);
  });

  router.get("/reload-port/:port", function (req, res) {
    // import exec method from child_process module
    const port = req.params.port >> 0;
    console.log(`reload port ${port}`);
    exec(`npx kill-port ${port} && node ${serverfile}`);
    return res.send(`Reload ${port}`);
  });

  router.get("/kill/:pid?", function (req, res) {
    // import exec method from child_process module
    const pid = req.params.pid || process.pid;
    console.log(`Killing pid ${pid}`);
    exec(`kill -9 ${pid}`);
    return res.send(`Kill pid ${pid}`);
  });

  // path.basename('/foo/bar/baz/asdf/file.html'); // out: file.html

  router.get("/reload/:pid?", function (req, res) {
    // import exec method from child_process module
    const pid = req.params.pid || process.pid;
    console.log(`Reload pid ${pid}`);
    exec(`kill -9 ${pid} && node ${serverfile}`);
    return res.send(`Reload pid ${pid}`);
  });

  router.get("/list", function (req, res) {
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

  router.get("/list-all", function (req, res) {
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
  });

  router.get("/npm/:type/:list", function (req, res) {

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

  router.get("/npm/fix", function (req, res) {

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

  return router;
};
