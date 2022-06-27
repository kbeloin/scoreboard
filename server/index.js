const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
app.use(express.static(path.resolve(__dirname, "../client/build")));
app.use(bodyParser.json());

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

server = require("./controllers/main")(app);
