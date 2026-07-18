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

const cols = ["A", "B", "C", "D", "E"];
const rows = [1, 2, 3, 4, 5, 6, 7];

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
/* ---------------- ÁLLATKATEGÓRIÁK ---------------- */

const animalCategories = {
  lo: [
    "haziallat",
    "bundas",
    "negylabu",
    "emlos",
    "gerinces"
  ],

  kutya: [
    "haziallat",
    "bundas",
    "negylabu",
    "emlos",
    "gerinces"
  ],

  oroszlan: [
    "bundas",
    "negylabu",
    "vadallat",
    "emlos",
    "gerinces"
  ],

  beka: [
    "negylabu",
    "vizhezKotott",
    "tojastRak",
    "keteltu",
    "gerinces"
  ],

  teve: [
    "bundas",
    "negylabu",
    "vadallat",
    "emlos",
    "gerinces"
  ],

  szarvas: [
    "bundas",
    "negylabu",
    "vadallat",
    "emlos",
    "gerinces",
    "szarvaVan"
  ],

  csiga: [
    "labNelkuli",
    "tojastRak",
    "gerinctelen"
  ],

  eger: [
    "bundas",
    "negylabu",
    "vadallat",
    "emlos",
    "gerinces"
  ],

  tehen: [
    "haziallat",
    "bundas",
    "negylabu",
    "emlos",
    "gerinces",
    "szarvaVan"
  ],

  balna: [
    "vizbenEl",
    "labNelkuli",
    "vadallat",
    "emlos",
    "gerinces",
    "viziEmlos"
  ],

  zsiraf: [
    "bundas",
    "negylabu",
    "vadallat",
    "emlos",
    "gerinces",
    "szarvaVan"
  ],

  elefant: [
    "negylabu",
    "vadallat",
    "emlos",
    "gerinces"
  ],

  rak: [
    "vizhezKotott",
    "tojastRak",
    "gerinctelen"
  ],

  gyik: [
    "negylabu",
    "tojastRak",
    "vadallat",
    "hullo",
    "gerinces"
  ],

  roka: [
    "bundas",
    "negylabu",
    "vadallat",
    "emlos",
    "gerinces"
  ],

  delfin: [
    "vizbenEl",
    "labNelkuli",
    "vadallat",
    "emlos",
    "gerinces",
    "viziEmlos"
  ],

  kecske: [
    "haziallat",
    "bundas",
    "negylabu",
    "emlos",
    "gerinces",
    "szarvaVan"
  ],

  kakas: [
    "haziallat",
    "madar",
    "tollas",
    "ketlabu",
    "tojastRak",
    "gerinces"
  ],

  mokus: [
    "bundas",
    "negylabu",
    "vadallat",
    "emlos",
    "gerinces"
  ],

  majom: [
    "bundas",
    "negylabu",
    "vadallat",
    "emlos",
    "gerinces"
  ],

  pava: [
    "madar",
    "tollas",
    "ketlabu",
    "tojastRak",
    "vadallat",
    "gerinces",
    "repul"
  ],

  barany: [
    "haziallat",
    "bundas",
    "negylabu",
    "emlos",
    "gerinces"
  ],

  macska: [
    "haziallat",
    "bundas",
    "negylabu",
    "emlos",
    "gerinces"
  ],

  krokodil: [
    "negylabu",
    "vizhezKotott",
    "tojastRak",
    "vadallat",
    "hullo",
    "gerinces"
  ],

  nyul: [
    "bundas",
    "negylabu",
    "vadallat",
    "emlos",
    "gerinces"
  ],

  hal: [
    "vizbenEl",
    "labNelkuli",
    "tojastRak",
    "gerinces"
  ],

  pingvin: [
    "madar",
    "tollas",
    "ketlabu",
    "vizhezKotott",
    "tojastRak",
    "vadallat",
    "gerinces"
  ],

  foka: [
    "bundas",
    "vizhezKotott",
    "vadallat",
    "emlos",
    "gerinces",
    "viziEmlos"
  ],

  kigyo: [
    "labNelkuli",
    "tojastRak",
    "vadallat",
    "hullo",
    "gerinces"
  ],

  teknos: [
    "negylabu",
    "vizhezKotott",
    "tojastRak",
    "vadallat",
    "hullo",
    "gerinces"
  ],

  vizilo: [
    "negylabu",
    "vizhezKotott",
    "vadallat",
    "emlos",
    "gerinces"
  ],

  polip: [
    "vizbenEl",
    "labNelkuli",
    "tojastRak",
    "vadallat",
    "gerinctelen"
  ],

  kacsa: [
    "haziallat",
    "madar",
    "tollas",
    "ketlabu",
    "vizhezKotott",
    "tojastRak",
    "gerinces",
    "repul"
  ],

  zebra: [
    "bundas",
    "negylabu",
    "vadallat",
    "emlos",
    "gerinces",
    "csikos"
  ],

  flamingo: [
    "madar",
    "tollas",
    "ketlabu",
    "vizhezKotott",
    "tojastRak",
    "vadallat",
    "gerinces",
    "repul"
  ]
};

