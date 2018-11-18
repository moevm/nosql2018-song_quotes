export default function makeStatWindow(statWindow) {
  let mWord = document.createElement("span");
  let mResult = document.getElementById("modalTitle");
  mWord.setAttribute("class", "animationCreate");
  mWord.appendChild(document.createTextNode(statWindow.word));
  mWord.style.color = "#ff9cb9";
  mWord.style.animationDelay = "0.3s";
  mResult.innerHTML = "Statistics for ";
  mResult.appendChild(mWord);
  mResult.style.fontWeight = "bold";
  mResult.style.fontSize = "20px";
}
