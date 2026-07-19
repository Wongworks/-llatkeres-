const animalFromNames = {
  lo: "lótól",
  kutya: "kutyától",
  oroszlan: "oroszlántól",
  beka: "békától",
  teve: "tevétől",
  szarvas: "szarvastól",
  csiga: "csigától",

  eger: "egértől",
  tehen: "tehéntől",
  balna: "bálnától",
  zsiraf: "zsiráftól",
  elefant: "elefánttól",
  rak: "ráktól",
  gyik: "gyíktól",

  roka: "rókától",
  delfin: "delfintől",
  kecske: "kecskétől",
  kakas: "kakastól",
  mokus: "mókustól",
  majom: "majomtól",
  pava: "pávától",

  barany: "báránytól",
  macska: "macskától",
  krokodil: "krokodiltól",
  nyul: "nyúltól",
  hal: "haltól",
  pingvin: "pingvintől",
  foka: "fókától",

  kigyo: "kígyótól",
  teknos: "teknőstől",
  vizilo: "vízilótól",
  polip: "poliptól",
  kacsa: "kacsától",
  zebra: "zebrától",
  flamingo: "flamingótól"
};
const animalComparedToNames = {
  lo: "lóhoz",
  kutya: "kutyához",
  oroszlan: "oroszlánhoz",
  beka: "békához",
  teve: "tevéhez",
  szarvas: "szarvashoz",
  csiga: "csigához",

  eger: "egérhez",
  tehen: "tehénhez",
  balna: "bálnához",
  zsiraf: "zsiráfhoz",
  elefant: "elefánthoz",
  rak: "rákhoz",
  gyik: "gyíkhoz",

  roka: "rókához",
  delfin: "delfinhez",
  kecske: "kecskéhez",
  kakas: "kakashoz",
  mokus: "mókushoz",
  majom: "majomhoz",
  pava: "pávához",

  barany: "bárányhoz",
  macska: "macskához",
  krokodil: "krokodilhoz",
  nyul: "nyúlhoz",
  hal: "halhoz",
  pingvin: "pingvinhez",
  foka: "fókához",

  kigyo: "kígyóhoz",
  teknos: "teknőshöz",
  vizilo: "vízilóhoz",
  polip: "poliphoz",
  kacsa: "kacsához",
  zebra: "zebrához",
  flamingo: "flamingóhoz"
};

/* ---------------- ÁLLAPOT ---------------- */

let currentStatement = null;
let correctCount = 0;
let checkingAnswer = false;

/* ---------------- TÁBLA ---------------- */

function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  // Bal felső üres mező
  board.appendChild(document.createElement("div"));

  // Oszlopfejlécek
  for (const col of cols) {
    const header = document.createElement("div");

    header.className = "header";
    header.innerText = col;

    board.appendChild(header);
  }

  // Sorok és állatok
  for (const row of rows) {
    const rowHeader = document.createElement("div");

    rowHeader.className = "header";
    rowHeader.innerText = row;

    board.appendChild(rowHeader);

    for (const col of cols) {
      const key = col + row;

      const cell = document.createElement("div");

      cell.className = "cell";
      cell.dataset.key = key;

      const img = document.createElement("img");

      img.src =
        `images/animals_fixed/${grid[key]}.svg`;

      img.className = "animal";
      img.alt =
        animalNames[grid[key]] || grid[key];

      cell.appendChild(img);
      board.appendChild(cell);
    }
  }
}

/* ---------------- ÚJ PÁLYA ---------------- */

function newBoard() {
  correctCount = 0;
  checkingAnswer = false;

  shuffleGrid();
  renderBoard();
  newTask();

  document.getElementById("message").innerText = "";
}

/* ---------------- ÚJ FELADAT ---------------- */

function newTask() {
  checkingAnswer = false;

  clearBoardMarks();
  clearAnswerButtons();

  currentStatement = createStatement();

  showStatement();

  document.getElementById("message").innerText = "";

 }

/* ---------------- ÁLLÍTÁS LÉTREHOZÁSA ---------------- */

function createStatement() {
  const desiredTruth = Math.random() < 0.5;

  const relationTypes = [
    "left",
    "right",
    "above",
    "below",
    "nextTo",
    "directlyAbove",
    "directlyBelow",
    "sameRow",
    "sameColumn",
    "diagonal",
    "between"
  ];

  const relationType =
    relationTypes[
      Math.floor(Math.random() * relationTypes.length)
    ];

  if (relationType === "between") {
    return createBetweenStatement(desiredTruth);
  }

  return createPairStatement(
    relationType,
    desiredTruth
  );
}

