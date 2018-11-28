export default class Card {
  constructor(song) {
    this.artist = song.artist;
    this.title = song.title;
    this.text = song.text;
    this.rhymes = song.rhymes;
    this.statistics = song.statistics;
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
    this.card.style.height = "600px";
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
    let statText = document.createElement("div");
    let totalRhymes = document.createElement("p");
    let averageDifRhymes = document.createElement("p");
    let varRhymes = document.createElement("p");
    let songContains = document.createElement("p");

    // totalRhymes.innerHTML = "Number of rhymes in a song: ";
    // let varTotalRhymes = this.statistics.allRhymes;
    // totalRhymes.appendChild(varTotalRhymes);

    averageDifRhymes.innerHTML = "The average number of different rhymes: ";
    let varAverageDifRhymes = document.createElement("span");
    varAverageDifRhymes.appendChild(
      document.createTextNode(this.statistics.averageVarRhymes)
    );
    averageDifRhymes.appendChild(varAverageDifRhymes);
    statText.appendChild(averageDifRhymes);

    return statText;
  }
  showText() {
    let rhymes = [];
    let reg = /[.,\/#!$%\^&\*;:{}=\-_`()]/g;
    for (let i = 0; i < this.rhymes.length; i++) {
      let rhyme = this.rhymes[i].ngram.join(" ");
      let upRStrings = rhyme.match(/[A-Z]+[a-z]+|[А-Я]+[а-я]+/g);
      if (upRStrings) {
        let upRFilter = upRStrings[upRStrings.length - 1];
        rhyme = rhyme.split(`${upRFilter}`).join(`~${upRFilter}`);
      }
      rhymes.push(rhyme);
    }
    let songText = document.createElement("p");
    let songString = document.createElement("span");
    let br = document.createElement("br");
    for (let j = 0; j < rhymes.length; j++) {
      this.text = this.text
        .replace(reg, "")
        .replace(/  /g, " ")
        .split(`${rhymes[j]} `)
        .join(`~~~${rhymes[j]}~~ `);
    }

    this.text = this.text
      .split("~~~")
      .join("<span style='background-color: #ffd5d5'>");
    this.text = this.text.split("~~").join("</span>");
    this.text = this.text.split("~").join("<br/>");
    songString.innerHTML = this.text;
    songText.appendChild(songString);
    return songText;
  }
}
