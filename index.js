const { send } = require("process");

module.exports = function (settings) {
  
  const { exec } = require("child_process");
  const express = require("express");
  const cookieParser = require('cookie-parser');
  const router = express.Router();
  const storage = require('./storage');

  let {key, application, cache, production, serverfile } = settings;

  // SET cookie
  application.use(cookieParser());

  serverfile || (serverfile = 'index.js');

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
    console.log(req.cookies.OPA); 
    console.log(storage.getItem('OPA2'));
    res.send('Hi');
  });

  // init securety
  router.get("/secure", (req, res) => {

    console.log(req.cookies.OPA);
    console.log(storage.getItem('OPA2'));

    res.cookie('OPA', 'VALUE', {
      maxAge: 1000 * 60 * 60, // 1 hour
    });
    storage.setItem('OPA2','VALUE2');

    if(checkPassWord(key)){
      res.send(SECURE_PROMPT_HTML);
    } else {
      res.send(SECURE_MESSAGE);
    }
  });

  router.get("/kill-port/:port", function (req, res) {
    // import exec method from child_process module
    const port = req.params.port >> 0;
    exec(`npx kill-port ${port}`);
    return res.send("kill-port " + port);
  });

  router.get("/reload-port/:port", function (req, res) {
    // import exec method from child_process module
    const port = req.params.port >> 0;
    exec(`npx kill-port ${port} && node ${serverfile}`);
    return res.send("kill-port " + port);
  });

  router.get("/kill/:pid?", function (req, res) {
    // import exec method from child_process module
    const pid = req.params.pid || process.pid;
    exec(`kill -9 ${pid}`);
    return res.send("process killed");
  });

  // path.basename('/foo/bar/baz/asdf/file.html'); // out: file.html

  router.get("/reload/:pid?", function (req, res) {
    // import exec method from child_process module
    const pid = req.params.pid || process.pid;
    exec(`kill -9 ${pid} && node ${serverfile}`);
    return res.send("process killed");
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

  router.get("/npm/:type/:pid/:list", function (req, res) {
    const list = String(req.params.list)
      .replace(/\|/g, "/")
      .split(",")
      .join(" ");
    const pid1 = req.params.pid >> 0;
    const pid2 = process.pid >> 0;
    let type =
      req.params.type === "u"
        ? "uninstall"
        : req.params.type === "i"
        ? "i"
        : false;

    if (!type || !pid1 || !pid2 || pid1 !== pid2 || list.length < 4) {
      //res.send((pid1 === pid2 ? 'TRUE' : 'FALSE') + '|' + pid1 + '|' + pid2);
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

  router.get("/npm/fix/:pid", function (req, res) {
    const pid1 = req.params.pid >> 0;
    const pid2 = process.pid >> 0;

    if (!pid1 || !pid2 || pid1 !== pid2) {
      //res.send((pid1 === pid2 ? 'TRUE' : 'FALSE') + '|' + pid1 + '|' + pid2);
      res.send("Error");
      return;
    }

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
