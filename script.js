const filled = {};

const matchups = {
  // === WEST SIDE ===
  VW5: { winnerSlot: "VWQ1", opponent: "VW4" },
  VW4: { winnerSlot: "VWQ1", opponent: "VW5" },
  VWQ1: { winnerSlot: "VWSF1", opponent: "VW1" },
  VW1: { winnerSlot: "VWSF1", opponent: "VWQ1" },

  VW3: { winnerSlot: "VWSF2", opponent: "VW2" },
  VW2: { winnerSlot: "VWSF2", opponent: "VW3" },
  VWSF1: { winnerSlot: "VWFinal", opponent: "VWSF2" },
  VWSF2: { winnerSlot: "VWFinal", opponent: "VWSF1" },

  // === EAST SIDE ===
  VE5: { winnerSlot: "VEQ1", opponent: "VE4" },
  VE4: { winnerSlot: "VEQ1", opponent: "VE5" },
  VEQ1: { winnerSlot: "VESF1", opponent: "VE1" },
  VE1: { winnerSlot: "VESF1", opponent: "VEQ1" },

  VE3: { winnerSlot: "VESF2", opponent: "VE2" },
  VE2: { winnerSlot: "VESF2", opponent: "VE3" },
  VESF1: { winnerSlot: "VEFinal", opponent: "VESF2" },
  VESF2: { winnerSlot: "VEFinal", opponent: "VESF1" },

  // === FINAL ===
  VWFinal: { winnerSlot: "VChampion", opponent: "VEFinal" },
  VEFinal: { winnerSlot: "VChampion", opponent: "VWFinal" }
};

function registerAllClickEvents() {
  Object.keys(matchups).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", () => handleClick(id, el.src));
    }
  });
}

function handleClick(teamId, src) {
  const match = matchups[teamId];
  if (!match) return;

  const winnerSlot = document.getElementById(match.winnerSlot);
  if (filled[match.winnerSlot] && filled[match.winnerSlot] !== teamId) return;

  if (winnerSlot) {
    winnerSlot.src = src;
    filled[match.winnerSlot] = teamId;
    winnerSlot.classList.add("winner-glow", "slam");
    registerClickForSlot(match.winnerSlot, teamId, src);
  }

  if (match.winnerSlot === "VChampion") {
    winnerSlot.classList.add("champion");
    confetti({
      particleCount: 500,
      spread: 160,
      startVelocity: 60,
      origin: { y: 0.6 }
    });
  }
}

function registerClickForSlot(slotId, teamId, src) {
  const el = document.getElementById(slotId);
  if (!el) return;

  el.addEventListener("click", () => {
    const match = matchups[slotId];
    if (!match || (filled[match.winnerSlot] && filled[match.winnerSlot] !== teamId)) return;

    const winnerEl = document.getElementById(match.winnerSlot);
    if (winnerEl) {
      winnerEl.src = src;
      filled[match.winnerSlot] = teamId;
      winnerEl.classList.add("winner-glow", "slam");
      registerClickForSlot(match.winnerSlot, teamId, src);

      if (match.winnerSlot === "VChampion") {
        winnerEl.classList.add("champion");
        confetti({
          particleCount: 500,
          spread: 160,
          startVelocity: 60,
          origin: { y: 0.6 }
        });
      }
    }
  });
}

function resetBracket() {
  document.querySelectorAll(".team").forEach(el => {
    if (!el.id.startsWith("VW") && !el.id.startsWith("VE") && el.id !== "VChampion") return;
    if (!el.src.includes("logos/")) {
      el.src = "";
      el.classList.remove("winner-glow", "champion", "slam");
    }
  });
  Object.keys(filled).forEach(k => filled[k] = false);
}

registerAllClickEvents();
