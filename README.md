<p align="center">
  <br/>
  <br/>
  <img src="https://github.com/natancabral/node-express-reload/blob/main/public/images/logo.png" alt="node-express-reload (Natan Cabral)"/>
  <br/>
  <br/>
</p>

# node-express-reload
#### Reload application server (hosting and cloud), kill process and install NPM packages online

- Helps to refresh your application after changes
- Automaticly reload your express.js server without bringing down the server
- Reload server
- Kill process
- Kill port
- List pid processes
- List, fix and audit packages
- Install new packages (get method)


`WARNING: Do not use the development server in a production environment.`

## Install [<img src="https://github.com/natancabral/node-express-reload/blob/main/public/images/npm-tile.png">](https://www.npmjs.com/package/node-express-reload)

[![NPM](https://nodei.co/npm/node-express-reload.png)](https://www.npmjs.com/package/node-express-reload)

```shell
npm install node-express-reload
```

## Example 1

[view code example](https://github.com/natancabral/node-express-reload/tree/main/example)

```js
const express = require("express");
const app = express();
const PORT = 8080;

// ** Secure change ** 
// ** change route /ner to /any-another-word **
app.use('/ner', require("node-express-reload")({
  username: 'admin', // if not defined, your username will be admin
  password: '&HSN15KQi!Ç',
  serverfile: __filename,
}));

// Open terminal 
// http://localhost:8080/ner/
// http://localhost:8080/any-another-word/
// Manual reload 
// http://localhost:8080/ner/reload/

app.get("/", (req, res) => res.send(`I'm pid ${process.pid} and port ${PORT}`));
app.listen(PORT);
```

## Example 2 (without bringing down the server)

[view code example](https://github.com/natancabral/node-express-reload/tree/main/example)

Silent reload module (express router)

```js
const path = require('path');
const express = require("express");
const app = express();
const requireWatcher = require("node-express-reload")('require-watcher');
const PORT = 8099;

// silent reload
app.use('/home', requireWatcher( __dirname + '/home/index.js')) // or only '/home/'

app.get("/", (req, res) => res.send(`I'm pid ${process.pid} and port ${PORT}`));
app.listen(PORT);
```

## Example 3 (watcher files)

[view code example](https://github.com/natancabral/node-express-reload/tree/main/example)

```js
const express = require("express");
const app = express();
const PORT = 8080;

app.use('/ner', require("node-express-reload")({
  serverfile: __filename,
  watcher: ['.'], // {array}  __filename | . | ./ | index.js | /path-name | . (dot is all depth files)
  depth: 10,
}));

app.get("/", (req, res) => res.send(`I'm pid ${process.pid} and port ${PORT}`));
app.listen(PORT);
```

## Another resource to management

- http://localhost:8080/ner
- http://localhost:8080/any-another-word

## Screens

<p align="center">
  <img src="https://github.com/natancabral/node-express-reload/blob/main/public/images/signin2.png" alt="node-express-reload (Natan Cabral)"/>
</p>
<p align="center">
  <img src="https://github.com/natancabral/node-express-reload/blob/main/public/images/hi.png" alt="node-express-reload (Natan Cabral)"/>
</p>
<p align="center">
  <img src="https://github.com/natancabral/node-express-reload/blob/main/public/images/help.png" alt="node-express-reload (Natan Cabral)"/>
</p>
<p align="center">
  <img src="https://github.com/natancabral/node-express-reload/blob/main/public/images/reload.png" alt="node-express-reload (Natan Cabral)"/>
</p>
<p align="center">
  <img src="https://github.com/natancabral/node-express-reload/blob/main/public/images/npm-ls.png" alt="node-express-reload (Natan Cabral)"/>
</p>


## GET Method
```
GET http://localhost:8080/ner/reload/
GET http://localhost:8080/ner/kill/
GET http://localhost:8080/ner/kill/PID (pid is a number)
GET http://localhost:8080/ner/npm/i/pdfkit-table,cors
```

## Actions

<!-- | /**ner**/secure | You need set permission to enter | http://localhost:8080/ner/secure | -->


| router | action | example |
| -------| -------| --------|
| /**ner**/kill | kill owner process | http://localhost:8080/ner/kill |
| /**ner**/kill/:pid? | kill process | http://localhost:8080/ner/kill/123456 |
| /**ner**/reload/:pid? | kill process and restart | http://localhost:8080/ner/reload |
| /**ner**/list | pid list | http://localhost:8080/ner/list |
| /**ner**/list-all | big pid list | http://localhost:8080/ner/listall |
| /**ner**/pid | show process id (PID) | http://localhost:8080/ner/pid |
| /**ner**/npm/:type/:packages | Install and uninstall packages. type: i or u. | http://localhost:8080/ner/npm/i/pdfkit-table,cors |
| /**ner**/npm/fix | npm fix | http://localhost:8080/ner/npm/fix |
| /**ner**/npm/ls | npm ls | http://localhost:8080/ner/npm/ls |
| /**ner**/npm/audit | npm audit | http://localhost:8080/ner/npm/audit |
| /**ner**/npm/install | npm install package.json | http://localhost:8080/ner/npm/install |

## Options

Soon.

## License

The MIT License.

## Author

<table>
  <tr>
    <td>
      <img src="https://github.com/natancabral.png?s=100" width="100"/>
    </td>
    <td>
      Natan Cabral<br />
      <a href="mailto:natancabral@hotmail.com">natancabral@hotmail.com</a><br />
      <a href="https://github.com/natancabral/">https://github.com/natancabral/</a>
    </td>
  </tr>
</table>

## Thank you