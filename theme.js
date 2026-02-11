document.documentElement.style.setProperty("--bg", CONFIG.colors.background);
document.documentElement.style.setProperty("--card", CONFIG.colors.card);
document.documentElement.style.setProperty("--primary", CONFIG.colors.primary);
document.documentElement.style.setProperty("--secondary", CONFIG.colors.secondary);
document.documentElement.style.setProperty("--text", CONFIG.colors.text);

if (CONFIG.backgroundImage) {
  document.body.style.backgroundImage = `url(${CONFIG.backgroundImage})`;
}
