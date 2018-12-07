const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

let jsonParser = bodyParser.json();
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  console.log("nodejs server");
  res.render("model");
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

app.get("/api/:song", jsonParser, (req, res) => {});

app.get("/model", (req, res) => {
  res.render("model");
});

app.post("/song", jsonParser, (req, res) => {
  fetch("http://localhost:5000/song", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(req.body)
  })
    .then(resp => {
      return resp.json();
    })
    .then(info => {
      res.send(info);
    });
});

app.get("/searchSong/:song", jsonParser, (req, res) => {
  let song = req.params.song.split("&");
  fetch(
    `http://localhost:5000/find?title=${encodeURI(song[0])}&artist=${encodeURI(
      song[1]
    )}`,
    {
      method: "GET"
    }
  )
    .then(resp => {
      return resp.json();
    })
    .then(lyrics => {
      res.send(lyrics);
    });
});

app.listen(3000, function() {
  console.log("server started");
});