/* ---------------- KÉTÁLLATOS ÁLLÍTÁS ---------------- */

function createPairStatement(
  relationType,
  desiredTruth
) {
  const positions = Object.keys(grid);

  let firstPosition = "";
  let secondPosition = "";

  let attempts = 0;

  do {
    firstPosition =
      positions[
        Math.floor(Math.random() * positions.length)
      ];

    secondPosition =
      positions[
        Math.floor(Math.random() * positions.length)
      ];

    attempts++;
  } while (
    attempts < 500 &&
    (
      firstPosition === secondPosition ||
      checkRelation(
        relationType,
        firstPosition,
        secondPosition
      ) !== desiredTruth
    )
  );

  const firstAnimalId = grid[firstPosition];
  const secondAnimalId = grid[secondPosition];

  const firstAnimalName =
    animalNames[firstAnimalId];

  const secondAnimalName =
    animalNames[secondAnimalId];

  const relationData =
    getRelationData(
      relationType,
      firstAnimalName,
      secondAnimalName,
      secondAnimalId,
      firstPosition,
      secondPosition
    );

  return {
    isTrue: desiredTruth,
    text: relationData.text,
    symbol: relationData.symbol,
    layout: relationData.layout || "horizontal",

    firstPosition,
    secondPosition,

    firstAnimalId,
    secondAnimalId,

    positions: [
      firstPosition,
      secondPosition
    ],

    type: relationType
  };
}

/* ---------------- KÖZÖTT ÁLLÍTÁS ---------------- */

function createBetweenStatement(desiredTruth) {
  const positions = Object.keys(grid);

  let middlePosition = "";
  let firstOuterPosition = "";
  let secondOuterPosition = "";

  let attempts = 0;

  do {
    middlePosition =
      positions[
        Math.floor(Math.random() * positions.length)
      ];

    firstOuterPosition =
      positions[
        Math.floor(Math.random() * positions.length)
      ];

    secondOuterPosition =
      positions[
        Math.floor(Math.random() * positions.length)
      ];

    attempts++;
  } while (
    attempts < 800 &&
    (
      middlePosition === firstOuterPosition ||
      middlePosition === secondOuterPosition ||
      firstOuterPosition === secondOuterPosition ||
      isBetween(
        middlePosition,
        firstOuterPosition,
        secondOuterPosition
      ) !== desiredTruth
    )
  );

  const middleAnimalId =
    grid[middlePosition];

  const firstOuterAnimalId =
    grid[firstOuterPosition];

  const secondOuterAnimalId =
    grid[secondOuterPosition];

  const middleAnimalName =
    animalNames[middleAnimalId];

  const firstOuterAnimalName =
    animalNames[firstOuterAnimalId];

  const secondOuterAnimalName =
    animalNames[secondOuterAnimalId];

  const text =
    `${withArticle(middleAnimalName, false)} ` +
    `${withArticle(firstOuterAnimalName, true)} és ` +
    `${withArticle(secondOuterAnimalName, true)} között van.`;

  return {
    isTrue: desiredTruth,
    text,
    symbol: "•",

    middlePosition,
    firstOuterPosition,
    secondOuterPosition,

    middleAnimalId,
    firstOuterAnimalId,
    secondOuterAnimalId,

    positions: [
      middlePosition,
      firstOuterPosition,
      secondOuterPosition
    ],

    type: "between"
  };
}

/* ---------------- VISZONY ELLENŐRZÉSE ---------------- */

