/* ---------------- JÁTÉKMÓD ---------------- */

const arrowGameMode =
  localStorage.getItem("arrowGameMode") || "egyenes";

/* ---------------- IRÁNYOK ---------------- */

const straightDirections = [
  {
    symbol: "↑",
    colChange: 0,
    rowChange: -1
  },
  {
    symbol: "↓",
    colChange: 0,
    rowChange: 1
  },
  {
    symbol: "←",
    colChange: -1,
    rowChange: 0
  },
  {
    symbol: "→",
    colChange: 1,
    rowChange: 0
  }
];

const diagonalDirections = [
  {
    symbol: "↖",
    colChange: -1,
    rowChange: -1
  },
  {
    symbol: "↗",
    colChange: 1,
    rowChange: -1
  },
  {
    symbol: "↙",
    colChange: -1,
    rowChange: 1
  },
  {
    symbol: "↘",
    colChange: 1,
    rowChange: 1
  }
];

/* ---------------- ÁLLAPOT ---------------- */

let startPosition = "";
let targetPosition = "";
let lastStartPosition = "";

let currentArrows = [];

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
  lastStartPosition = "";
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

  const taskData = createArrowTask();

  startPosition = taskData.start;
  targetPosition = taskData.target;
  currentArrows = taskData.arrows;

  lastStartPosition = startPosition;

  showTask();
  markStartPosition();

  document.getElementById("message").innerText = "";
}

/* ---------------- FELADAT LÉTREHOZÁSA ---------------- */

function createArrowTask() {
  const keys = Object.keys(grid);

  let taskData;
  let attempts = 0;

  do {
    const start =
      keys[Math.floor(Math.random() * keys.length)];

    taskData = generateValidPath(start);
    attempts++;
  } while (
    attempts < 100 &&
    (
      taskData.start === lastStartPosition ||
      taskData.start === taskData.target ||
      getDistance(taskData.start, taskData.target) < 2
    )
  );

  return taskData;
}

/* ---------------- ÚTVONAL GENERÁLÁSA ---------------- */

function generateValidPath(start) {
  const stepCount =
    Math.floor(Math.random() * 3) + 6;

  let currentPosition = start;
  let previousDirection = null;

  const arrows = [];
  const visitedPositions = [start];

  for (let step = 0; step < stepCount; step++) {
    let possibleDirections =
      getPossibleDirections(currentPosition);

    // Ne lépjen rögtön vissza az előző mezőre
    if (previousDirection) {
      const nonReverseDirections =
        possibleDirections.filter(direction => {
          return !isOppositeDirection(
            direction,
            previousDirection
          );
        });

      if (nonReverseDirections.length > 0) {
        possibleDirections = nonReverseDirections;
      }
    }

    // Lehetőleg ne lépjen már érintett mezőre
    const unvisitedDirections =
      possibleDirections.filter(direction => {
        const nextPosition =
          calculateNextPosition(
            currentPosition,
            direction
          );

        return !visitedPositions.includes(nextPosition);
      });

    if (unvisitedDirections.length > 0) {
      possibleDirections = unvisitedDirections;
    }

    // Részesítse előnyben a kezdőponttól távolabb vezető lépéseket
    const fartherDirections =
      possibleDirections.filter(direction => {
        const nextPosition =
          calculateNextPosition(
            currentPosition,
            direction
          );

        return (
          getDistance(start, nextPosition) >=
          getDistance(start, currentPosition)
        );
      });

    if (
      fartherDirections.length > 0 &&
      Math.random() < 0.75
    ) {
      possibleDirections = fartherDirections;
    }

    const selectedDirection =
      possibleDirections[
        Math.floor(Math.random() * possibleDirections.length)
      ];

    arrows.push(selectedDirection.symbol);

    currentPosition = calculateNextPosition(
      currentPosition,
      selectedDirection
    );

    visitedPositions.push(currentPosition);
    previousDirection = selectedDirection;
  }

  return {
    start: start,
    target: currentPosition,
    arrows: arrows
  };
}

/* ---------------- ELLENTÉTES IRÁNY ---------------- */

function isOppositeDirection(direction, previousDirection) {
  return (
    direction.colChange ===
      -previousDirection.colChange &&
    direction.rowChange ===
      -previousDirection.rowChange
  );
}

/* ---------------- TÁVOLSÁG ---------------- */

function getDistance(firstPosition, secondPosition) {
  const firstColIndex =
    cols.indexOf(firstPosition.charAt(0));

  const firstRowIndex =
    rows.indexOf(Number(firstPosition.slice(1)));

  const secondColIndex =
    cols.indexOf(secondPosition.charAt(0));

  const secondRowIndex =
    rows.indexOf(Number(secondPosition.slice(1)));

  return Math.max(
    Math.abs(firstColIndex - secondColIndex),
    Math.abs(firstRowIndex - secondRowIndex)
  );
}

/* ---------------- LEHETSÉGES IRÁNYOK ---------------- */

function getPossibleDirections(position) {
  let directions = [...straightDirections];

  if (arrowGameMode === "kalandos") {
    directions = [
      ...straightDirections,
      ...diagonalDirections
    ];
  }

  return directions.filter(direction => {
    const nextPosition =
      calculateNextPosition(position, direction);

    return nextPosition !== null;
  });
}

/* ---------------- KÖVETKEZŐ POZÍCIÓ ---------------- */

function calculateNextPosition(position, direction) {
  const currentCol = position.charAt(0);
  const currentRow = Number(position.slice(1));

  const currentColIndex = cols.indexOf(currentCol);
  const currentRowIndex = rows.indexOf(currentRow);

  const nextColIndex =
    currentColIndex + direction.colChange;

  const nextRowIndex =
    currentRowIndex + direction.rowChange;

  const isInsideBoard =
    nextColIndex >= 0 &&
    nextColIndex < cols.length &&
    nextRowIndex >= 0 &&
    nextRowIndex < rows.length;

  if (!isInsideBoard) {
    return null;
  }

  return cols[nextColIndex] + rows[nextRowIndex];
}

/* ---------------- FELADAT MEGJELENÍTÉSE ---------------- */

function showTask() {
  const animalId = grid[startPosition];
  const animalName = animalNames[animalId];

  const arrowsHtml = currentArrows
    .map(arrow => {
      return `<span class="arrow-symbol">${arrow}</span>`;
    })
    .join("");

  document.getElementById("task").innerHTML = `
    <div class="task-card arrow-task-card">
      <div class="arrow-task-row">

        <img
          class="task-animal arrow-start-animal"
          src="images/animals_fixed/${animalId}.svg"
          alt="${animalName}"
        >

        <div class="arrow-sequence">
          ${arrowsHtml}
        </div>

        <span class="arrow-question">?</span>

      </div>
    </div>
  `;
}

/* ---------------- KEZDŐMEZŐ JELÖLÉSE ---------------- */

function markStartPosition() {
  const startCell =
    document.querySelector(
      `[data-key="${startPosition}"]`
    );

  if (startCell) {
    startCell.classList.add("start-position");
  }
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

/* ---------------- TÁBLA JELÖLÉSEINEK TÖRLÉSE ---------------- */

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

/* ---------------- START ---------------- */

shuffleGrid();
renderBoard();
newTask();