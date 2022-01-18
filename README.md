***NOT WORKING yet... yet!***
<p align="center">
  <br/>
  <br/>
  <img src="https://github.com/natancabral/node-express-reload/blob/main/images/logo.png" alt="node-express-reload (Natan Cabral)"/>
  <br/>
  <br/>
</p>

# node-express-reload
#### Install NPM package online, kill and restart server (hosting and cloud)
Restart host running server express.js, kill process, kill port, reload express.js and install packages NPM. *No need terminal shell or SSH*.

## Install [<img src="https://github.com/natancabral/node-express-reload/blob/main/images/npm-tile.png">](https://www.npmjs.com/package/node-express-reload)

```shell
npm install node-express-reload
```

## server.js

```js
const express = require("express");
const app = express();
const PORT = 8080;

const NER_PASSWORD = '22AAbbCC#$';
// ** Secure Change **
// ** change name /ner to /any-another-word **
app.use('/ner', require("node-express-reload")(NER_PASSWORD));

app.get("/", (req, res) => res.send(`I'm pid ${process.pid} and port ${PORT}`));
app.listen(PORT);
```

## output

```shell
I'm pid 849113 and port 8080
```

## request kill and restart PID

PID is a number
```shell
$ curl http://localhost:8080/ner/kill-and-restart-process/PID
```

## output

```shell
reload requested 👍
...
reload complete ✅
```

| router | action | example |
|--------| -------|--------|
| /**ner**/secure | your password | ... |
| /**ner**/kill-process/:pid | kill process | http://localhost:8080/ner/kill-process/849113 |
| /**ner**/kill-process-and-restart/:pid | http://localhost:8080/ner/process-and-restart/849113 |

| router | action | example |
|--------| -------|--------|
| /**ner**/list-of-process | list | http://localhost:8080/ner/list-of-process/849113 |
| /**ner**/list-all-processes | big list | http://localhost:8080/ner/list-all-processes/849113 |

| router | action | example |
|--------| -------|--------|
| /**ner**/npm/:type/:pid/:packages | Install and uninstall packages. type: i or u | http://localhost:8080/ner/npm/i/849113/pdfkit-table,cors |
| /**ner**/npm/fix/:pid | npm fix | http://localhost:8080/ner/npm/fix/849113 |

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