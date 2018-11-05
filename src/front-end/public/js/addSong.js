let btnClear = document.getElementById("btn-clear");
let btnAdd = document.getElementById("btn-add");
let btnSearchText = document.getElementById("btn-search");

btnSearchText.addEventListener("click", function() {
  let songArea = document.getElementsByClassName("form-song");
  let song = {};
  for (let i = 0; i < 2; i++) {
    if (!songArea[i].value) songArea[i].style.border = "2px solid red";
    else songArea[i].style.border = "none";
  }
  if (songArea[0].value && songArea[1].value) {
    song.artist = songArea[0].value;
    song.text = songArea[1].value;
    fetch(`/searchSong/${song.text + "&" + song.artist}`, { method: "GET" })
      .then(response => {
        return response.json();
      })
      .then(response => {
        console.log(response.message.body);
        if (response.message.body.lyrics) {
          songArea[2].value = response.message.body.lyrics.lyrics_body;
        } else {
          songArea[2].value = "Text not found :c";
        }
      });
  }
});

btnAdd.addEventListener("click", function() {
  let songArea = document.getElementsByClassName("form-song");
  let song = {};
  for (let i = 0; i < songArea.length; i++) {
    if (!songArea[i].value) songArea[i].style.border = "2px solid red";
    else songArea[i].style.border = "none";
  }
  if (songArea[0].value && songArea[1].value && songArea[2].value) {
    song.artist = songArea[0].value;
    song.title = songArea[1].value;
    song.text = songArea[2].value;
    console.log(song);

    fetch("/song", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(song)
    })
      .then(res => {
        return res.json();
      })
      .then(info => {
        console.log(info);
        if (info.error) {
          songArea[2].style.border = "2px solid red";
        } else clearArea();
      });
  }
});

btnClear.addEventListener("click", clearArea);

function clearArea() {
  let songArea = document.getElementsByClassName("form-song");
  for (let i = 0; i < songArea.length; i++) {
    songArea[i].value = "";
  }
}
