const express = require("express");
const bodyParser = require("body-parser");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log("nodejs server");
  res.render("index");
});

app.get("/pythonServer", (req, res) => {
  console.log("python server");
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      res.send(xhttp.responseText);
    }
  };
  xhttp.open("GET", "http://localhost:5000/ping", true);
  xhttp.send();
});

app.listen(3000);
