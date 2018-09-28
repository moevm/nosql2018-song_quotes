let searchBtn = document.getElementById("searchBtn");
let song1 = {
  singer: "David Bowie",
  title: "Space Oddity",
  text: "Ground control to major Tom44Ground control to major Tom44Take your protein pills and put your helmet on44(Ten) Ground control (Nine) to major Tom (Eight)44(Seven, six) Commencing countdown (Five), engines on (Four)44(Three, two) Check ignition (One) and may gods (Blastoff) love be with you4444This is ground control to major Tom, you've really made the grade44And the papers want to know whose shirts you wear44Now it's time to leave the capsule if you dare4444This is major Tom to ground control, I'm stepping through the door44And I'm floating in a most peculiar way44And the stars look very different today44Here am I sitting in a tin can far above the world44Planet Earth is blue and there's nothing I can do4444Though I'm past one hundred thousand miles, I'm feeling very still44And I think my spaceship knows which way to go44Tell my wife I love her very much, she knows44Ground control to major Tom, your circuits dead, there's something wrong44Can you hear me, major Tom?44Can you hear me, major Tom?44Can you hear me, major Tom?44Can you...44Here am I sitting in my tin can far above the Moon44Planet Earth is blue and there's nothing I can do".split("44").map(function (item) {return item.split(" ")}),
  rhymes: ["Tom", "on", "control", "time", "planet", "engines"]
}

let song2 = {
  singer: "David Bowie",
  title: "Space Oddity",
  text: "Ground control to major Tom44Ground control to major Tom44Take your protein pills and put your helmet on44(Ten) Ground control (Nine) to major Tom (Eight)44(Seven, six) Commencing countdown (Five), engines on (Four)44(Three, two) Check ignition (One) and may gods (Blastoff) love be with you4444This is ground control to major Tom, you've really made the grade44And the papers want to know whose shirts you wear44Now it's time to leave the capsule if you dare4444This is major Tom to ground control, I'm stepping through the door44And I'm floating in a most peculiar way44And the stars look very different today44Here am I sitting in a tin can far above the world44Planet Earth is blue and there's nothing I can do4444Though I'm past one hundred thousand miles, I'm feeling very still44And I think my spaceship knows which way to go44Tell my wife I love her very much, she knows44Ground control to major Tom, your circuits dead, there's something wrong44Can you hear me, major Tom?44Can you hear me, major Tom?44Can you hear me, major Tom?44Can you...44Here am I sitting in my tin can far above the Moon44Planet Earth is blue and there's nothing I can do".split("44").map(function (item) {return item.split(" ")}),
  rhymes: ["blue", "hundred", "hear", "sitting", "nothing", "engines"]
}
let songs = [song1, song2, song1, song2, song1, song2];

searchBtn.addEventListener("click", function () {
  let result = document.querySelector(".content > #searchString");
  let inpWord = document.getElementById("searchIpt").value.toLowerCase();
  let content = document.getElementById("content");
  let delay = 0;
  if (result === null) {
    result = document.createElement("p");
    result.setAttribute("id", "searchString");
    result.setAttribute("class", "animationCreate");
    result.style.fontSize = "40px";
    result.style.color = "#ffffff";
    result.style.position = "absolute";
    delay += 0.5;
    content.appendChild(result);
  }

  let word = document.createElement("span");
  word.setAttribute("class", "animationCreate");
  word.appendChild(document.createTextNode(inpWord));
  word.style.color = "#eeb57b";
  word.style.animationDelay = `${delay}s`;
  delay += 0.5;
  result.innerHTML = "Search result by ";
  result.appendChild(word);


  let field = document.querySelector(".content > #field");
  if(field !== null) {
    field.remove();
  }
  field = document.createElement("div");
  field.setAttribute("id", "field");
  field.setAttribute("class", "animationCreate");
  field.style.animationDelay = `${delay}s`;
  field.style.height = "600px";
  field.style.marginTop = "70px";
  field.style.width = `${songs.length*520}px`;
  field.style.borderRadius = "8px";
  field.color = "#000000";
  field.fontSize = "10px";
  content.appendChild(field);


  //create card with songs
  class Card {
    constructor(song) {
      this.singer = song.singer;
      this.title = song.title;
      this.text = song.text;
      this.rhymes = song.rhymes;
      this.card = document.createElement("div");
      this.cardHeader = document.createElement("div");
      this.cardBody = document.createElement("div");
      this.cardTitle = document.createElement("h5");
      this.cardText = document.createElement("div");
      this.showText = this.showText.bind(this);
    }
    createCard () {
      this.card.style.width = "500px";
      this.card.style.height = "560px";
      this.card.style.margin = "20px 0 20px 20px";
      this.card.style.overflow = "auto";
      this.card.style.display = "inline-block";
      this.card.setAttribute("class", "card");
      this.cardHeader.setAttribute("class", "card-header");
      this.cardBody.setAttribute("class", "card-body");
      this.cardTitle.setAttribute("class", "card-title");
      this.cardText.setAttribute("class", "card-text");

      this.card.appendChild(this.cardHeader);
      this.card.appendChild(this.cardBody);
      this.cardBody.appendChild(this.cardTitle);
      this.cardBody.appendChild(this.cardText);

      this.cardHeader.innerHTML = this.singer;
      this.cardTitle.innerHTML = this.title;
      this.cardText.appendChild(this.showText());
      return this.card;
    }
    showText () {
      let songText = document.createElement("p");
      for(let i = 0; i < this.text.length; i++) {
        let songString = document.createElement("span");
        for(let j = 0; j < this.text[i].length; j++) {
          let hlTest = false;
          let hl;
          for(let k = 0; k < this.rhymes.length; k++) {
            if(this.text[i][j] == this.rhymes[k]) {
              hlTest = true;
              hl = document.createElement("span");
              hl.style.backgroundColor = "#bdeda2";
            }
          }
          let wordByString = document.createTextNode(`${this.text[i][j]}`);
          if(hlTest) {
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
  for(let i = 0; i < songs.length; i++) {
    let card = new Card(songs[i]);
    field.appendChild(card.createCard());
  }
});
