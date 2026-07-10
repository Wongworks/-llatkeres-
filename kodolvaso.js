/* ---------------- RÁCS ---------------- */

const cols = ["A", "B", "C", "D", "E"];
const rows = [1, 2, 3, 4, 5, 6, 7];

/* ---------------- ÁLLAPOT ---------------- */

let target = "";
let lastTarget = "";

let selectedLetter = "";
let selectedNumber = "";

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
      img.src = `images/animals_fixed/${grid[key]}.svg`;
      img.className = "animal";
      img.alt = animalNames[grid[key]] || grid[key];

      cell.appendChild(img);
      board.appendChild(cell);
    }
  }
}

/* ---------------- ÚJ PÁLYA ---------------- */

function newBoard() {
  correctCount = 0;
  lastTarget = "";

  shuffleGrid();
  renderBoard();
  newTask();

  document.getElementById("message").innerText = "";
}

/* ---------------- ÚJ FELADAT ---------------- */

function newTask() {
  checkingAnswer = false;

  selectedLetter = "";
  selectedNumber = "";

  clearAnswerButtons();
  clearBoardMarks();
  updateSelectedCode();

  const keys = Object.keys(grid);

  do {
    target = keys[Math.floor(Math.random() * keys.length)];
  } while (target === lastTarget && keys.length > 1);

  lastTarget = target;

  const animalId = grid[target];
  const animalName = animalNames[animalId];

  document.getElementById("task").innerHTML = `
    <div class="task-card">
      <img
        class="task-animal code-reader-animal"
        src="images/animals_fixed/${animalId}.svg"
        alt="${animalName}"
      >
    </div>
  `;

  document.getElementById("message").innerText = "";
}

/* ---------------- BETŰ KIVÁLASZTÁSA ---------------- */

function selectLetter(button) {
  if (checkingAnswer) return;

  document.querySelectorAll(".letter-btn").forEach(btn => {
    btn.classList.remove("answer-selected");
  });

  selectedLetter = button.dataset.value;
  button.classList.add("answer-selected");

  updateSelectedCode();
  checkIfAnswerIsComplete();
}

/* ---------------- SZÁM KIVÁLASZTÁSA ---------------- */

function selectNumber(button) {
  if (checkingAnswer) return;

  document.querySelectorAll(".number-btn").forEach(btn => {
    btn.classList.remove("answer-selected");
  });

  selectedNumber = button.dataset.value;
  button.classList.add("answer-selected");

  updateSelectedCode();
  checkIfAnswerIsComplete();
}

/* ---------------- KÓD MEGJELENÍTÉSE ---------------- */

function updateSelectedCode() {
  const letter = selectedLetter || "_";
  const number = selectedNumber || "_";

  document.getElementById("selectedCode").innerText =
    letter + number;
}

/* ---------------- ELLENŐRZÉS INDÍTÁSA ---------------- */

function checkIfAnswerIsComplete() {
  if (!selectedLetter || !selectedNumber) {
    return;
  }

  checkingAnswer = true;

  const selectedCode =
    selectedLetter + selectedNumber;

  if (selectedCode === target) {
    handleCorrectAnswer();
  } else {
    handleWrongAnswer();
  }
}

/* ---------------- HELYES VÁLASZ ---------------- */

function handleCorrectAnswer() {
  playOkSound();
  correctCount++;

  const selectedButtons =
    document.querySelectorAll(".answer-selected");

  selectedButtons.forEach(button => {
    button.classList.remove("answer-selected");
    button.classList.add("answer-correct");
  });

  const targetCell =
    document.querySelector(`[data-key="${target}"]`);

  if (targetCell) {
    targetCell.classList.add("correct");
  }

  document.getElementById("message").innerText =
    "🎉 Helyes!";

  if (shouldShowReward()) {
    showRewardCard();
    return;
  }

  setTimeout(() => {
    newTask();
  }, 700);
}

/* ---------------- HIBÁS VÁLASZ ---------------- */

function handleWrongAnswer() {
  playBadSound();

  const selectedButtons =
    document.querySelectorAll(".answer-selected");

  selectedButtons.forEach(button => {
    button.classList.remove("answer-selected");
    button.classList.add("answer-wrong");
  });

  const randomWrong =
    wrongMessages[
      Math.floor(Math.random() * wrongMessages.length)
    ];

  document.getElementById("message").innerText =
    randomWrong;

  setTimeout(() => {
    selectedLetter = "";
    selectedNumber = "";

    clearAnswerButtons();
    updateSelectedCode();

    checkingAnswer = false;
  }, 650);
}

/* ---------------- GOMBOK TÖRLÉSE ---------------- */

function clearAnswerButtons() {
  document.querySelectorAll(".answer-btn").forEach(button => {
    button.classList.remove(
      "answer-selected",
      "answer-correct",
      "answer-wrong"
    );
  });
}

/* ---------------- TÁBLA JELÖLÉSEINEK TÖRLÉSE ---------------- */

function clearBoardMarks() {
  document.querySelectorAll(".cell").forEach(cell => {
    cell.classList.remove("correct", "wrong", "selected");
  });
}

/* ---------------- GOMBOK ESEMÉNYEI ---------------- */

document.querySelectorAll(".letter-btn").forEach(button => {
  button.addEventListener("click", () => {
    selectLetter(button);
  });
});

document.querySelectorAll(".number-btn").forEach(button => {
  button.addEventListener("click", () => {
    selectNumber(button);
  });
});

/* ---------------- START ---------------- */

shuffleGrid();
renderBoard();
newTask();