const question = document.getElementById("question");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const result = document.getElementById("result");
const image = document.getElementById("centerImage");

let noClickCount = 0;

question.textContent = CONFIG.mainQuestion;
yesBtn.textContent = CONFIG.yesText;
noBtn.textContent = CONFIG.noText;
document.title = CONFIG.siteTitle;

if (CONFIG.centerImage) {
  image.src = CONFIG.centerImage;
  image.style.display = "block";
}

yesBtn.onclick = () => {
  result.innerHTML = `<strong>${CONFIG.yesResponse}</strong><br>${CONFIG.yesSubtext}`;
  noBtn.style.display = "none";
};

noBtn.onclick = () => {
  noBtn.style.position = "absolute";
  noBtn.style.left = Math.random() * 70 + "%";
  noBtn.style.top = Math.random() * 70 + "%";

  const msg =
    CONFIG.noResponses[
      Math.min(noClickCount, CONFIG.noResponses.length - 1)
    ];
  result.textContent = msg;
  noClickCount++;
};

function createFloatingEmoji() {
  const emoji = document.createElement("div");
  emoji.className = "floating";
  emoji.textContent =
    CONFIG.emojis[Math.floor(Math.random() * CONFIG.emojis.length)];
  emoji.style.left = Math.random() * 100 + "vw";
  emoji.style.animationDuration = Math.random() * 3 + 4 + "s";
  document.body.appendChild(emoji);

  setTimeout(() => emoji.remove(), 7000);
}

for (let i = 0; i < CONFIG.floatingEmojiCount; i++) {
  setTimeout(createFloatingEmoji, i * 300);
}
