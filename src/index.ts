import { App } from "./app";

const start = (): void => {
  const app = new App();
  app.listen();
}

start();

/*const express = require("express");
const app = express();

const port = 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

app.get("/foo", function (req, res) {
  res.json({ id: 1, name: "Living Room", Modules: [] });
});

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.post("/bar", function (req, res) {
  var body = req.body;
  console.log(req.body.foo);
  res.send(req.body.foo);
});*/