function checkRelation(
  relationType,
  firstPosition,
  secondPosition
) {
  const first = getCoordinates(firstPosition);
  const second = getCoordinates(secondPosition);

  const colDifference =
    first.colIndex - second.colIndex;

  const rowDifference =
    first.rowIndex - second.rowIndex;

  /* Valahol balra vagy jobbra */

  if (relationType === "left") {
    return first.colIndex < second.colIndex;
  }

  if (relationType === "right") {
    return first.colIndex > second.colIndex;
  }

  /* Valahol feljebb vagy lejjebb */

  if (relationType === "above") {
    return first.rowIndex < second.rowIndex;
  }

  if (relationType === "below") {
    return first.rowIndex > second.rowIndex;
  }

  /* Közvetlenül mellette, ugyanabban a sorban */

  if (relationType === "nextTo") {
    return (
      first.rowIndex === second.rowIndex &&
      Math.abs(colDifference) === 1
    );
  }

  /* Közvetlenül felette */

  if (relationType === "directlyAbove") {
    return (
      first.colIndex === second.colIndex &&
      rowDifference === -1
    );
  }

  /* Közvetlenül alatta */

  if (relationType === "directlyBelow") {
    return (
      first.colIndex === second.colIndex &&
      rowDifference === 1
    );
  }

  if (relationType === "sameRow") {
    return first.rowIndex === second.rowIndex;
  }

  if (relationType === "sameColumn") {
    return first.colIndex === second.colIndex;
  }

  if (relationType === "diagonal") {
  return (
    Math.abs(colDifference) === 1 &&
    Math.abs(rowDifference) === 1
  );
}

  return false;
}

/* ---------------- KÉT ÁLLAT KÖZÖTT ---------------- */

function isBetween(
  middlePosition,
  firstOuterPosition,
  secondOuterPosition
) {
  const middle =
    getCoordinates(middlePosition);

  const firstOuter =
    getCoordinates(firstOuterPosition);

  const secondOuter =
    getCoordinates(secondOuterPosition);

  const sameRow =
    middle.rowIndex === firstOuter.rowIndex &&
    middle.rowIndex === secondOuter.rowIndex;

  if (sameRow) {
    const minimumColumn = Math.min(
      firstOuter.colIndex,
      secondOuter.colIndex
    );

    const maximumColumn = Math.max(
      firstOuter.colIndex,
      secondOuter.colIndex
    );

    return (
      middle.colIndex > minimumColumn &&
      middle.colIndex < maximumColumn
    );
  }

  const sameColumn =
    middle.colIndex === firstOuter.colIndex &&
    middle.colIndex === secondOuter.colIndex;

  if (sameColumn) {
    const minimumRow = Math.min(
      firstOuter.rowIndex,
      secondOuter.rowIndex
    );

    const maximumRow = Math.max(
      firstOuter.rowIndex,
      secondOuter.rowIndex
    );

    return (
      middle.rowIndex > minimumRow &&
      middle.rowIndex < maximumRow
    );
  }

  return false;
}

/* ---------------- KOORDINÁTÁK ---------------- */

function getCoordinates(position) {
  const col = position.charAt(0);
  const row = Number(position.slice(1));

  return {
    colIndex: cols.indexOf(col),
    rowIndex: rows.indexOf(row)
  };
}

/* ---------------- NÉVELŐ ---------------- */

function withArticle(name, lowerCase) {
  const firstLetter =
    name.charAt(0).toLowerCase();

  const vowels = [
    "a",
    "á",
    "e",
    "é",
    "i",
    "í",
    "o",
    "ó",
    "ö",
    "ő",
    "u",
    "ú",
    "ü",
    "ű"
  ];

  const article =
    vowels.includes(firstLetter)
      ? "az"
      : "a";

  if (lowerCase) {
    return `${article} ${name}`;
  }

  return (
    article.charAt(0).toUpperCase() +
    article.slice(1) +
    ` ${name}`
  );
}
function addFromSuffix(name) {
  const lastLetter =
    name.charAt(name.length - 1).toLowerCase();

  const backVowels = [
    "a", "á", "o", "ó", "u", "ú"
  ];

  const suffix =
    backVowels.includes(lastLetter)
      ? "tól"
      : "től";

  return `${name}${suffix}`;
}
/* ---------------- MONDAT ÉS JEL ---------------- */

