<p align="center">
  <br/>
  <br/>
  <img src="https://github.com/natancabral/node-express-reload/blob/main/images/logo.png" alt="node-express-reload (Natan Cabral)"/>
  <br/>
  <br/>
</p>

# node-express-reload
#### Install NPM package online, kill and restart server (hosting and cloud)
Restart express.js server. Kill process or port, reload server and, if you need, install new packages NPM. *No need terminal shell or SSH*.

- Kill process
- Kill port
- Restart server
- Install new packages
- List pid processes

`WARNING: Do not use the development server in a production environment.`

## Install [<img src="https://github.com/natancabral/node-express-reload/blob/main/images/npm-tile.png">](https://www.npmjs.com/package/node-express-reload)

```shell
npm install node-express-reload
```

## server.js

```js
const express = require("express");
const app = express();
const PORT = 8080;

// ** Secure Change **
// ** change name /ner to /any-another-word **
app.use('/ner', require("node-express-reload")({
  key: '&HSN15KQi!Ç', // password
  application: app, // app express()
  serverfile: __filename, // ./index.js or ./server.js. call on restart
}));

app.get("/", (req, res) => res.send(`I'm pid ${process.pid} and port ${PORT}`));
app.listen(PORT);
```

## output

```shell
> I'm pid 849113 and port 8080
```

## reload
```
GET http://localhost:8080/ner/reload/
```

## kill process/server

```
GET http://localhost:8080/ner/kill/
GET http://localhost:8080/ner/kill/PID (pid is a number)
```

## install npm package

```
GET http://localhost:8080/ner/npm/i/pdfkit-table,cors
```

<!-- 
## output

```shell
reload requested 👍
...
reload complete ✅
```
-->

| router | action | example |
| -------| -------| --------|
| /**ner**/secure | You need set permission to enter | http://localhost:8080/ner/secure |
| /**ner**/kill/:pid? | kill process | http://localhost:8080/ner/kill |
| /**ner**/reload/:pid? | kill process and restart | http://localhost:8080/ner/reload |
| /**ner**/list | pid list | http://localhost:8080/ner/list |
| /**ner**/list-all | big pid list | http://localhost:8080/ner/list-all |
| /**ner**/npm/:type/:packages | Install and uninstall packages. type: i or u. | http://localhost:8080/ner/npm/i/pdfkit-table,cors |
| /**ner**/npm/fix | npm fix | http://localhost:8080/ner/npm/fix |

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