/* ---------------- JÁTÉKMÓD ---------------- */

const gameMode = localStorage.getItem("codeGameMode") || "kodkereso";

/* ---------------- RÁCS ---------------- */

const cols = ["A", "B", "C", "D", "E"];
const rows = [1, 2, 3, 4, 5, 6, 7];

/* ---------------- ÁLLAPOT ---------------- */

let target = "";

let targetKeys = [];
let selectedKeys = new Set();
let solvedKeys = new Set();

let pathKeys = [];
let pathIndex = 0;

let correctCount = 0;

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

  // Sorok és állatmezők
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
      img.src = `images/animals_fixed/${grid[key]}.svg`;
      img.className = "animal";
      img.alt = animalNames[grid[key]] || grid[key];

      cell.appendChild(img);
      cell.onclick = () => check(cell, key);

      board.appendChild(cell);
    }
  }
}

/* ---------------- ÚJ PÁLYA ---------------- */

function newBoard() {
  correctCount = 0;

  shuffleGrid();
  renderBoard();
  newTask();

  document.getElementById("message").innerText = "";
}

/* ---------------- ÚJ FELADAT ---------------- */

function newTask() {
  target = "";

  targetKeys = [];
  selectedKeys.clear();
  solvedKeys.clear();

  pathKeys = [];
  pathIndex = 0;

  clearBoardMarks();

  const keys = Object.keys(grid);

  if (gameMode === "kodfejto") {
    createCodeBreakerTask(keys);
  } else if (gameMode === "kodosveny") {
    createCodePathTask();
  } else {
    createCodeFinderTask(keys);
  }

  document.getElementById("message").innerText = "";
}

/* ---------------- KÓDKERESŐ FELADAT ---------------- */

function createCodeFinderTask(keys) {
  target = keys[Math.floor(Math.random() * keys.length)];

  document.getElementById("task").innerHTML = `
    <div class="task-card">
      <div class="task-name">${target}</div>
    </div>
  `;
}

/* ---------------- KÓDFEJTŐ FELADAT ---------------- */

function createCodeBreakerTask(keys) {
  const count = Math.floor(Math.random() * 3) + 3;

  targetKeys = shuffleArray([...keys]).slice(0, count);

  document.getElementById("task").innerHTML = `
    <div class="task-card">
      <div class="code-row code-breaker-row">
        ${targetKeys
          .map(key => `<span class="code-chip">${key}</span>`)
          .join("")}
      </div>
    </div>
  `;
}

/* ---------------- KÓDÖSVÉNY FELADAT ---------------- */

function createCodePathTask() {
  const length = Math.floor(Math.random() * 3) + 6;

  pathKeys = generateCodePath(length);
  pathIndex = 0;

document.getElementById("task").innerHTML = `
  <div class="task-card code-path-card">
    <div
      class="code-row code-path-row"
      style="--code-count: ${pathKeys.length}"
    >
        ${pathKeys
          .map((key, index) => `
            <span
              class="code-chip path-chip ${index === 0 ? "active-code" : ""}"
              data-path-index="${index}"
            >
              ${key}
            </span>
          `)
          .join("")}
      </div>
    </div>
  `;
}

/* ---------------- KATTINTÁS ---------------- */

function check(cell, key) {
  if (gameMode === "kodfejto") {
    checkCodeBreaker(cell, key);
  } else if (gameMode === "kodosveny") {
    checkCodePath(cell, key);
  } else {
    checkCodeFinder(cell, key);
  }
}

/* ---------------- KÓDKERESŐ ---------------- */

function checkCodeFinder(cell, key) {
  if (key === target) {
    playOkSound();
    correctCount++;

    cell.classList.add("correct");
    document.getElementById("message").innerText = "🎉 Helyes!";

    if (correctCount % 5 === 0) {
      showRewardCard();
      return;
    }

    setTimeout(() => {
      newTask();
    }, 500);

    return;
  }

  showWrongAnswer(cell);
}

/* ---------------- KÓDFEJTŐ ---------------- */

function checkCodeBreaker(cell, key) {
  // A már helyesen megtalált mezőket nem lehet visszavonni
  if (solvedKeys.has(key)) {
    return;
  }

  // Új kattintásra a kijelölés megszűnik
  if (selectedKeys.has(key)) {
    selectedKeys.delete(key);
    cell.classList.remove("selected");
  } else {
    selectedKeys.add(key);
    cell.classList.add("selected");
  }

  // Csak akkor ellenőrzünk, amikor minden szükséges kijelölés megvan
  if (selectedKeys.size + solvedKeys.size === targetKeys.length) {
    checkSelectedCodes();
  }
}

