function getReq() {
  fetch("/api", {merthod: "GET"}).then((response) => {
    return response.text();
  }).then((response) => {
    document.getElementById("pam").innerHTML = response;
  });
}
