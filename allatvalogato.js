/* ---------------- ÁLLAPOT ---------------- */

const sortingGameMode =
  localStorage.getItem("sortingGameMode") || "konnyu";

let currentTask = null;
let lastTaskCategory = "";

let selectedPositions = [];
let confirmedPositions = [];

let correctCount = 0;
let checkingAnswer = false;

let speechUnlocked = false;
let taskAudio = null;

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
        selectAnimal(key, cell);
      });

      board.appendChild(cell);
    }
  }
}

/* ---------------- ÚJ PÁLYA ---------------- */

function newBoard() {
  correctCount = 0;
  lastTaskCategory = "";

  selectedPositions = [];
  confirmedPositions = [];

  checkingAnswer = false;

  stopTaskAudio();

  shuffleGrid();
  renderBoard();
  newTask();

  document.getElementById("message").innerText = "";
}

/* ---------------- ÚJ FELADAT ---------------- */

function newTask() {
  checkingAnswer = false;

  selectedPositions = [];
  confirmedPositions = [];

  stopTaskAudio();
  clearBoardMarks();

  currentTask = chooseTask();
  lastTaskCategory = currentTask.category;

  prepareTaskAudio();
  showTask();

  document.getElementById("message").innerText = "";

}

/* ---------------- FELADAT KIVÁLASZTÁSA ---------------- */

function chooseTask() {
  let availableTasks = categoryTasks.filter(task => {
    if (task.mode !== sortingGameMode) {
      return false;
    }

    const matchingAnimals =
      getAnimalsByCategory(task.category);

    return matchingAnimals.length >= task.count;
  });

  if (availableTasks.length === 0) {
    return {
      mode: "konnyu",
      category: "haziallat",
      count: 4,
      displayText: "Keress 4 háziállatot!",
      speechText: "Keress négy háziállatot!",
      soundFile: "haziallat-4.mp3"
    };
  }

  const differentCategoryTasks =
    availableTasks.filter(task => {
      return task.category !== lastTaskCategory;
    });

  if (differentCategoryTasks.length > 0) {
    availableTasks = differentCategoryTasks;
  }

  return availableTasks[
    Math.floor(Math.random() * availableTasks.length)
  ];
}

/* ---------------- FELADATKÁRTYA ---------------- */

function showTask() {
  document.getElementById("task").innerHTML = `
    <div class="task-card sorter-task-card">

      <div class="sorter-task-text">
        ${currentTask.displayText}
      </div>

      <button
        class="sorter-speak-button"
        onclick="unlockAndSpeakTask()"
        title="Feladat meghallgatása"
        aria-label="Feladat meghallgatása"
      >
        🔊
      </button>

      <div
        id="selectionCounter"
        class="selection-counter"
      >
        0 / ${currentTask.count}
      </div>

    </div>
  `;
}

/* ---------------- ÁLLAT KIVÁLASZTÁSA ---------------- */

function selectAnimal(position, cell) {
  if (checkingAnswer || !currentTask) {
    return;
  }

  // A már elfogadott helyes állat nem törölhető.
  if (confirmedPositions.includes(position)) {
    return;
  }

  const selectedIndex =
    selectedPositions.indexOf(position);

  // Ismételt kattintás: kijelölés visszavonása.
  if (selectedIndex !== -1) {
    selectedPositions.splice(selectedIndex, 1);
    cell.classList.remove("selected");

    updateSelectionCounter();
    return;
  }

  const remainingCount =
    currentTask.count - confirmedPositions.length;

  // Ne lehessen a még szükséges darabszámnál
  // több új állatot kijelölni.
  if (selectedPositions.length >= remainingCount) {
    return;
  }

  selectedPositions.push(position);
  cell.classList.add("selected");

  updateSelectionCounter();

  if (selectedPositions.length === remainingCount) {
    checkSelections();
  }
}

/* ---------------- SZÁMLÁLÓ ---------------- */

function updateSelectionCounter() {
  const counter =
    document.getElementById("selectionCounter");

  if (!counter || !currentTask) {
    return;
  }

  const totalSelected =
    confirmedPositions.length +
    selectedPositions.length;

  counter.innerText =
    `${totalSelected} / ${currentTask.count}`;
}

/* ---------------- KIJELÖLÉSEK ELLENŐRZÉSE ---------------- */

function checkSelections() {
  if (checkingAnswer || !currentTask) {
    return;
  }

  checkingAnswer = true;

  const correctSelections = [];
  const wrongSelections = [];

  selectedPositions.forEach(position => {
    const animalId = grid[position];

    const categories =
      animalCategories[animalId] || [];

    if (categories.includes(currentTask.category)) {
      correctSelections.push(position);
    } else {
      wrongSelections.push(position);
    }
  });

  acceptCorrectSelections(correctSelections);

  if (wrongSelections.length > 0) {
    showWrongSelections(wrongSelections);
    return;
  }

  selectedPositions = [];

  if (confirmedPositions.length >= currentTask.count) {
    handleCompletedTask();
    return;
  }

  checkingAnswer = false;
  updateSelectionCounter();
}

