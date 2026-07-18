/* =========================================================
   ÁLLATOS JÁTÉKOK – KÖZÖS SVG IKONKÉSZLET
   UI 2.0
   ========================================================= */

const gameIcons = {

  /* -------------------- VISSZA -------------------- */

  back: `
    <svg
      class="topbar-icon"
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M28 14L10 32l18 18"
        fill="none"
        stroke="currentColor"
        stroke-width="7"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <path
        d="M12 32h39"
        fill="none"
        stroke="currentColor"
        stroke-width="7"
        stroke-linecap="round"
      />
    </svg>
  `,

  /* -------------------- ÚJ PÁLYA / KEVERÉS -------------------- */

  shuffle: `
    <svg
      class="topbar-icon shuffle-icon"
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M11 18h9c14 0 17 28 31 28"
        fill="none"
        stroke="currentColor"
        stroke-width="5.5"
        stroke-linecap="round"
      />

      <path
        d="M43 38l9 8-9 8"
        fill="none"
        stroke="currentColor"
        stroke-width="5.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <path
        d="M11 46h9c8 0 11-7 16-14"
        fill="none"
        stroke="currentColor"
        stroke-width="5.5"
        stroke-linecap="round"
      />

      <path
        d="M36 27c4-6 8-9 15-9"
        fill="none"
        stroke="currentColor"
        stroke-width="5.5"
        stroke-linecap="round"
      />

      <path
        d="M43 10l9 8-9 8"
        fill="none"
        stroke="currentColor"
        stroke-width="5.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,

  /* -------------------- ÁLLATKERESŐ / NAGYÍTÓ -------------------- */

  search: `
    <svg
      class="game-header-icon"
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="27"
        cy="27"
        r="15"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
      />

      <path
        d="M38 38l15 15"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-linecap="round"
      />
    </svg>
  `,

  /* -------------------- KÓDVADÁSZ / RÁCS -------------------- */

  codeGrid: `
    <svg
      class="game-header-icon"
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="11"
        y="11"
        width="42"
        height="42"
        rx="6"
        fill="none"
        stroke="currentColor"
        stroke-width="4.5"
      />

      <path
        d="M25 12v40M39 12v40M12 25h40M12 39h40"
        fill="none"
        stroke="currentColor"
        stroke-width="3.5"
        stroke-linecap="round"
      />

      <circle
        cx="46"
        cy="18"
        r="4.5"
        fill="currentColor"
      />
    </svg>
  `,

  /* -------------------- KÓDOLVASÓ / KOORDINÁTA -------------------- */

  coordinate: `
    <svg
      class="game-header-icon"
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="10"
        y="10"
        width="36"
        height="36"
        rx="5"
        fill="none"
        stroke="currentColor"
        stroke-width="4.5"
      />

      <path
        d="M22 11v34M34 11v34M11 22h34M11 34h34"
        fill="none"
        stroke="currentColor"
        stroke-width="3.5"
        stroke-linecap="round"
      />

      <path
        d="M49 34c-6 0-10 4-10 10 0 8 10 16 10 16s10-8 10-16c0-6-4-10-10-10z"
        fill="white"
        stroke="currentColor"
        stroke-width="4"
        stroke-linejoin="round"
      />

      <circle
        cx="49"
        cy="44"
        r="3"
        fill="currentColor"
      />
    </svg>
  `,

  /* -------------------- KÖVESD A NYILAKAT -------------------- */

  arrows: `
    <svg
      class="game-header-icon"
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M32 10v44M10 32h44"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-linecap="round"
      />

      <path
        d="M25 17l7-7 7 7M25 47l7 7 7-7"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <path
        d="M17 25l-7 7 7 7M47 25l7 7-7 7"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,

  /* -------------------- IGAZ VAGY HAMIS -------------------- */

  truth: `
    <svg
      class="game-header-icon"
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="19"
        cy="32"
        r="12"
        fill="none"
        stroke="currentColor"
        stroke-width="4.5"
      />

      <path
        d="M13 32l4 4 8-10"
        fill="none"
        stroke="currentColor"
        stroke-width="4.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <circle
        cx="47"
        cy="32"
        r="12"
        fill="none"
        stroke="currentColor"
        stroke-width="4.5"
      />

      <path
        d="M42 27l10 10M52 27L42 37"
        fill="none"
        stroke="currentColor"
        stroke-width="4.5"
        stroke-linecap="round"
      />
    </svg>
  `,

  /* -------------------- ÁLLATHANGOK -------------------- */

sound: `
<svg
    class="game-header-icon"
    viewBox="0 0 64 64"
    aria-hidden="true"
    focusable="false"
>

    <path
        d="M14 26
           H24
           L36 16
           V48
           L24 38
           H14
           Z"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-linejoin="round"
        stroke-linecap="round"
    />

    <path
        d="M44 24
           C48 28 48 36 44 40"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-linecap="round"
    />

    <path
        d="M51 17
           C59 25 59 39 51 47"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-linecap="round"
    />

</svg>
`,

  /* -------------------- ÁLLATVÁLOGATÓ / MEGFIGYELÉS -------------------- */

  sorter: `
    <svg
      class="game-header-icon"
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="27"
        cy="27"
        r="15"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
      />

      <path
        d="M38 38l15 15"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-linecap="round"
      />

      <circle
        cx="21"
        cy="23"
        r="3"
        fill="currentColor"
      />

      <circle
        cx="31"
        cy="23"
        r="3"
        fill="currentColor"
      />

      <circle
        cx="26"
        cy="32"
        r="3"
        fill="currentColor"
      />
    </svg>
  `,

  /* -------------------- BEÁLLÍTÁSOK -------------------- */

  settings: `
    <svg
      class="settings-icon"
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="
          M27 10h10l2 7
          c2 1 4 2 6 4l7-2 5 9-5 5v6l5 5-5 9-7-2
          c-2 2-4 3-6 4l-2 7H27l-2-7
          c-2-1-4-2-6-4l-7 2-5-9 5-5v-6l-5-5 5-9 7 2
          c2-2 4-3 6-4z
        "
        fill="none"
        stroke="currentColor"
        stroke-width="3.8"
        stroke-linejoin="round"
      />

      <circle
        cx="32"
        cy="32"
        r="8"
        fill="none"
        stroke="currentColor"
        stroke-width="4.5"
      />
    </svg>
  `,

  /* -------------------- FELOLVASÁS -------------------- */

    speaker: `
    <svg
        class="action-icon"
        viewBox="0 0 64 64"
        aria-hidden="true"
        focusable="false"
    >
        <path
        d="M14 26h10l12-10v32L24 38H14z"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-linecap="round"
        stroke-linejoin="round"
        />

        <path
        d="M44 24c4 4 4 12 0 16"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-linecap="round"
        />

        <path
        d="M51 17c8 8 8 22 0 30"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-linecap="round"
        />
    </svg>
    `,

  /* -------------------- KÖVETKEZŐ -------------------- */

  next: `
    <svg
      class="action-icon"
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 32h39"
        fill="none"
        stroke="currentColor"
        stroke-width="6"
        stroke-linecap="round"
      />

      <path
        d="M40 20l12 12-12 12"
        fill="none"
        stroke="currentColor"
        stroke-width="6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `
};


/* =========================================================
   IKONOK BEILLESZTÉSE
   ========================================================= */

function renderGameIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach(element => {
    const iconName = element.dataset.icon;
    const iconMarkup = gameIcons[iconName];

    if (!iconMarkup) {
      console.warn(`Ismeretlen ikon: ${iconName}`);
      return;
    }

    element.innerHTML = iconMarkup;
  });
}


/* =========================================================
   AUTOMATIKUS BETÖLTÉS
   ========================================================= */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    renderGameIcons();
  });
} else {
  renderGameIcons();
}