function getRelationData(
  relationType,
  firstAnimalName,
  secondAnimalName,
  secondAnimalId,
  firstPosition,
  secondPosition
) {
  const first =
    withArticle(firstAnimalName, false);

  const second =
    withArticle(secondAnimalName, true);

  const secondWithFrom =
    withArticle(
      animalFromNames[secondAnimalId],
      true
    );

  const secondComparedTo =
    withArticle(
      animalComparedToNames[secondAnimalId],
      true
    );

  const firstCoordinates =
    getCoordinates(firstPosition);

  const secondCoordinates =
    getCoordinates(secondPosition);

  const colDifference =
    firstCoordinates.colIndex -
    secondCoordinates.colIndex;

  const rowDifference =
    firstCoordinates.rowIndex -
    secondCoordinates.rowIndex;

  /* Valahol balra vagy jobbra */

  if (relationType === "left") {
    return {
      text:
        `${first} ${secondWithFrom} balra van.`,
      symbol: "←",
      layout: "horizontal"
    };
  }

  if (relationType === "right") {
    return {
      text:
        `${first} ${secondWithFrom} jobbra van.`,
      symbol: "→",
      layout: "horizontal"
    };
  }

  /* Valahol felette vagy alatta */

  if (relationType === "above") {
    return {
      text:
        `${first} ${secondComparedTo} képest felfelé van.`,
      symbol: "↑",
      layout: "vertical"
    };
  }

  if (relationType === "below") {
    return {
      text:
        `${first} ${secondComparedTo} képest lefelé van.`,
      symbol: "↓",
      layout: "vertical"
    };
  }

  /* Közvetlenül balra vagy jobbra */

  if (relationType === "nextTo") {
    if (colDifference === -1) {
      return {
        text:
          `${first} közvetlenül ${second} bal oldalán van.`,
        symbol: "⇐",
        layout: "horizontal"
      };
    }

    return {
      text:
        `${first} közvetlenül ${second} jobb oldalán van.`,
      symbol: "⇒",
      layout: "horizontal"
    };
  }

  /* Közvetlenül felette vagy alatta */

  if (relationType === "directlyAbove") {
    return {
      text:
        `${first} közvetlenül ${second} felett van.`,
      symbol: "⇑",
      layout: "vertical"
    };
  }

  if (relationType === "directlyBelow") {
    return {
      text:
        `${first} közvetlenül ${second} alatt van.`,
      symbol: "⇓",
      layout: "vertical"
    };
  }

  /* Azonos sor vagy oszlop */

  if (relationType === "sameRow") {
    return {
      text:
        `${first} ugyanabban a sorban van, mint ${second}.`,
      symbol: "—",
      layout: "horizontal"
    };
  }

  if (relationType === "sameColumn") {
    return {
      text:
        `${first} ugyanabban az oszlopban van, mint ${second}.`,
      symbol: "│",
      layout: "vertical"
    };
  }

  /* Közvetlen átlós helyzet */

  if (relationType === "diagonal") {
    let diagonalSymbol = "↘";

    if (
      colDifference === -1 &&
      rowDifference === -1
    ) {
      diagonalSymbol = "↖";
    }

    if (
      colDifference === 1 &&
      rowDifference === -1
    ) {
      diagonalSymbol = "↗";
    }

    if (
      colDifference === -1 &&
      rowDifference === 1
    ) {
      diagonalSymbol = "↙";
    }

    if (
      colDifference === 1 &&
      rowDifference === 1
    ) {
      diagonalSymbol = "↘";
    }

    return {
      text:
        `${first} ${second} közvetlen átlós szomszédja.`,
      symbol: diagonalSymbol,
      layout: "diagonal"
    };
  }

  return {
    text: "",
    symbol: "?",
    layout: "horizontal"
  };
}

/* ---------------- FELADAT MEGJELENÍTÉSE ---------------- */

function showStatement() {
  if (currentStatement.type === "between") {
    showBetweenStatement();
    return;
  }

  const firstAnimalName =
    animalNames[currentStatement.firstAnimalId];

  const secondAnimalName =
    animalNames[currentStatement.secondAnimalId];

  const layoutClass =
    currentStatement.layout === "vertical"
      ? "visual-statement-vertical"
      : "visual-statement-horizontal";

  document.getElementById("task").innerHTML = `
    <div class="task-card truth-task-card">

      <div
        class="visual-statement ${layoutClass}"
        aria-label="${currentStatement.text}"
      >

        <img
          class="statement-animal"
          src="images/animals_fixed/${currentStatement.firstAnimalId}.svg"
          alt="${firstAnimalName}"
        >

        <span
          class="statement-symbol"
          aria-hidden="true"
        >
          ${currentStatement.symbol}
        </span>

        <img
          class="statement-animal"
          src="images/animals_fixed/${currentStatement.secondAnimalId}.svg"
          alt="${secondAnimalName}"
        >

      </div>

    </div>
  `;
}

