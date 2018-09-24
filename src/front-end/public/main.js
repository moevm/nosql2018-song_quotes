function getReq() {
  fetch("/api", {merthod: "GET"}).then((response) => {
    return response.text();
  }).then((response) => {
    document.getElementById("pam").innerHTML = response;
  });
}

function checkWord() {
  let word = document.getElementById("inpWord").value;
  fetch(`/word/${word}`, {merthod: "GET"}).then((response) => {
    return response.text();
  }).then((response) => {
    document.getElementById("pam").innerHTML = response;
  });
}
