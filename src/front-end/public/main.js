function getReq() {
  let song = document.getElementById("inpWord").value;
  fetch(`/api/${song}`, { method: "GET" })
    .then(response => {
      return response.json();
    })
    .then(response => {
      console.log(response.message.body);
    });
}

function checkWord() {
  let word = document.getElementById("inpWord").value;
  fetch(`/word/${word}`, { method: "GET" })
    .then(response => {
      return response.text();
    })
    .then(response => {
      document.getElementById("pam").innerHTML = response;
    });
}

function getModel() {
  document.location.href = "http://localhost:3000/model";
}
