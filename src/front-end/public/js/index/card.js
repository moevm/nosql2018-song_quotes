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
    let songText = document.createElement("p");
    for (let i = 0; i < this.text.length; i++) {
      let songString = document.createElement("span");
      for (let j = 0; j < this.text[i].length; j++) {
        let hlTest = false;
        let hl;
        for (let k = 0; k < this.rhymes.length; k++) {
          if (this.text[i][j].toLowerCase() == this.rhymes[k].toLowerCase()) {
            hlTest = true;
            hl = document.createElement("span");
            hl.style.backgroundColor = "#ffd5d5";
          }
        }
        let wordByString = document.createTextNode(`${this.text[i][j]}`);
        if (hlTest) {
          hl.appendChild(wordByString);
          songString.appendChild(hl);
        } else {
          songString.appendChild(wordByString);
        }
        let space = document.createTextNode(" ");
        songString.appendChild(space);
      }
      let br = document.createElement("br");
      songText.appendChild(songString);
      songText.appendChild(br);
    }
    return songText;
  }
}
