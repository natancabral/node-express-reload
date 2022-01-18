# Node Express Reload
Restart host server run express, kill process, kill port, reload express and install package node NPM. 

### NOT WORKING STILL... yet!

## Install [<img src="https://github.com/natancabral/node-express-reload/blob/main/npm-tile.png">](https://www.npmjs.com/package/node-express-reload)

```shell
npm install node-express-reload
```

## server.js

```js
const ner = require("node-express-reload");
const express = require("express");
const app = express();
const PORT = 8080;

app.use(ner());
app.use('/ner/', ner);
app.get("/", (req, res) => res.send(`I'm pid ${process.pid} and port ${POST}`));
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