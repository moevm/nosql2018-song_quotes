import Card from "./index/card.js";
import makeStatWindow from "./index/statistic.js";

let searchBtn = document.getElementById("searchBtn");
let searchArea = document.getElementById("searchIpt");
let statistic = document.getElementById("showStat");
let cardCount = 1;
let cards = [];
let maxArrowValue;
let statWindow = {};

searchArea.addEventListener("change", function() {
  if (searchArea.value !== "") {
    searchBtn.addEventListener("click", search(searchArea.value.toLowerCase()));
  } else {
    searchBtn.removeEventListener("click", search);
  }
});

searchArea.addEventListener("input", function() {
  if (searchArea.value !== "") {
    searchBtn.disabled = "";
  } else {
    searchBtn.disabled = "true";
  }
});

function search(inpWord) {
  statistic.style.display = "none";
  fetch(`/word/${inpWord}`, { method: "GET" })
    .then(response => {
      return response.json();
    })
    .then(response => {
      let result = document.querySelector(".content > #searchString");
      let content = document.getElementById("content");
      let delay = 0;
      if (result !== null) {
        result.remove();
      }
      result = document.createElement("p");
      result.setAttribute("id", "searchString");
      result.setAttribute("class", "animationCreate");
      result.style.fontSize = "40px";
      result.style.color = "#ffffff";
      result.marginTop = "150px";
      delay += 0.5;
      content.appendChild(result);
      content.style.minWidth = "530px";
      let word = document.createElement("span");
      word.setAttribute("class", "animationCreate");
      word.appendChild(document.createTextNode(inpWord));
      word.style.color = "#ff9cb9";
      word.style.animationDelay = `${delay}s`;
      delay += 0.5;
      let field = document.querySelector(".content > #field");
      if (field !== null) {
        field.remove();
      }

      if (response.result) {
        fetch(`/rhyme/${inpWord}`, { method: "GET" })
          .then(resp => {
            return resp.json();
          })
          .then(resp => {
            if (resp.found > 0) {
              console.log(resp);
              result.innerHTML = "Search result by ";
              result.appendChild(word);

              //show statistics
              statistic.style.display = "block";
              statWindow.word = inpWord;

              //show cards
              field = document.createElement("div");
              field.setAttribute("id", "field");
              field.setAttribute("class", "animationCreate");
              field.style.animationDelay = `${delay}s`;
              field.style.marginTop = "70px";
              field.style.marginRight = "auto";
              field.style.marginLeft = "auto";
              let celem = Math.floor(content.offsetWidth / 520);
              cardCount = celem;
              cards = [];
              for (let i = 0; i < resp.result.length; i++) {
                let song = {
                  artist: resp.result[i].song.artist,
                  title: resp.result[i].song.title,
                  text: resp.result[i].song.text
                    .split("\n")
                    .map(function(item) {
                      return item.split(/[^a-zA-ZА-Яа-яё]/);
                    }),
                  rhymes: resp.result[i].words,
                  statistics: {
                    allRhymes: 24, //всего рифм
                    averageVarRhymes: 3.8, // среднее количество различных рифм
                    totalWords: 98
                  }
                };
                let card = new Card(song);
                cards.push(card.createCard());
              }
              maxArrowValue = cards.length - cardCount;
              if (maxArrowValue < 0) maxArrowValue = 0;
              field.style.width = `${Math.min(cards.length, cardCount) * 520 +
                20}px`;
              field.style.borderRadius = "8px";
              field.color = "#000000";
              field.style.position = "relative";
              field.fontSize = "10px";
              content.appendChild(field);
              showCards();
            } else {
              result.innerHTML = "Sorry, nothing found by ";
              result.appendChild(word);
            }
          });
      } else {
        result.innerHTML = "Sorry, is not a word ";
        result.appendChild(word);
      }
    });
}

function showCards() {
  let field = document.querySelector(".content > #field");
  let fieldChilds = document.getElementsByClassName("card");
  //Так должно быть, уменьшается fieldChilds.length
  for (let i = 0; i < fieldChilds.length; ) {
    field.removeChild(fieldChilds[i]);
  }
  for (let i = 0; i < cards.length; i++) {
    field.appendChild(cards[i]);
  }
}

window.addEventListener("resize", function() {
  let content = document.getElementById("content");
  let field = document.querySelector(".content > #field");
  if (field !== null) {
    if (Math.floor(content.offsetWidth / 520) !== cardCount) {
      cardCount = Math.floor(content.offsetWidth / 520);
    }
    field.style.width = `${520 * Math.min(cards.length, cardCount) + 20}px`;
  }
});

statistic.addEventListener("click", function() {
  makeStatWindow(statWindow);
});
