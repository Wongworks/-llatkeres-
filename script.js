let mode = "findAnimal";

/* ---------------- GRID ---------------- */

const grid = {
  A1:"🐴", A2:"🐶", A3:"🦁", A4:"🐸", A5:"🐪", A6:"🦌", A7:"🐌",
  B1:"🐭", B2:"🐮", B3:"🐋", B4:"🦒", B5:"🐘", B6:"🦀", B7:"🦎",
  C1:"🦊", C2:"🐬", C3:"🐐", C4:"🐓", C5:"🐿️", C6:"🐵", C7:"🦚",
  D1:"🐑", D2:"🐱", D3:"🐊", D4:"🐰", D5:"🐟", D6:"🐧", D7:"🦭",
  E1:"🐍", E2:"🐢", E3:"🦛", E4:"🐙", E5:"🐆", E6:"🐓", E7:"🦩"
};

/* ---------------- SOUND ---------------- */

function playOkSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(660, ctx.currentTime);

  gain.gain.setValueAtTime(0.15, ctx.currentTime);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();

  setTimeout(() => {
    osc.stop();
    ctx.close();
  }, 120);
}

function playBadSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(180, ctx.currentTime);

  gain.gain.setValueAtTime(0.2, ctx.currentTime);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();

  setTimeout(() => {
    osc.stop();
    ctx.close();
  }, 180);
}

/* ---------------- GRID CONFIG ---------------- */

const cols = ["A","B","C","D","E"];
const rows = [1,2,3,4,5,6,7];

let target = "";

/* ---------------- RENDER BOARD ---------------- */

function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  // bal felső üres
  board.appendChild(document.createElement("div"));

  // oszlop fejlécek
  for (let c of cols) {
    const header = document.createElement("div");
    header.className = "header";
    header.innerText = c;
    board.appendChild(header);
  }

  for (let r of rows) {

    // sor fejlécek
    const rowHeader = document.createElement("div");
    rowHeader.className = "header";
    rowHeader.innerText = r;
    board.appendChild(rowHeader);

    for (let c of cols) {

      const key = c + r;

      const cell = document.createElement("div");
      cell.className = "cell";

      cell.innerText = grid[key];

      cell.onclick = () => check(cell, key);

      board.appendChild(cell);
    }
  }
}

/* ---------------- NEW TASK ---------------- */

function newTask() {

  const keys = Object.keys(grid);
  target = keys[Math.floor(Math.random() * keys.length)];

  document.getElementById("task").innerText =
    "Keresd meg: " + grid[target];

  document.getElementById("message").innerText = "";

  document.querySelectorAll(".cell").forEach(c => {
    c.classList.remove("correct", "wrong");
  });
}

/* ---------------- CHECK ---------------- */

function check(cell, key) {

  console.log("KEY:", key, "TARGET:", target);

  if (key === target) {

    playOkSound();

    cell.classList.add("correct");

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

    document.getElementById("message").innerText = "❌ Próbáld újra!";

    setTimeout(() => {
      cell.classList.remove("wrong");
    }, 300);
  }
}

/* ---------------- START ---------------- */

renderBoard();
newTask();