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

  let result = statWindow.result;
  let resultText = document.getElementById("modalBody");
  if (document.getElementById("resBody")) {
    resultText.removeChild(document.getElementById("resBody"));
  }

  let resBody = document.createElement("div");
  resBody.setAttribute("id", "resBody");
  // Found rhymes with different words
  let totalSongs = result.length;
  let totalRhymesValue = 0;
  for (let i = 0; i < result.length; i++) {
    totalRhymesValue += result[i].statistics.length;
  }
  let words = result.flatMap(item => item.words);
  words = unique(words);
  let varWordsValue = words.length;
  let wordsString = words.join(", ");
  wordsString += ".";
  let totalRhymesElement = document.createElement("span");
  totalRhymesElement.innerHTML = `Found <span style="color: #2e62e7">${totalSongs}</span> songs, in which <span style="color: #2e62e7">${totalRhymesValue}</span> rhymes with <span style="color: #2e62e7">${varWordsValue}</span> different words: <span style="color: #2e62e7">${wordsString}</span><br/>`;

  totalRhymesElement.style.marginTop = "20px";
  totalRhymesElement.style.fontStyle = "italic";
  resBody.appendChild(totalRhymesElement);

  // Average number of repetitive rhymes
  let averageRepRhymesValue = 0;
  for (let i = 0; i < result.length; i++) {
    averageRepRhymesValue +=
      result[i].statistics.map(item => item.count).reduce((a, b) => a + b) /
      result[i].statistics.length;
  }
  averageRepRhymesValue =
    Math.floor((averageRepRhymesValue / result.length) * 100) / 100;
  let averageRepRhymesElement = document.createElement("span");
  averageRepRhymesElement.innerHTML = `Average number of repetitive rhymes: <span style="color: #2e62e7">${averageRepRhymesValue}</span><br/>`;
  averageRepRhymesElement.style.marginTop = "20px";
  averageRepRhymesElement.style.fontStyle = "italic";

  resBody.appendChild(averageRepRhymesElement);

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
  let searchWords = statWindow.word.split(" ");
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

  for (let k = 0; k < result.length; k++) {
    for (let i = 0; i < result[k].statistics.length; i++) {
      let row = document.createElement("div");
      row.setAttribute("class", "row");
      for (let j = 0; j < result[k].statistics[i].ngram.length; j++) {
        let col = document.createElement("div");
        col.setAttribute("class", "col");
        col.innerHTML = result[k].statistics[i].ngram[j];
        col.style.border = "1px solid black";
        col.style.borderTop = "none";
        col.style.borderLeft = "none";
        row.appendChild(col);
      }
      let colQty = document.createElement("div");
      colQty.setAttribute("class", "col-2");
      colQty.innerHTML = result[k].statistics[i].count;
      colQty.style.border = "1px solid black";
      colQty.style.borderTop = "none";
      colQty.style.borderRight = "none";
      colQty.style.borderLeft = "none";
      row.appendChild(colQty);

      table.appendChild(row);
    }
  }

  //pie chart
  let chart = document.createElement("canvas");
  let ctx = chart.getContext("2d");
  chart.style.height = "500px";
  let colors = [];
  for (let i = 0; i < result.length; i++) {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    colors.push("#" + r.toString(16) + g.toString(16) + b.toString(16));
  }
  let pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      datasets: [
        {
          data: result.map(item => item.statistics.length),
          backgroundColor: colors
        }
      ],
      labels: result.map(item => `${item.song.artist} - ${item.song.title}`)
    }
  });

  resBody.appendChild(chart);
  resBody.appendChild(table);

  resultText.appendChild(resBody);
}

function unique(arr) {
  var obj = {};

  for (var i = 0; i < arr.length; i++) {
    var str = arr[i].toLowerCase();
    obj[str] = true;
  }

  return Object.keys(obj);
}
