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
  let song = req.params.song.split("&");
  let artist = song[1]
    .toLowerCase()
    .split(/[^A-Za-zА-Яа-я]/)
    .join("")
    .replace("the", "");
  let title = song[0]
    .toLowerCase()
    .split(/[^A-Za-zА-Яа-я]/)
    .join("");
  fetch(`http://azlyrics.com/lyrics/${artist}/${title}.html`, {
    method: "GET"
  })
    .then(resp => {
      return resp.text();
    })
    .then(lyrics => {
      let up_partition =
        "<!-- Usage of azlyrics.com content by any third-party lyrics provider is prohibited by our licensing agreement. Sorry about that. -->";
      let down_partition = "<!-- MxM banner -->";
      lyrics = lyrics.split(up_partition)[1];
      lyrics = lyrics.split(down_partition)[0];
      lyrics = lyrics
        .split("<br>")
        .join("")
        .split("</br>")
        .join("")
        .split("</div>")
        .join("")
        .split("&quot")
        .join('"')
        .split("<i>")
        .join("")
        .split("</i>")
        .join("");
      res.send(lyrics);
    });
});

app.listen(3000, function() {
  console.log("server started");
});
