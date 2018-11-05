const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

//prohibited
const music = require("musicmatch")({
  apikey: "c413bce44143ce7acc4d0c63cc36840f"
});

// const LastFM = require("last-fm");
// const lastfm = new LastFM("92033efd9835ad647c054cb224c9f1a8");
//
// lastfm.trackSearch({ q: "the greatest" }, (err, data) => {
//   if (err) console.error(err);
//   else console.log(data);
// });

let jsonParser = bodyParser.json();
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
  let song = req.params.song.split("$");
  music
    .matcherLyrics({ q_track: song[0], q_artist: song[1] })
    .then(function(data) {
      return JSON.stringify(data);
    })
    .then(function(data) {
      res.send(data);
    });
});

app.listen(3000, function() {
  console.log("server started");
});
