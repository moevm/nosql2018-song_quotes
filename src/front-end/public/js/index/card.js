export default class Card {
  constructor(song) {
    this.searchParam = song.searchParam;
    this.songId = song.songId;
    this.artist = song.artist;
    this.words = song.words;
    this.title = song.title;
    this.text = song.text;
    this.rhymes = song.rhymes;
    this.statistics = song.rhymes;
    this.card = document.createElement("div");
    this.cardHeader = document.createElement("div");
    this.cardBody = document.createElement("div");
    this.cardFooter = document.createElement("div");
    this.cardTitle = document.createElement("h5");
    this.cardText = document.createElement("div");
    this.showText = this.showText.bind(this);
  }
  createCard() {
    this.card.style.width = "500px";
    this.card.style.height = "auto";
    this.card.style.margin = "20px 0 20px 20px";
    this.card.style.overflow = "auto";
    this.card.style.display = "inline-block";
    this.card.setAttribute("class", "card");
    this.cardHeader.setAttribute("class", "card-header");
    this.cardBody.setAttribute("class", "card-body");
    this.cardFooter.setAttribute("class", "card-footer");
    this.cardTitle.setAttribute("class", "card-title");
    this.cardText.setAttribute("class", "card-text");

    this.card.appendChild(this.cardHeader);
    this.card.appendChild(this.cardBody);
    this.card.appendChild(this.cardFooter);
    this.cardBody.appendChild(this.cardTitle);
    this.cardBody.appendChild(this.cardText);

    this.cardHeader.innerHTML = this.artist;
    this.cardTitle.innerHTML = this.title;
    this.cardText.appendChild(this.showText());
    this.cardFooter.appendChild(this.showStatistic());
    return this.card;
  }
  showStatistic() {
    let statistic = document.createElement("div");
    let statBtn = document.createElement("button");
    statBtn.setAttribute("class", "btn btn-light btn-block");
    statBtn.setAttribute("type", "button");
    statBtn.setAttribute("data-toggle", "collapse");
    statBtn.setAttribute("data-target", `#statCollapse${this.songId}`);
    statBtn.setAttribute("aria-expanded", "false");
    statBtn.setAttribute("aria-controls", `statCollapse${this.songId}`);
    statBtn.innerHTML = "Statistic";

    let statContainer = document.createElement("div");
    statContainer.setAttribute("class", "collapse");
    statContainer.setAttribute("id", `statCollapse${this.songId}`);

    let statText = document.createElement("div");
    // Found rhymes with different words
    let totalRhymesValue = this.statistics.length;
    let words = unique(this.words);
    let varWordsValue = words.length;
    let wordsString = words.join(", ");
    wordsString += ".";
    let totalRhymesElement = document.createElement("span");
    totalRhymesElement.innerHTML = `Found <span style="color: #2e62e7">${totalRhymesValue}</span> rhymes in which <span style="color: #2e62e7">${varWordsValue}</span> different words: <span style="color: #2e62e7">${wordsString}</span><br/>`;

    totalRhymesElement.style.marginTop = "20px";
    totalRhymesElement.style.fontStyle = "italic";

    statText.appendChild(totalRhymesElement);

    // Average number of repetitive rhymes
    let averageRepRhymesValue =
      Math.floor(
        (this.statistics.map(item => item.count).reduce((a, b) => a + b) /
          this.statistics.length) *
          100
      ) / 100;
    let averageRepRhymesElement = document.createElement("span");
    averageRepRhymesElement.innerHTML = `Average number of repetitive rhymes: <span style="color: #2e62e7">${averageRepRhymesValue}</span><br/>`;
    averageRepRhymesElement.style.marginTop = "20px";
    averageRepRhymesElement.style.fontStyle = "italic";

    statText.appendChild(averageRepRhymesElement);

    // Rhymes
    let table = document.createElement("div");
    table.setAttribute("class", "container");
    table.align = "center";
    table.style.marginTop = "20px";
    table.style.border = "3px solid #ffd5d5";
    table.style.borderRadius = "3px";

    let rowHeader = document.createElement("div");
    rowHeader.setAttribute("class", "row");

    rowHeader.style.fontWeight = "bold";

    let colHeader1 = document.createElement("div");
    colHeader1.setAttribute("class", "col-10");
    colHeader1.innerHTML = "Rhyming words";
    colHeader1.style.border = "1px solid black";
    colHeader1.style.borderTop = "none";
    colHeader1.style.borderLeft = "none";
    let colHeader2 = document.createElement("div");
    colHeader2.setAttribute("class", "col-2");
    colHeader2.innerHTML = "Qty";
    colHeader2.style.border = "1px solid black";
    colHeader2.style.borderTop = "none";
    colHeader2.style.borderRight = "none";
    colHeader2.style.borderLeft = "none";

    rowHeader.appendChild(colHeader1);
    rowHeader.appendChild(colHeader2);

    table.appendChild(rowHeader);

    let searchRow = document.createElement("div");
    let searchWords = this.searchParam.split(" ");
    searchRow.setAttribute("class", "row");
    searchRow.style.fontStyle = "italic";
    searchRow.style.fontWeight = "bold";
    for (let i = 0; i < searchWords.length; i++) {
      let col = document.createElement("div");
      col.setAttribute("class", "col");
      col.innerHTML = searchWords[i];
      searchRow.appendChild(col);
      col.style.border = "1px solid black";
      col.style.borderTop = "none";
      col.style.borderLeft = "none";
    }
    let colQtyEmpty = document.createElement("div");
    colQtyEmpty.setAttribute("class", "col-2");
    colQtyEmpty.style.border = "1px solid black";
    colQtyEmpty.style.borderTop = "none";
    colQtyEmpty.style.borderRight = "none";
    colQtyEmpty.style.borderLeft = "none";
    searchRow.appendChild(colQtyEmpty);
    table.appendChild(searchRow);

    for (let i = 0; i < this.statistics.length; i++) {
      let row = document.createElement("div");
      row.setAttribute("class", "row");
      for (let j = 0; j < this.statistics[i].ngram.length; j++) {
        let col = document.createElement("div");
        col.setAttribute("class", "col");
        col.innerHTML = this.statistics[i].ngram[j];
        col.style.border = "1px solid black";
        col.style.borderTop = "none";
        col.style.borderLeft = "none";
        row.appendChild(col);
      }
      let colQty = document.createElement("div");
      colQty.setAttribute("class", "col-2");
      colQty.innerHTML = this.statistics[i].count;
      colQty.style.border = "1px solid black";
      colQty.style.borderTop = "none";
      colQty.style.borderRight = "none";
      colQty.style.borderLeft = "none";
      row.appendChild(colQty);

      table.appendChild(row);
    }

    statText.appendChild(table);

    statistic.appendChild(statBtn);
    statContainer.appendChild(statText);
    statistic.appendChild(statContainer);
    return statistic;
  }

  showText() {
    //console.log(this.rhymes);
    let testText = this.text;
    let regExpArrOfRhymes = [];

    for (let i = 0; i < this.rhymes.length; i++) {
      let regRhyme = "[^A-ZА-Я]+";
      for (let j = 0; j < this.rhymes[i].ngram.length; j++) {
        regRhyme += this.rhymes[i].ngram[j] + "[^A-ZА-ЯЁ]+";
      }
      regExpArrOfRhymes.push(new RegExp(regRhyme, "gi"));
    }

    this.text = cutAndHighlight(this.text, regExpArrOfRhymes);

    let songText = document.createElement("span");
    songText.innerHTML = this.text.split("\n").join("<br/>");
    return songText;
  }
}

function cutAndHighlight(text, words) {
  let pieces = text.split("\n");
  let cutText = "";
  for (let i = 0; i < pieces.length - 2; i++) {
    pieces[i] += "\n" + pieces[i + 1] + "\n" + pieces[i + 2];
    for (let j = 0; j < words.length; j++) {
      if (words[j].test(pieces[i])) {
        pieces[i] = pieces[i].replace(words[j], " ~~~ $& ~~ ");
      }
    }

    pieces[i] = pieces[i]
      .split("~~~")
      .join("<span style='background-color: #ff9cb9'>");
    pieces[i] = pieces[i].split("~~").join("</span>");

    cutText += pieces[i].includes("</span>") ? pieces[i] + `\n...\n` : "";
  }

  cutText = cutText.split("\n...\n");

  cutText = unique(cutText);

  return cutText.join("\n...\n");
}

function unique(arr) {
  var obj = {};

  for (var i = 0; i < arr.length; i++) {
    var str = arr[i];
    obj[str] = true;
  }

  return Object.keys(obj);
}
