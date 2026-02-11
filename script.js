// ELEMENTS
const puzzleScreen = document.getElementById("puzzleScreen");
const valentineScreen = document.getElementById("valentineScreen");
const puzzleBoard = document.getElementById("puzzleBoard");
const puzzlePieces = document.getElementById("puzzlePieces");
const continueBtn = document.getElementById("continueBtn");
const cheerText = document.getElementById("cheerText");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const question = document.getElementById("question");
const result = document.getElementById("result");

const completedImage = document.getElementById("completedImage");
const puzzleChime = document.getElementById("puzzleChime");
const yaySound = document.getElementById("yaySound");
const placeSound = document.getElementById("placeSound");

const replayBtn = document.getElementById("replayBtn");
const completionContainer = document.getElementById("completionContainer");




// SET QUESTION
question.textContent = CONFIG.question;

function popTinyHeart(x, y) {
  const heart = document.createElement("div");
  heart.className = "tiny-heart";
  heart.textContent = "💕";
  heart.style.left = x + "px";
  heart.style.top = y + "px";
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 800);
}


// PUZZLE SETUP
const size = 3;
const pieceCount = size * size;
let placed = 0;

function getForbiddenRects() {
  const elements = [
    document.getElementById("puzzleScreen"),
    document.getElementById("puzzleBoard"),
    document.getElementById("puzzlePieces"),
    document.getElementById("valentineScreen")
  ].filter(el => el && el.style.display !== "none");

  const padding = 16; // buffer zone so Bobbies never touch UI

  return elements.map(el => {
    const r = el.getBoundingClientRect();
    return {
      left: r.left - padding,
      right: r.right + padding,
      top: r.top - padding,
      bottom: r.bottom + padding,
      width: r.width + padding * 2,
      height: r.height + padding * 2
    };
  });
}

function insideForbidden(x, y, size) {
  return getForbiddenRects().some(rect => (
    x < rect.right &&
    x + size > rect.left &&
    y < rect.bottom &&
    y + size > rect.top
  ));
}



// Cheer text
setTimeout(() => {
  cheerText.style.display = "block";
}, CONFIG.cheerDelay);

// Create slots
for (let i = 0; i < pieceCount; i++) {
  const slot = document.createElement("div");
  slot.className = "puzzle-slot";
  slot.dataset.index = i;

  slot.addEventListener("dragover", e => e.preventDefault());
slot.addEventListener("drop", e => {
  e.preventDefault();

  const id = e.dataTransfer.getData("text");
  const piece = document.querySelector(`.puzzle-piece[data-index="${id}"]`);
  if (!piece) return;

  const slotRect = slot.getBoundingClientRect();

  if (slot.dataset.index === piece.dataset.index) {
// ✅ Correct placement
slot.appendChild(piece);

piece.draggable = false;
piece.style.cursor = "default";
piece.style.width = "100%";
piece.style.height = "100%";
piece.style.position = "absolute";
piece.style.top = "0";
piece.style.left = "0";

// Glow feedback
slot.classList.remove("wrong");
slot.classList.add("correct");
setTimeout(() => slot.classList.remove("correct"), 500);

// Tiny heart pop
popTinyHeart(
  slotRect.left + slotRect.width / 2,
  slotRect.top + slotRect.height / 2
);

// 🔊 Soft placement sound
placeSound.currentTime = 0;
placeSound.volume = 0.4;
placeSound.play().catch(() => {});

placed++;
if (placed === pieceCount) {
  // Hide puzzle UI
  puzzleBoard.style.display = "none";
  puzzlePieces.style.display = "none";
  document.querySelector("#puzzleScreen h1").style.display = "none";
  cheerText.style.display = "none";

  // Show completion container (image + button together)
  completedImage.src = CONFIG.puzzleImage;
  completionContainer.classList.add("show");

  // Play completion chime
  puzzleChime.currentTime = 0;
  puzzleChime.volume = 0.5;
  puzzleChime.play().catch(() => {});
}




  } else {
    // ❌ Wrong placement (gentle shake)
    slot.classList.remove("wrong");
    void slot.offsetWidth; // restart animation
    slot.classList.add("wrong");
  }
});


  puzzleBoard.appendChild(slot);
}

// Create pieces
for (let i = 0; i < pieceCount; i++) {
  const piece = document.createElement("div");
  piece.className = "puzzle-piece";
  piece.dataset.index = i;
  piece.draggable = true;

  const x = (i % size) * (-300 / size);
  const y = Math.floor(i / size) * (-300 / size);

  piece.style.backgroundImage = `url(${CONFIG.puzzleImage})`;
  piece.style.backgroundPosition = `${x}px ${y}px`;

  piece.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text", i);
  });

  puzzlePieces.appendChild(piece);
}

