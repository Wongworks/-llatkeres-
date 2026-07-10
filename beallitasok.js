/* ---------------- ELEMEK ---------------- */

const soundSetting =
  document.getElementById("soundSetting");

const rewardSetting =
  document.getElementById("rewardSetting");

const rewardIntervalSetting =
  document.getElementById("rewardIntervalSetting");

const settingsMessage =
  document.getElementById("settingsMessage");

/* ---------------- BEÁLLÍTÁSOK BETÖLTÉSE ---------------- */

function loadSettings() {
  const soundEnabled =
    localStorage.getItem("soundEnabled") !== "false";

  const rewardEnabled =
    localStorage.getItem("rewardEnabled") !== "false";

  const rewardInterval =
    localStorage.getItem("rewardInterval") || "5";

  soundSetting.checked = soundEnabled;
  rewardSetting.checked = rewardEnabled;
  rewardIntervalSetting.value = rewardInterval;

  updateRewardFrequencyState();
}

/* ---------------- BEÁLLÍTÁSOK MENTÉSE ---------------- */

function saveSettings() {
  localStorage.setItem(
    "soundEnabled",
    soundSetting.checked
  );

  localStorage.setItem(
    "rewardEnabled",
    rewardSetting.checked
  );

  localStorage.setItem(
    "rewardInterval",
    rewardIntervalSetting.value
  );

  updateRewardFrequencyState();
  showSavedMessage();
}

/* ---------------- JUTALOM GYAKORISÁG ÁLLAPOTA ---------------- */

function updateRewardFrequencyState() {
  rewardIntervalSetting.disabled =
    !rewardSetting.checked;

  const row =
    document.querySelector(".reward-frequency-row");

  if (rewardSetting.checked) {
    row.classList.remove("setting-disabled");
  } else {
    row.classList.add("setting-disabled");
  }
}

/* ---------------- MENTÉSI ÜZENET ---------------- */

function showSavedMessage() {
  settingsMessage.innerText =
    "✅ A beállításokat elmentettük.";

  clearTimeout(showSavedMessage.timeout);

  showSavedMessage.timeout = setTimeout(() => {
    settingsMessage.innerText = "";
  }, 1500);
}

/* ---------------- ESEMÉNYEK ---------------- */

soundSetting.addEventListener(
  "change",
  saveSettings
);

rewardSetting.addEventListener(
  "change",
  saveSettings
);

rewardIntervalSetting.addEventListener(
  "change",
  saveSettings
);

/* ---------------- START ---------------- */

loadSettings();