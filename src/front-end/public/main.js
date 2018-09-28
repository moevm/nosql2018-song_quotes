function getReq() {
  fetch("/api", {method: "GET"}).then((response) => {
    return response.text();
  }).then((response) => {
    document.getElementById("pam").innerHTML = response;
  });
}

function checkWord() {
  let word = document.getElementById("inpWord").value;
  fetch(`/word/${word}`, {method: "GET"}).then((response) => {
    return response.text();
  }).then((response) => {
    document.getElementById("pam").innerHTML = response;
  });
}

function getModel() {
  document.location.href = "http://localhost:3000/model";
}