// Shuffle puzzle pieces visually (Fisher–Yates)
(function shufflePieces() {
  const pieces = Array.from(puzzlePieces.children);

  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }

  // Re-append in shuffled order
  pieces.forEach(piece => puzzlePieces.appendChild(piece));
})();

continueBtn.onclick = () => {
  // Dim background + pause Bobbies
  document.body.classList.add("dim");
  pauseBobbies(500);

  // Fade out completion + puzzle screen together
  completionContainer.classList.add("fade-out");
  puzzleScreen.classList.add("fade-out");

  setTimeout(() => {
    // Hide puzzle screen
    puzzleScreen.style.display = "none";

    // Reset completion container
    completionContainer.classList.remove("show", "fade-out");

    // Undim background
    document.body.classList.remove("dim");

    // Show Valentine screen
    valentineScreen.style.display = "block";
    requestAnimationFrame(() => {
      valentineScreen.classList.add("fade-in");
    });
  }, 500); // MUST match CSS duration
};




function burstHearts() {
  const hearts = ["💖", "💕", "💗", "💘", "🌸"];

  for (let i = 0; i < 20; i++) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    // Force full-screen coordinates
    heart.style.left = Math.random() * window.innerWidth + "px";
    heart.style.top = Math.random() * window.innerHeight + "px";

    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1200);
  }
}

const bobbyContainer = document.getElementById("bobbyContainer");

function getUIRects() {
  return [
    document.getElementById("puzzleScreen"),
    document.getElementById("valentineScreen")
  ]
    .filter(el => el && el.style.display !== "none")
    .map(el => el.getBoundingClientRect());
}

function overlapsUI(x, y, size) {
  return getUIRects().some(rect => (
    x < rect.right &&
    x + size > rect.left &&
    y < rect.bottom &&
    y + size > rect.top
  ));
}

function spawnBobbyBurst() {
  if (!CONFIG.bobby.enabled) return;

  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  for (let i = 0; i < CONFIG.bobby.burstCount; i++) {
    spawnBobby(cx, cy, true);
  }
}


let activeBobbies = [];

function spawnBobby(startX, startY, isBurst = false) {

  if (activeBobbies.length >= CONFIG.bobby.maxCount) return;

  const img = document.createElement("img");
  img.src = CONFIG.bobby.src;
  img.className = "bobby";
  img.style.width = CONFIG.bobby.size + "px";
  img.style.height = CONFIG.bobby.size + "px";

  let x = startX;
  let y = startY;
  // HARD SAFETY: ensure valid starting position
x = Number.isFinite(x) ? x : window.innerWidth / 2;
y = Number.isFinite(y) ? y : window.innerHeight / 2;

img.style.left = x + "px";
img.style.top = y + "px";

  let angle = isBurst
  ? (activeBobbies.length / CONFIG.bobby.burstCount) * Math.PI * 2
  : Math.random() * Math.PI * 2;

  let speed = CONFIG.bobby.speed * (0.8 + Math.random() * 0.4);

  bobbyContainer.appendChild(img);
  activeBobbies.push(img);

function animate() {
  // ⏸ Pause Bobbies when reacting to YES
  if (img.dataset.paused === "true") {
    return requestAnimationFrame(animate);
  }

  let vx = Math.cos(angle) * speed;
  let vy = Math.sin(angle) * speed;

  let nx = x + vx;
  let ny = y + vy;

  // Screen bounds reflection
  if (nx <= 0 || nx + CONFIG.bobby.size >= window.innerWidth) {
    angle = Math.PI - angle;
  }
  if (ny <= 0 || ny + CONFIG.bobby.size >= window.innerHeight) {
    angle = -angle;
  }

  // HARD UI COLLISION (no overlap allowed)
  if (insideForbidden(nx, ny, CONFIG.bobby.size)) {
    const rects = getForbiddenRects();

    rects.forEach(rect => {
      if (
        nx < rect.right &&
        nx + CONFIG.bobby.size > rect.left &&
        ny < rect.bottom &&
        ny + CONFIG.bobby.size > rect.top
      ) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = (x + CONFIG.bobby.size / 2) - centerX;
        const dy = (y + CONFIG.bobby.size / 2) - centerY;

        angle = Math.atan2(dy, dx);
      }
    });

    return requestAnimationFrame(animate);
  }

  // Apply movement
  x += Math.cos(angle) * speed;
  y += Math.sin(angle) * speed;

  // HARD CLAMP — CRITICAL
  x = Math.max(1, Math.min(x, window.innerWidth - CONFIG.bobby.size - 1));
  y = Math.max(1, Math.min(y, window.innerHeight - CONFIG.bobby.size - 1));

  img.style.left = x + "px";
  img.style.top = y + "px";

  requestAnimationFrame(animate);
}


  animate();
}

function startBobbyDuplication() {
  setInterval(() => {
    if (!activeBobbies.length) return;

    const last = activeBobbies[activeBobbies.length - 1];
    const rect = last.getBoundingClientRect();

    spawnBobby(
      rect.left + CONFIG.bobby.size / 2,
      rect.top + CONFIG.bobby.size / 2
    );
  }, CONFIG.bobby.spawnInterval);
}

