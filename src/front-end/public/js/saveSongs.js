let saveBtn = document.getElementById("export");

saveBtn.addEventListener("click", () => {
  fetch("/export", {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log(data);
      let songs = `Total songs: ${data.songs.length}  |\r\n`;
      for (let i = songs.length - 3; i > 0; i--) {
        songs += "_";
      }
      songs += "|\r\n\r\n";
      for (let i = 0; i < data.songs.length; i++) {
        let name =
          "\t| " +
          data.songs[i].artist +
          " - " +
          data.songs[i].title +
          " |\r\n";
        songs += "\t ";
        for (let j = 0; j < name.length - 5; j++) {
          songs += "_";
        }
        songs += "\r\n";
        songs += name;
        songs += "\t|";
        for (let j = 0; j < name.length - 5; j++) {
          songs += "_";
        }
        songs += "|\r\n          ";
        songs +=
          data.songs[i].text.split("\n").join("\r\n          ") +
          "\r\n______________________________________________________\r\n";
      }
      download(songs);
    });
});

function download(songs) {
  let file = new Blob([songs], { type: "text/plain" });
  if (window.navigator.msSaveOrOpenBlob)
    window.navigator.msSaveOrOpenBlob(file, "Songs.txt");
  else {
    let a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = "Songs.txt";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}
