const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  console.log("nodejs server");
  res.render("index");
});

app.get("/word/:word", (req, res) => {
  fetch(`http://localhost:5000/word/${encodeURI(req.params.word)}`, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .then(response => {
      res.send(response);
    });
});

app.get("/rhyme/:word", (req, res) => {
  fetch(`http://localhost:5000/rhyme/${encodeURI(req.params.word)}`, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .then(response => {
      res.send(response);
    });
});

app.get("/api", (req, res) => {
  console.log("python server");
  fetch("http://localhost:5000/ping", { method: "GET" })
    .then(response => {
      return response.text();
    })
    .then(response => {
      res.send(response);
    });
});

app.get("/model", (req, res) => {
  res.render("model");
});

app.listen(3000, function() {
  console.log("server started");
});
