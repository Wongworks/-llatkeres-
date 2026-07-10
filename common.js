const animalNames = {
  lo: "ló",
  kutya: "kutya",
  oroszlan: "oroszlán",
  beka: "béka",
  teve: "teve",
  szarvas: "szarvas",
  csiga: "csiga",

  eger: "egér",
  tehen: "tehén",
  balna: "bálna",
  zsiraf: "zsiráf",
  elefant: "elefánt",
  rak: "rák",
  gyik: "gyík",

  roka: "róka",
  delfin: "delfin",
  kecske: "kecske",
  kakas: "kakas",
  mokus: "mókus",
  majom: "majom",
  pava: "páva",

  barany: "bárány",
  macska: "macska",
  krokodil: "krokodil",
  nyul: "nyúl",
  hal: "hal",
  pingvin: "pingvin",
  foka: "fóka",

  kigyo: "kígyó",
  teknos: "teknős",
  vizilo: "víziló",
  polip: "polip",
  kacsa: "kacsa",
  zebra: "zebra",
  flamingo: "flamingó"
};
const originalGrid = {
  A1:"lo", A2:"kutya", A3:"oroszlan", A4:"beka", A5:"teve", A6:"szarvas", A7:"csiga",
  B1:"eger", B2:"tehen", B3:"balna", B4:"zsiraf", B5:"elefant", B6:"rak", B7:"gyik",
  C1:"roka", C2:"delfin", C3:"kecske", C4:"kakas", C5:"mokus", C6:"majom", C7:"pava",
  D1:"barany", D2:"macska", D3:"krokodil", D4:"nyul", D5:"hal", D6:"pingvin", D7:"foka",
  E1:"kigyo", E2:"teknos", E3:"vizilo", E4:"polip", E5:"kacsa", E6:"zebra", E7:"flamingo"
};

let grid = {};

function shuffleGrid() {
  const positions = Object.keys(originalGrid);
  const animals = Object.values(originalGrid);

  for (let i = animals.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [animals[i], animals[j]] = [animals[j], animals[i]];
  }

  positions.forEach((position, index) => {
    grid[position] = animals[index];
  });
}
const wrongMessages = [
  "😊 Próbáld meg még egyszer!",
  "🔍 Nézd meg alaposabban!",
  "💪 Menni fog!",
  "👀 Figyeld meg jól!",
  "🙂 Majdnem, próbáld újra!",
  "🌟 Ügyes vagy, keresd tovább!",
  "🐾 Nézd meg még egyszer!"
];

const correctSound = new Audio("sounds/answers/correct.wav");
const wrongSound = new Audio("sounds/answers/wrong.wav");

correctSound.preload = "auto";
wrongSound.preload = "auto";

correctSound.volume = 0.35;
wrongSound.volume = 0.20;

function soundsAreEnabled() {
  return localStorage.getItem("soundEnabled") !== "false";
}

function playOkSound() {
  if (!soundsAreEnabled()) return;

  correctSound.currentTime = 0;
  correctSound.play().catch(() => {});
}

function playBadSound() {
  if (!soundsAreEnabled()) return;

  wrongSound.currentTime = 0;
  wrongSound.play().catch(() => {});
}

function showRewardCard() {
  const balloonCount = correctCount / 5;
  const balloons = "🎈".repeat(balloonCount);

  let icons = "👏 😊 🎉";

  if (correctCount === 10) icons = "🥳 👏";
  if (correctCount === 15) icons = "🤩 🎉";
  if (correctCount === 20) icons = "🏆 😊";
  if (correctCount === 25) icons = "🎊 🥳";
  if (correctCount === 30) icons = "👑 🎉";

  document.getElementById("task").innerHTML = `
    <div class="reward-card">
      <div class="reward-balloons">${balloons}</div>
      <div class="reward-paw">🐾</div>
      <div class="reward-number">${correctCount}</div>
      <div class="reward-icons">${icons}</div>
      <button class="continue-btn" onclick="continueAfterReward()">👉</button>
    </div>
  `;

  document.getElementById("message").innerText = "";
}

function continueAfterReward() {
  if (correctCount >= 30) {
    correctCount = 0;
  }

  newTask();
}

function rewardsAreEnabled() {
  return localStorage.getItem("rewardEnabled") !== "false";
}

function getRewardInterval() {
  const savedInterval =
    Number(localStorage.getItem("rewardInterval"));

  if (savedInterval === 10) {
    return 10;
  }

  return 5;
}

function shouldShowReward() {
  if (!rewardsAreEnabled()) {
    return false;
  }

  const rewardInterval = getRewardInterval();

  return correctCount % rewardInterval === 0;
}