function showBetweenStatement() {
  const middleAnimalName =
    animalNames[currentStatement.middleAnimalId];

  const firstOuterAnimalName =
    animalNames[currentStatement.firstOuterAnimalId];

  const secondOuterAnimalName =
    animalNames[currentStatement.secondOuterAnimalId];

  document.getElementById("task").innerHTML = `
    <div class="task-card truth-task-card">

      <div
        class="visual-statement between-statement"
        aria-label="${currentStatement.text}"
      >

        <img
          class="statement-animal"
          src="images/animals_fixed/${currentStatement.firstOuterAnimalId}.svg"
          alt="${firstOuterAnimalName}"
        >

        <span class="between-line">—</span>

        <img
          class="statement-animal statement-middle-animal"
          src="images/animals_fixed/${currentStatement.middleAnimalId}.svg"
          alt="${middleAnimalName}"
        >

        <span class="between-line">—</span>

        <img
          class="statement-animal"
          src="images/animals_fixed/${currentStatement.secondOuterAnimalId}.svg"
          alt="${secondOuterAnimalName}"
        >

      </div>

    </div>
  `;
}

/* ---------------- VÁLASZ ELLENŐRZÉSE ---------------- */

function answerStatement(selectedAnswer, button) {
  if (checkingAnswer) return;

  checkingAnswer = true;

  if (selectedAnswer === currentStatement.isTrue) {
    handleCorrectAnswer(button);
  } else {
    handleWrongAnswer(button);
  }
}

/* ---------------- HELYES VÁLASZ ---------------- */

function handleCorrectAnswer(button) {
  playOkSound();

  correctCount++;

  button.classList.add("truth-correct");

  markStatementAnimals("correct");

  document.getElementById("message").innerText =
    "🎉 Helyes!";

  if (shouldShowReward()) {
    showRewardCard();
    return;
  }

  setTimeout(() => {
    newTask();
  }, 800);
}

/* ---------------- HIBÁS VÁLASZ ---------------- */

function handleWrongAnswer(button) {
  playBadSound();

  button.classList.add("truth-wrong");

  const randomWrong =
    wrongMessages[
      Math.floor(Math.random() * wrongMessages.length)
    ];

  document.getElementById("message").innerText =
    randomWrong;

  setTimeout(() => {
    button.classList.remove("truth-wrong");

    checkingAnswer = false;
  }, 650);
}

/* ---------------- ÁLLATOK KIEMELÉSE ---------------- */

function markStatementAnimals(className) {
  currentStatement.positions.forEach(position => {
    const cell =
      document.querySelector(
        `[data-key="${position}"]`
      );

    if (cell) {
      cell.classList.add(className);
    }
  });
}

/* ---------------- TÖRLÉSEK ---------------- */

function clearBoardMarks() {
  document.querySelectorAll(".cell").forEach(cell => {
    cell.classList.remove(
      "correct",
      "wrong",
      "selected",
      "statement-focus"
    );
  });
}

function clearAnswerButtons() {
  document
    .querySelectorAll(".truth-button")
    .forEach(button => {
      button.classList.remove(
        "truth-correct",
        "truth-wrong"
      );
    });
}
/* ---------------- JELMAGYARÁZAT ---------------- */

function openTruthLegend() {
  const modal =
    document.getElementById("truthLegendModal");

  if (!modal) {
    return;
  }

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");

  document.body.classList.add(
    "truth-legend-open"
  );
}

function closeTruthLegend() {
  const modal =
    document.getElementById("truthLegendModal");

  if (!modal) {
    return;
  }

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");

  document.body.classList.remove(
    "truth-legend-open"
  );

  localStorage.setItem(
    "truthLegendSeen",
    "true"
  );
}

function setupTruthLegend() {
  const modal =
    document.getElementById("truthLegendModal");

  if (!modal) {
    return;
  }

  modal.addEventListener("click", event => {
    if (event.target === modal) {
      closeTruthLegend();
    }
  });

  document.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Escape" &&
        modal.classList.contains("open")
      ) {
        closeTruthLegend();
      }
    }
  );
}

/* ---------------- START ---------------- */

shuffleGrid();
renderBoard();
newTask();

setupTruthLegend();

if (
  localStorage.getItem(
    "truthLegendSeen"
  ) !== "true"
) {
  setTimeout(() => {
    openTruthLegend();
  }, 250);
}