/* ---------------- HELYES KIJELÖLÉSEK ELFOGADÁSA ---------------- */

function acceptCorrectSelections(positions) {
  positions.forEach(position => {
    if (!confirmedPositions.includes(position)) {
      confirmedPositions.push(position);
    }

    const cell =
      document.querySelector(
        `[data-key="${position}"]`
      );

    if (!cell) {
      return;
    }

    cell.classList.remove("selected");
    cell.classList.add("sorter-confirmed");
  });
}

/* ---------------- HIBÁS KIJELÖLÉSEK ---------------- */

function showWrongSelections(wrongSelections) {
  playBadSound();

  wrongSelections.forEach(position => {
    const cell =
      document.querySelector(
        `[data-key="${position}"]`
      );

    if (!cell) {
      return;
    }

    cell.classList.remove("selected");
    cell.classList.add("wrong");
  });

  const randomWrong =
    wrongMessages[
      Math.floor(Math.random() * wrongMessages.length)
    ];

  document.getElementById("message").innerText =
    randomWrong;

  setTimeout(() => {
    wrongSelections.forEach(position => {
      const cell =
        document.querySelector(
          `[data-key="${position}"]`
        );

      if (cell) {
        cell.classList.remove("wrong");
      }
    });

    selectedPositions = [];
    checkingAnswer = false;

    updateSelectionCounter();
  }, 700);
}

/* ---------------- TELJES FELADAT MEGOLDÁSA ---------------- */

function handleCompletedTask() {
  checkingAnswer = true;

  stopTaskAudio();
  playOkSound();

  correctCount++;

  confirmedPositions.forEach(position => {
    const cell =
      document.querySelector(
        `[data-key="${position}"]`
      );

    if (!cell) {
      return;
    }

    cell.classList.remove(
      "selected",
      "sorter-confirmed"
    );

    cell.classList.add("correct");
  });

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

/* ---------------- FELADATHANG ---------------- */

function prepareTaskAudio() {
  stopTaskAudio();

  if (!currentTask || !currentTask.soundFile) {
    taskAudio = null;
  }
}

function unlockAndSpeakTask() {
  if (!currentTask || !currentTask.soundFile) {
    document.getElementById("message").innerText =
      "⚠️ Ehhez a feladathoz még nincs hangfájl.";
    return;
  }

  speechUnlocked = true;

  stopTaskAudio();

  taskAudio = new Audio(
    `sounds/speech/sorter/${currentTask.soundFile}`
  );

  taskAudio.volume = 1;
  taskAudio.preload = "auto";

  taskAudio.addEventListener(
    "error",
    () => {
      document.getElementById("message").innerText =
        "⚠️ A feladat hangja nem tölthető be.";
    },
    { once: true }
  );

  taskAudio.play()
    .then(() => {
      document.getElementById("message").innerText = "";
    })
    .catch(error => {
      console.error("Feladathang-hiba:", error);

      document.getElementById("message").innerText =
        `⚠️ A hang nem indult el: ${error.name}`;
    });
}

function playTaskAudio() {
  if (!currentTask || !currentTask.soundFile) {
    return;
  }

  stopTaskAudio();

  taskAudio = new Audio(
    `sounds/speech/sorter/${currentTask.soundFile}`
  );

  taskAudio.volume = 1;

  taskAudio.play().catch(error => {
    console.warn(
      "Az automatikus lejátszást a böngésző blokkolta:",
      error
    );
  });
}

function stopTaskAudio() {
  if (!taskAudio) {
    return;
  }

  taskAudio.pause();
  taskAudio.removeAttribute("src");
  taskAudio.load();
  taskAudio = null;
}

function unlockAndSpeakTask() {
  if (!currentTask) {
    return;
  }

  speechUnlocked = true;
  playTaskAudio();
}

function playTaskAudio() {
  if (!taskAudio) {
    document.getElementById("message").innerText =
      "⚠️ Ehhez a feladathoz még nincs hangfájl.";
    return;
  }

  taskAudio.pause();
  taskAudio.currentTime = 0;

  taskAudio.play().catch(() => {
    document.getElementById("message").innerText =
      "Nyomd meg újra a hangszórót!";
  });
}

function stopTaskAudio() {
  if (!taskAudio) {
    return;
  }

  taskAudio.pause();
  taskAudio.currentTime = 0;
}

/* ---------------- JELÖLÉSEK TÖRLÉSE ---------------- */

function clearBoardMarks() {
  document.querySelectorAll(".cell").forEach(cell => {
    cell.classList.remove(
      "selected",
      "correct",
      "wrong",
      "sorter-confirmed"
    );
  });
}

/* ---------------- OLDAL ELHAGYÁSA ---------------- */

window.addEventListener("beforeunload", () => {
  stopTaskAudio();
});

/* ---------------- START ---------------- */

shuffleGrid();
renderBoard();
newTask();
