let mode = "findAnimal";
const gameMode = localStorage.getItem("animalGameMode") || "mano";

let target = "";
let correctCount = 0;

/* ---------------- RENDER BOARD ---------------- */

function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  board.appendChild(document.createElement("div"));

  for (let c of cols) {
    const header = document.createElement("div");
    header.className = "header";
    header.innerText = c;
    board.appendChild(header);
  }

  for (let r of rows) {
    const rowHeader = document.createElement("div");
    rowHeader.className = "header";
    rowHeader.innerText = r;
    board.appendChild(rowHeader);

    for (let c of cols) {
      const key = c + r;

      const cell = document.createElement("div");
      cell.className = "cell";

      const img = document.createElement("img");
      img.src = "images/animals_fixed/" + grid[key] + ".svg";
      img.className = "animal";
      img.alt = grid[key];

      cell.appendChild(img);
      cell.onclick = () => check(cell, key);

      board.appendChild(cell);
    }
  }
}

/* ---------------- CHECK ---------------- */

function check(cell, key) {
  if (key === target) {
    playOkSound();
    correctCount++;

    cell.classList.add("correct");

    if (shouldShowReward()) {
  showRewardCard();
  return;
}
    document.getElementById("message").innerText = "🎉 Helyes!";

    setTimeout(() => {
      document.querySelectorAll(".cell").forEach(c => {
        c.classList.remove("correct", "wrong");
      });

      newTask();
    }, 500);

  } else {
    playBadSound();

    cell.classList.add("wrong");

    const randomWrong =
      wrongMessages[Math.floor(Math.random() * wrongMessages.length)];

    document.getElementById("message").innerText = randomWrong;

    setTimeout(() => {
      cell.classList.remove("wrong");
    }, 300);
  }
}

/* ---------------- NEW BOARD ---------------- */

function newBoard() {
  correctCount = 0;
  shuffleGrid();
  renderBoard();
  newTask();
  document.getElementById("message").innerText = "";
}

/* ---------------- NEW TASK ---------------- */

function newTask() {
  const keys = Object.keys(grid);
  target = keys[Math.floor(Math.random() * keys.length)];

  const animalId = grid[target];
  const animalName = animalNames[animalId];

  if (gameMode === "mano") {
    document.getElementById("task").innerHTML = `
      <div class="task-card">
        <img class="task-animal" src="images/animals_fixed/${animalId}.svg" alt="${animalName}">
      </div>
    `;
  } else {
    document.getElementById("task").innerHTML = `
      <div class="task-card">
        <div class="task-name">${animalName}</div>
      </div>
    `;
  }

  document.getElementById("message").innerText = "";

  document.querySelectorAll(".cell").forEach(c => {
    c.classList.remove("correct", "wrong");
  });
}

/* ---------------- START ---------------- */

shuffleGrid();
renderBoard();
newTask();