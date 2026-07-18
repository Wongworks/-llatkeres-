/* ---------------- HANGGAL RENDELKEZŐ ÁLLATOK ---------------- */

const animalsWithSounds = [
  "balna",
  "barany",
  "beka",
  "eger",
  "elefant",
  "flamingo",
  "kacsa",
  "kakas",
  "kigyo",
  "kutya",
  "lo",
  "macska",
  "majom",
  "pava",
  "tehen"
];

/* ---------------- ÁLLAPOT ---------------- */

let targetAnimal = "";
let targetPosition = "";
let lastTargetAnimal = "";

let animalSound = null;
let animalSoundUnlocked = false;

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

      cell.addEventListener("click", () => {
        checkAnswer(key, cell);
      });

      board.appendChild(cell);
    }
  }
}

/* ---------------- ÚJ PÁLYA ---------------- */

function newBoard() {
  correctCount = 0;
  lastTargetAnimal = "";
  checkingAnswer = false;

  stopAnimalSound();

  shuffleGrid();
  renderBoard();
  newTask();

  document.getElementById("message").innerText = "";
}

/* ---------------- ÚJ FELADAT ---------------- */

function newTask() {
  checkingAnswer = false;

  stopAnimalSound();
  clearBoardMarks();

  do {
    targetAnimal =
      animalsWithSounds[
        Math.floor(
          Math.random() * animalsWithSounds.length
        )
      ];
  } while (
    targetAnimal === lastTargetAnimal &&
    animalsWithSounds.length > 1
  );

  lastTargetAnimal = targetAnimal;

  targetPosition = findAnimalPosition(targetAnimal);

  prepareAnimalSound();
  showTask();

  document.getElementById("message").innerText = "";

  // Az első hangszóró-kattintás után
  // az új feladatok hangja automatikusan elindul.
  if (animalSoundUnlocked) {
    setTimeout(() => {
      playAnimalSound();
    }, 250);
  }
}

/* ---------------- ÁLLAT HELYÉNEK MEGKERESÉSE ---------------- */

function findAnimalPosition(animalId) {
  const positions = Object.keys(grid);

  return (
    positions.find(position => {
      return grid[position] === animalId;
    }) || ""
  );
}

/* ---------------- FELADATKÁRTYA ---------------- */

function showTask() {
document.getElementById("task").innerHTML = `
  <div class="task-card animal-sound-task-card">

    <div class="animal-sound-question">
      Ki adja ki ezt a hangot?
    </div>

    <button
      class="animal-sound-button"
      onclick="unlockAndPlayAnimalSound()"
      title="Állathang lejátszása"
      aria-label="Állathang lejátszása"
    >
      🔊
    </button>

  </div>
`;
}

/* ---------------- HANG ELŐKÉSZÍTÉSE ---------------- */

function prepareAnimalSound() {
  animalSound =
    new Audio(
      `sounds/animals/${targetAnimal}.wav`
    );

  animalSound.preload = "auto";
  animalSound.volume = 0.8;

  animalSound.addEventListener("error", () => {
    document.getElementById("message").innerText =
      "⚠️ Ez a hangfájl nem tölthető be.";
  });
}

/* ---------------- HANG LEJÁTSZÁSA ---------------- */

function unlockAndPlayAnimalSound() {
  animalSoundUnlocked = true;
  playAnimalSound();
}

function playAnimalSound() {
  if (!animalSound) return;

  animalSound.pause();
  animalSound.currentTime = 0;

  animalSound.play().catch(() => {
    document.getElementById("message").innerText =
      "Nyomd meg újra a hangszórót!";
  });
}

/* ---------------- HANG LEÁLLÍTÁSA ---------------- */

function stopAnimalSound() {
  if (!animalSound) return;

  animalSound.pause();
  animalSound.currentTime = 0;
}

/* ---------------- VÁLASZ ELLENŐRZÉSE ---------------- */

function checkAnswer(selectedPosition, selectedCell) {
  if (checkingAnswer) return;

  if (selectedPosition === targetPosition) {
    handleCorrectAnswer(selectedCell);
  } else {
    handleWrongAnswer(selectedCell);
  }
}

/* ---------------- HELYES VÁLASZ ---------------- */

function handleCorrectAnswer(selectedCell) {
  checkingAnswer = true;

  stopAnimalSound();
  playOkSound();

  correctCount++;

  selectedCell.classList.add("correct");

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

function handleWrongAnswer(selectedCell) {
  checkingAnswer = true;

  playBadSound();

  selectedCell.classList.add("wrong");

  const randomWrong =
    wrongMessages[
      Math.floor(Math.random() * wrongMessages.length)
    ];

  document.getElementById("message").innerText =
    randomWrong;

  setTimeout(() => {
    selectedCell.classList.remove("wrong");
    checkingAnswer = false;
  }, 650);
}

/* ---------------- JELÖLÉSEK TÖRLÉSE ---------------- */

function clearBoardMarks() {
  document.querySelectorAll(".cell").forEach(cell => {
    cell.classList.remove(
      "correct",
      "wrong",
      "selected",
      "start-position"
    );
  });
}

/* ---------------- OLDAL ELHAGYÁSA ---------------- */

window.addEventListener("beforeunload", () => {
  stopAnimalSound();
});

/* ---------------- START ---------------- */

shuffleGrid();
renderBoard();
newTask();