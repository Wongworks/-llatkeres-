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
let lastTargetAnimal = "";
let boardAnimals = [];

let animalSound = null;
let animalSoundUnlocked = false;

let correctCount = 0;
let checkingAnswer = false;

/* ---------------- KEVERÉS ---------------- */
function shuffleSoundAnimals() {
  const result = [...animalsWithSounds];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [
      result[j],
      result[i]
    ];
  }

  return result;
}
/* ---------------- TÁBLA ---------------- */

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

    img.src =
      `images/animals_fixed/${animalId}.svg`;

    img.alt =
      animalNames[animalId] || animalId;

    cell.appendChild(img);

    cell.addEventListener("click", () => {
      checkAnswer(animalId, cell);
    });

    board.appendChild(cell);
  });
}

/* ---------------- ÚJ PÁLYA ---------------- */

function newBoard() {
  correctCount = 0;
  lastTargetAnimal = "";
  checkingAnswer = false;

  stopAnimalSound();

  boardAnimals = shuffleSoundAnimals();

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
  stopAnimalSound();

  animalSound = new Audio(
    `sounds/animals/${targetAnimal}.mp3`
  );

  animalSound.preload = "auto";
  animalSound.volume = 0.8;
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

function checkAnswer(selectedAnimal, selectedCell) {
  if (checkingAnswer) return;

  if (selectedAnimal === targetAnimal) {
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

  selectedCell.classList.add("detective-correct");

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

  selectedCell.classList.add("detective-wrong");

  const randomWrong =
    wrongMessages[
      Math.floor(Math.random() * wrongMessages.length)
    ];

  document.getElementById("message").innerText =
    randomWrong;

  setTimeout(() => {
    selectedCell.classList.remove("detective-wrong");
    checkingAnswer = false;
  }, 650);
}

/* ---------------- JELÖLÉSEK TÖRLÉSE ---------------- */

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

/* ---------------- OLDAL ELHAGYÁSA ---------------- */

window.addEventListener("beforeunload", () => {
  stopAnimalSound();
});

/* ---------------- START ---------------- */

boardAnimals = shuffleSoundAnimals();

renderBoard();
newTask();