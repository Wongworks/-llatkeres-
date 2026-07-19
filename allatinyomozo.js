const detectiveMode =
  localStorage.getItem("animalDetectiveMode") || "tracks";

const detectiveAnimals = {
  tracks: [
    "beka",
    "eger",
    "elefant",
    "gyik",
    "kacsa",
    "kakas",
    "kigyo",
    "kutya",
    "lo",
    "macska",
    "majom",
    "oroszlan",
    "pingvin",
    "roka",
    "szarvas",
    "tehen",
    "teve",
    "vizilo"
  ],

patterns: [
  "balna",
  "barany",
  "beka",
  "csiga",
  "elefant",
  "flamingo",
  "foka",
  "gyik",
  "hal",
  "kacsa",
  "kakas",
  "kecske",
  "kigyo",
  "krokodil",
  "macska",
  "mokus",
  "nyul",
  "oroszlan",
  "pava",
  "pingvin",
  "polip",
  "rak",
  "roka",
  "szarvas",
  "tehen",
  "teknos",
  "lo",
  "vizilo",
  "zebra",
  "zsiraf"
]
};

let boardAnimals = [];
let target = "";
let lastTarget = "";
let correctCount = 0;
let checkingAnswer = false;

function shuffleArray(items) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function getActiveAnimals() {
  return detectiveAnimals[detectiveMode] || detectiveAnimals.tracks;
}

function getClueImagePath(animalId) {
  if (detectiveMode === "patterns") {
    return `images/patterns/${animalId}.png`;
  }

  return `images/tracks/${animalId}.png`;
}

function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  boardAnimals.forEach(animalId => {
    const cell = document.createElement("button");

    cell.type = "button";
    cell.className = "detective-cell";
    cell.dataset.animal = animalId;
    cell.setAttribute(
      "aria-label",
      animalNames[animalId] || animalId
    );

    const img = document.createElement("img");
    img.src = `images/animals_fixed/${animalId}.svg`;
    img.alt = animalNames[animalId] || animalId;

    cell.appendChild(img);

    cell.addEventListener("click", () =>
      checkAnswer(cell, animalId)
    );

    board.appendChild(cell);
  });
}

function checkAnswer(cell, animalId) {
  if (checkingAnswer) return;

  if (animalId === target) {
    checkingAnswer = true;

    playOkSound();
    correctCount++;

    cell.classList.add("detective-correct");

    document.getElementById("message").innerText =
      "🎉 Helyes!";

    if (shouldShowReward()) {
      setTimeout(() => {
        clearBoardMarks();
        showRewardCard();
      }, 450);

      return;
    }

    setTimeout(() => {
      clearBoardMarks();
      newTask();
    }, 650);

    return;
  }

  playBadSound();

  cell.classList.add("detective-wrong");

  const randomWrong =
    wrongMessages[
      Math.floor(Math.random() * wrongMessages.length)
    ];

  document.getElementById("message").innerText =
    randomWrong;

  setTimeout(() => {
    cell.classList.remove("detective-wrong");
  }, 350);
}

function newBoard() {
  correctCount = 0;
  checkingAnswer = false;
  lastTarget = "";

  boardAnimals = shuffleArray(getActiveAnimals());

  renderBoard();
  newTask();

  document.getElementById("message").innerText = "";
}

function newTask() {
  checkingAnswer = false;

  const animals = getActiveAnimals();

  if (!animals.length) {
    document.getElementById("task").innerHTML = `
      <div class="task-card detective-task-card">
        Ehhez a módhoz még nincsenek képek.
      </div>
    `;

    return;
  }

  do {
    target =
      animals[
        Math.floor(Math.random() * animals.length)
      ];
  } while (
    target === lastTarget &&
    animals.length > 1
  );

  lastTarget = target;

  const animalName = animalNames[target] || target;
  const cluePath = getClueImagePath(target);

  document.getElementById("task").innerHTML = `
    <div class="task-card detective-task-card">
      <img
        class="detective-clue-image"
        src="${cluePath}"
        alt="${animalName} nyoma"
      >
    </div>
  `;

  document.getElementById("message").innerText = "";

  clearBoardMarks();
}

function clearBoardMarks() {
  document
    .querySelectorAll(".detective-cell")
    .forEach(cell => {
      cell.classList.remove(
        "detective-correct",
        "detective-wrong"
      );
    });
}

/* ---------------- START ---------------- */

boardAnimals = shuffleArray(getActiveAnimals());

renderBoard();
newTask();