/* ---------------- KATEGÓRIÁK ADATAI ---------------- */

const categoryDefinitions = {
  haziallat: {
    name: "háziállat"
  },

  bundas: {
    name: "bundás állat"
  },

  tollas: {
    name: "tollas állat"
  },

  negylabu: {
    name: "négylábú állat"
  },

  ketlabu: {
    name: "kétlábú állat"
  },

  labNelkuli: {
    name: "láb nélküli állat"
  },

  vizbenEl: {
    name: "vízben élő állat"
  },

  vizhezKotott: {
    name: "vízhez kötötten élő állat"
  },

  madar: {
    name: "madár"
  },

  tojastRak: {
    name: "tojást rakó állat"
  },

  vadallat: {
    name: "vadállat"
  },

  repul: {
    name: "repülni tudó állat"
  },

  csikos: {
    name: "csíkos állat"
  },

  szarvaVan: {
    name: "szarvval vagy aganccsal rendelkező állat"
  },

  emlos: {
    name: "emlős"
  },

  hullo: {
    name: "hüllő"
  },

  keteltu: {
    name: "kétéltű"
  },

  gerinces: {
    name: "gerinces állat"
  },

  gerinctelen: {
    name: "gerinctelen állat"
  },

  viziEmlos: {
    name: "vízi emlős"
  }
};

/* ---------------- ÁLLATVÁLOGATÓ FELADATOK ---------------- */