function checkSelectedCodes() {
  let hasWrong = false;

  selectedKeys.forEach(key => {
    const cell = getCell(key);

    if (targetKeys.includes(key)) {
      solvedKeys.add(key);

      cell.classList.remove("selected");
      cell.classList.add("correct");
    } else {
      hasWrong = true;

      cell.classList.remove("selected");
      cell.classList.add("wrong");
    }
  });

  selectedKeys.clear();

  if (hasWrong) {
    playBadSound();
    showRandomWrongMessage();

    setTimeout(() => {
      document.querySelectorAll(".cell.wrong").forEach(cell => {
        cell.classList.remove("wrong");
      });
    }, 500);

    return;
  }

  if (solvedKeys.size === targetKeys.length) {
    finishCodeBreakerTask();
  }
}

function finishCodeBreakerTask() {
  playOkSound();
  correctCount++;

  document.getElementById("message").innerText =
    "🎉 Ügyes kódfejtés!";

if (shouldShowReward()) {
  showRewardCard();
  return;
}

  setTimeout(() => {
    newTask();
  }, 700);
}

/* ---------------- KÓDÖSVÉNY ---------------- */

function checkCodePath(cell, key) {
  const expectedKey = pathKeys[pathIndex];

  if (key !== expectedKey) {
    showWrongAnswer(cell);
    return;
  }

  playOkSound();

  cell.classList.add("correct");

  markPathCodeCompleted(pathIndex);

  pathIndex++;

  if (pathIndex === pathKeys.length) {
    finishCodePathTask();
    return;
  }

  markPathCodeActive(pathIndex);

  document.getElementById("message").innerText =
    `🐾 ${pathIndex} / ${pathKeys.length}`;
}

function finishCodePathTask() {
  correctCount++;

  document.getElementById("message").innerText =
    "🎉 Végigjártad a Kódösvényt!";

 if (shouldShowReward()) {
  showRewardCard();
  return;
}

  setTimeout(() => {
    newTask();
  }, 900);
}

/* ---------------- KÓDÖSVÉNY KÁRTYÁI ---------------- */

function markPathCodeCompleted(index) {
  const chip = document.querySelector(
    `[data-path-index="${index}"]`
  );

  if (!chip) return;

  chip.classList.remove("active-code");
  chip.classList.add("completed-code");
}

function markPathCodeActive(index) {
  const chip = document.querySelector(
    `[data-path-index="${index}"]`
  );

  if (!chip) return;

  chip.classList.add("active-code");
}

/* ---------------- ÖSVÉNY GENERÁLÁSA ---------------- */

function generateCodePath(length) {
  const allKeys = Object.keys(grid);

  /*
    Többször próbálunk olyan útvonalat készíteni,
    amely nem lép kétszer ugyanarra a mezőre.
  */
  for (let attempt = 0; attempt < 100; attempt++) {
    const start =
      allKeys[Math.floor(Math.random() * allKeys.length)];

    const path = [start];

    while (path.length < length) {
      const current = path[path.length - 1];

      const possibleNext = getNeighbours(current)
        .filter(key => !path.includes(key));

      if (possibleNext.length === 0) {
        break;
      }

      const next =
        possibleNext[
          Math.floor(Math.random() * possibleNext.length)
        ];

      path.push(next);
    }

    if (path.length === length) {
      return path;
    }
  }

  // Biztonsági tartalék, ha nem sikerülne az ösvény
  return shuffleArray([...allKeys]).slice(0, length);
}

/* ---------------- SZOMSZÉDOS MEZŐK ---------------- */

function getNeighbours(key) {
  const col = key.charAt(0);
  const row = Number(key.slice(1));

  const colIndex = cols.indexOf(col);
  const neighbours = [];

  // Balra
  if (colIndex > 0) {
    neighbours.push(cols[colIndex - 1] + row);
  }

  // Jobbra
  if (colIndex < cols.length - 1) {
    neighbours.push(cols[colIndex + 1] + row);
  }

  // Felfelé
  if (row > rows[0]) {
    neighbours.push(col + (row - 1));
  }

  // Lefelé
  if (row < rows[rows.length - 1]) {
    neighbours.push(col + (row + 1));
  }

  return neighbours;
}

/* ---------------- HIBÁS VÁLASZ ---------------- */

function showWrongAnswer(cell) {
  playBadSound();

  cell.classList.add("wrong");
  showRandomWrongMessage();

  setTimeout(() => {
    cell.classList.remove("wrong");
  }, 300);
}

function showRandomWrongMessage() {
  const randomWrong =
    wrongMessages[
      Math.floor(Math.random() * wrongMessages.length)
    ];

  document.getElementById("message").innerText = randomWrong;
}

/* ---------------- SEGÉDFÜGGVÉNYEK ---------------- */

function getCell(key) {
  return document.querySelector(`[data-key="${key}"]`);
}

function clearBoardMarks() {
  document.querySelectorAll(".cell").forEach(cell => {
    cell.classList.remove(
      "correct",
      "wrong",
      "selected"
    );
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

/* ---------------- START ---------------- */

shuffleGrid();
renderBoard();
newTask();