<p align="center">
  <br/>
  <br/>
  <img src="https://github.com/natancabral/node-express-reload/blob/main/public/images/logo.png" alt="node-express-reload (Natan Cabral)"/>
  <br/>
  <br/>
</p>

# node-express-reload
#### Install NPM package online, kill process and reload server (hosting and cloud)
`WARNING: Do not use the development server in a production environment.`
Reload express.js server. Kill process or port, reload server and, if you need, install new packages NPM. *No need terminal shell or SSH*.

- Reload server
- Kill process
- Kill port
- List pid processes
- Install new packages (get method)
- List, fix and audit


## Install [<img src="https://github.com/natancabral/node-express-reload/blob/main/public/images/npm-tile.png">](https://www.npmjs.com/package/node-express-reload)

```shell
npm install node-express-reload
```

## Example

```js
const express = require("express");
const app = express();
const PORT = 8080;

// ** Secure Change **
// ** change name /ner to /any-another-word **
app.use('/ner', require("node-express-reload")({
  username: 'admin', // optional (if not defined your username is admin)
  password: '&HSN15KQi!Ç', // required
  application: app, // application express
  serverfile: __filename, // ./index.js or ./server.js. call on restart
  // pwcache: 7, // password cache in minutes
}));

// app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => res.send(`I'm pid ${process.pid} and port ${PORT}`));
app.listen(PORT);
```

## Terminal
- http://localhost:8080/ner
- http://localhost:8080/any-another-word

## Screens

<p align="center">
  <img src="https://github.com/natancabral/node-express-reload/blob/main/public/images/signin.png" alt="node-express-reload (Natan Cabral)"/>
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
<p align="center">
  <img src="https://github.com/natancabral/node-express-reload/blob/main/public/images/npm-ls.png" alt="node-express-reload (Natan Cabral)"/>
</p>


## Samples
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