function reactBobbiesOnYes() {
  // Pause briefly
  activeBobbies.forEach(bobby => {
    bobby.dataset.paused = "true";
  });

  setTimeout(() => {
    activeBobbies.forEach(bobby => {
      bobby.dataset.paused = "false";
    });

    // Slight speed boost
    CONFIG.bobby.speed *= 1.15;
  }, 300);
}


// YES
yesBtn.onclick = () => {
  // Clear UI
  document.body.classList.add("clear-bg");
  valentineScreen.style.display = "none";

  // Sound + hearts
  yaySound.currentTime = 0;
  yaySound.play().catch(() => {});
  burstHearts();

  // Celebration text
  const text = document.getElementById("yesCelebrationText");
  text.classList.add("show");

  // Bobby explosion from center
  spawnBobbyBurst();

  // Fade text out after a bit
  setTimeout(() => {
    text.classList.remove("show");
  }, 2000);

  // Bobby reaction
reactBobbiesOnYes();

// Show replay button
replayBtn.style.display = "block";
requestAnimationFrame(() => {
  replayBtn.classList.add("show");

  replayBtn.onclick = () => {
  window.location.reload();
};

});

};




// NO (playful)
noBtn.onclick = () => {
  noBtn.classList.remove("jiggle"); // reset
  void noBtn.offsetWidth;           // reflow so animation replays
  noBtn.classList.add("jiggle");

  setTimeout(() => {
    noBtn.style.position = "absolute";
    noBtn.style.left = Math.random() * 70 + "%";
    noBtn.style.top = Math.random() * 70 + "%";
  }, 180);
};



// ================================
// OPTION C: FULL BOBBY CHAOS ON LOAD
// ================================
// Start Bobbies ONLY after layout is stable
window.addEventListener("load", () => {
  if (!CONFIG.bobby.enabled) return;

  // small delay ensures layout + fonts settle
  setTimeout(() => {
    for (let i = 0; i < 3; i++) {
      const { x, y } = findSafeSpawnPoint(CONFIG.bobby.size);
      spawnBobby(x, y);
    }

    startBobbyDuplication();
  }, 200);
});


function findSafeSpawnPoint(size) {
  let x = 0;
  let y = 0;

  for (let i = 0; i < 100; i++) {
    x = Math.random() * (window.innerWidth - size);
    y = Math.random() * (window.innerHeight - size);

    if (
      Number.isFinite(x) &&
      Number.isFinite(y) &&
      x > 0 &&
      y > 0 &&
      !insideForbidden(x, y, size)
    ) {
      return { x, y };
    }
  }

  // Absolute fallback — center of screen
  return {
    x: window.innerWidth / 2 - size / 2,
    y: window.innerHeight / 2 - size / 2
  };
}


// ================================
// SECRET "BOBBY" INPUT (FIXED)
// ================================
(function secretBobbyInput() {
  const secret = "bobby";
  let buffer = "";

  window.addEventListener("keydown", (e) => {
    if (!e.key || e.key.length !== 1) return;

    buffer += e.key.toLowerCase();
    if (buffer.length > secret.length) {
      buffer = buffer.slice(-secret.length);
    }

    if (buffer === secret) {
      buffer = "";

      // Spawn bonus Bobbies safely around center
      for (let i = 0; i < 5; i++) {
        const { x, y } = findSafeSpawnPoint(CONFIG.bobby.size);
        spawnBobby(x, y, true);
      }

      console.log("🐊 Bobby secret unlocked!");
    }
  });
})();

// SAFETY CHECK: rescue any stuck Bobbies
setInterval(() => {
  activeBobbies.forEach(img => {
    const rect = img.getBoundingClientRect();

    if (
      rect.left <= 0 &&
      rect.top <= 0 &&
      (rect.width === 0 || rect.height === 0)
    ) {
      const { x, y } = findSafeSpawnPoint(CONFIG.bobby.size);
      img.style.left = x + "px";
      img.style.top = y + "px";
    }
  });
}, 1500);

// Absolute failsafe — teleport Bobbies out of UI
setInterval(() => {
  activeBobbies.forEach(img => {
    const rect = img.getBoundingClientRect();

    if (insideForbidden(rect.left, rect.top, rect.width)) {
      const { x, y } = findSafeSpawnPoint(CONFIG.bobby.size);
      img.style.left = x + "px";
      img.style.top = y + "px";
    }
  });
}, 500);

function pauseBobbies(duration = 500) {
  activeBobbies.forEach(bobby => {
    bobby.dataset.paused = "true";
  });

  setTimeout(() => {
    activeBobbies.forEach(bobby => {
      bobby.dataset.paused = "false";
    });
  }, duration);
}