const categoryTasks = [
  /* ---------------- KÖNNYŰ VÁLOGATÁS ---------------- */

  {
    mode: "konnyu",
    category: "haziallat",
    count: 3,
    displayText: "Keress 3 háziállatot!",
    speechText: "Keress három háziállatot!",
    soundFile: "haziallat-3.mp3"
  },

  {
    mode: "konnyu",
    category: "haziallat",
    count: 5,
    displayText: "Jelölj meg 5 háziállatot!",
    speechText: "Jelölj meg öt háziállatot!",
    soundFile: "haziallat-5.mp3"
  },

  {
    mode: "konnyu",
    category: "bundas",
    count: 4,
    displayText: "Válassz ki 4 bundás állatot!",
    speechText: "Válassz ki négy bundás állatot!",
    soundFile: "bundas-4.mp3"
  },

  {
    mode: "konnyu",
    category: "bundas",
    count: 6,
    displayText: "Találj 6 olyan állatot, amelynek bundája van!",
    speechText: "Találj hat olyan állatot, amelynek bundája van!",
    soundFile: "bundas-6.mp3"
  },

  {
    mode: "konnyu",
    category: "tollas",
    count: 3,
    displayText: "Keress 3 tollas állatot!",
    speechText: "Keress három tollas állatot!",
    soundFile: "tollas-3.mp3"
  },

  {
    mode: "konnyu",
    category: "tollas",
    count: 4,
    displayText: "Jelölj meg 4 olyan állatot, amelynek tolla van!",
    speechText: "Jelölj meg négy olyan állatot, amelynek tolla van!",
    soundFile: "tollas-4.mp3"
  },

  {
    mode: "konnyu",
    category: "negylabu",
    count: 4,
    displayText: "Keress 4 négylábú állatot!",
    speechText: "Keress négy négylábú állatot!",
    soundFile: "negylabu-4.mp3"
  },

  {
    mode: "konnyu",
    category: "negylabu",
    count: 6,
    displayText: "Válassz ki 6 állatot, amelynek négy lába van!",
    speechText: "Válassz ki hat állatot, amelynek négy lába van!",
    soundFile: "negylabu-6.mp3"
  },

  {
    mode: "konnyu",
    category: "ketlabu",
    count: 3,
    displayText: "Találj 3 kétlábú állatot!",
    speechText: "Találj három kétlábú állatot!",
    soundFile: "ketlabu-3.mp3"
  },

  {
    mode: "konnyu",
    category: "ketlabu",
    count: 4,
    displayText: "Keress 4 állatot, amelynek két lába van!",
    speechText: "Keress négy állatot, amelynek két lába van!",
    soundFile: "ketlabu-4.mp3"
  },

  {
    mode: "konnyu",
    category: "labNelkuli",
    count: 3,
    displayText: "Keress 3 láb nélküli állatot!",
    speechText: "Keress három láb nélküli állatot!",
    soundFile: "labnelkuli-3.mp3"
  },

  {
    mode: "konnyu",
    category: "labNelkuli",
    count: 4,
    displayText: "Jelölj meg 4 állatot, amelynek nincs lába!",
    speechText: "Jelölj meg négy állatot, amelynek nincs lába!",
    soundFile: "labnelkuli-4.mp3"
  },

  {
    mode: "konnyu",
    category: "vizbenEl",
    count: 3,
    displayText: "Találj 3 vízben élő állatot!",
    speechText: "Találj három vízben élő állatot!",
    soundFile: "vizbenel-3.mp3"
  },

  {
    mode: "konnyu",
    category: "vizbenEl",
    count: 4,
    displayText: "Keress 4 olyan állatot, amely a vízben él!",
    speechText: "Keress négy olyan állatot, amely a vízben él!",
    soundFile: "vizbenel-4.mp3"
  },

  {
    mode: "konnyu",
    category: "vizhezKotott",
    count: 4,
    displayText: "Jelölj meg 4 vízhez kötötten élő állatot!",
    speechText: "Jelölj meg négy vízhez kötötten élő állatot!",
    soundFile: "vizhezkotott-4.mp3"
  },

  {
    mode: "konnyu",
    category: "vizhezKotott",
    count: 5,
    displayText: "Keress 5 állatot, amely sok időt tölt a víz közelében!",
    speechText: "Keress öt állatot, amely sok időt tölt a víz közelében!",
    soundFile: "vizhezkotott-5.mp3"
  },

  {
    mode: "konnyu",
    category: "tojastRak",
    count: 4,
    displayText: "Keress 4 tojást rakó állatot!",
    speechText: "Keress négy tojást rakó állatot!",
    soundFile: "tojastrak-4.mp3"
  },

  {
    mode: "konnyu",
    category: "tojastRak",
    count: 6,
    displayText: "Találj 6 olyan állatot, amely tojást rak!",
    speechText: "Találj hat olyan állatot, amely tojást rak!",
    soundFile: "tojastrak-6.mp3"
  },

  {
    mode: "konnyu",
    category: "vadallat",
    count: 4,
    displayText: "Jelölj meg 4 vadállatot!",
    speechText: "Jelölj meg négy vadállatot!",
    soundFile: "vadallat-4.mp3"
  },

  {
    mode: "konnyu",
    category: "vadallat",
    count: 6,
    displayText: "Válassz ki 6 vadon élő állatot!",
    speechText: "Válassz ki hat vadon élő állatot!",
    soundFile: "vadallat-6.mp3"
  },

  {
    mode: "konnyu",
    category: "repul",
    count: 2,
    displayText: "Keress 2 olyan állatot, amely tud repülni!",
    speechText: "Keress két olyan állatot, amely tud repülni!",
    soundFile: "repul-2.mp3"
  },

  {
    mode: "konnyu",
    category: "szarvaVan",
    count: 3,
    displayText: "Keress 3 állatot, amelynek szarva vagy agancsa van!",
    speechText: "Keress három állatot, amelynek szarva vagy agancsa van!",
    soundFile: "szarv-3.mp3"
  },

  {
    mode: "konnyu",
    category: "csikos",
    count: 1,
    displayText: "Keresd meg a csíkos állatot!",
    speechText: "Keresd meg a csíkos állatot!",
    soundFile: "csikos-1.mp3"
  },

  /* ---------------- ÁLLATSZAKÉRTŐ ---------------- */

  {
    mode: "szakerto",
    category: "emlos",
    count: 4,
    displayText: "Keress 4 emlős állatot!",
    speechText: "Keress négy emlős állatot!",
    soundFile: "emlos-4.mp3"
  },

  {
    mode: "szakerto",
    category: "emlos",
    count: 6,
    displayText: "Jelölj meg 6 emlősállatot!",
    speechText: "Jelölj meg hat emlősállatot!",
    soundFile: "emlos-6.mp3"
  },

  {
    mode: "szakerto",
    category: "madar",
    count: 3,
    displayText: "Válassz ki 3 madarat!",
    speechText: "Válassz ki három madarat!",
    soundFile: "madar-3.mp3"
  },

  {
    mode: "szakerto",
    category: "madar",
    count: 5,
    displayText: "Keresd meg mind az 5 madarat!",
    speechText: "Keresd meg mind az öt madarat!",
    soundFile: "madar-5.mp3"
  },

  {
    mode: "szakerto",
    category: "hullo",
    count: 2,
    displayText: "Keress 2 hüllőt!",
    speechText: "Keress két hüllőt!",
    soundFile: "hullo-2.mp3"
  },

  {
    mode: "szakerto",
    category: "hullo",
    count: 4,
    displayText: "Keresd meg mind a 4 hüllőt!",
    speechText: "Keresd meg mind a négy hüllőt!",
    soundFile: "hullo-4.mp3"
  },

  {
    mode: "szakerto",
    category: "keteltu",
    count: 1,
    displayText: "Keresd meg a kétéltű állatot!",
    speechText: "Keresd meg a kétéltű állatot!",
    soundFile: "keteltu-1.mp3"
  },

  {
    mode: "szakerto",
    category: "gerinces",
    count: 5,
    displayText: "Keress 5 gerinces állatot!",
    speechText: "Keress öt gerinces állatot!",
    soundFile: "gerinces-5.mp3"
  },

  {
    mode: "szakerto",
    category: "gerinces",
    count: 7,
    displayText: "Jelölj meg 7 gerinces állatot!",
    speechText: "Jelölj meg hét gerinces állatot!",
    soundFile: "gerinces-7.mp3"
  },

  {
    mode: "szakerto",
    category: "gerinctelen",
    count: 2,
    displayText: "Keress 2 gerinctelen állatot!",
    speechText: "Keress két gerinctelen állatot!",
    soundFile: "gerinctelen-2.mp3"
  },

  {
    mode: "szakerto",
    category: "gerinctelen",
    count: 3,
    displayText: "Keresd meg mind a 3 gerinctelen állatot!",
    speechText: "Keresd meg mind a három gerinctelen állatot!",
    soundFile: "gerinctelen-3.mp3"
  },

  {
    mode: "szakerto",
    category: "viziEmlos",
    count: 2,
    displayText: "Keress 2 vízi emlőst!",
    speechText: "Keress két vízi emlőst!",
    soundFile: "viziemlos-2.mp3"
  },

  {
    mode: "szakerto",
    category: "viziEmlos",
    count: 3,
    displayText: "Keresd meg mind a 3 vízhez kötődő emlőst!",
    speechText: "Keresd meg mind a három vízhez kötődő emlőst!",
    soundFile: "viziemlos-3.mp3"
  },

  {
    mode: "szakerto",
    category: "tojastRak",
    count: 5,
    displayText: "Keress 5 tojást rakó állatot!",
    speechText: "Keress öt tojást rakó állatot!",
    soundFile: "tojastrak-5.mp3"
  },

  {
    mode: "szakerto",
    category: "vizbenEl",
    count: 4,
    displayText: "Válassz ki 4 vízben élő állatot!",
    speechText: "Válassz ki négy vízben élő állatot!",
    soundFile: "vizbenel-4.mp3"
  }
];

/* ---------------- KATEGÓRIA SEGÉDFÜGGVÉNY ---------------- */

function getAnimalsByCategory(categoryId) {
  return Object.keys(animalCategories).filter(animalId => {
    return animalCategories[animalId].includes(categoryId);
  });
}