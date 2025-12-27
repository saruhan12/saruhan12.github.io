// assets/horse.js
(() => {
  function setActiveNav() {
    const path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav a").forEach(a => {
      if (a.getAttribute("href") === path) a.classList.add("active");
    });
  }

  function normalizeFrames(frames) {
    // Keep whitespace EXACTLY (no trimming), only normalize newlines
    const split = frames.map(f => String(f).replace(/\r/g, "").split("\n"));

    // If all frames start with an empty first line (common with template literals), drop it.
    const allHaveLeadingBlank = split.every(lines => lines.length > 0 && lines[0] === "");
    if (allHaveLeadingBlank) {
      for (const lines of split) lines.shift();
    }

    const maxLines = Math.max(...split.map(lines => lines.length));
    let maxCols = 0;
    for (const lines of split) {
      for (const line of lines) {
        if (line.length > maxCols) maxCols = line.length;
      }
    }

    return split.map(lines => {
      // pad missing lines
      while (lines.length < maxLines) lines.push("");
      // pad each line to same width
      return lines.map(l => l.padEnd(maxCols, " ")).join("\n");
    });
  }

  function startHorse() {
    const el = document.getElementById("horse");
    if (!el) return;

    const raw = window.ASCII_HORSE_FRAMES;
    if (!Array.isArray(raw) || raw.length === 0) {
      el.textContent = "ASCII horse frames not found. Check assets/frames.js";
      console.error("window.ASCII_HORSE_FRAMES missing or empty.");
      return;
    }

    let frames;
    try {
      frames = normalizeFrames(raw);
    } catch (err) {
      el.textContent = "Error normalizing frames. Check console.";
      console.error("normalizeFrames failed:", err);
      return;
    }

    let i = 0;
    const ms = 90;

    el.textContent = frames[i];
    setInterval(() => {
      i = (i + 1) % frames.length;
      el.textContent = frames[i];
    }, ms);
  }

  document.addEventListener("DOMContentLoaded", () => {
    try {
      setActiveNav();
      startHorse();
    } catch (err) {
      console.error("horse.js crashed:", err);
    }
  });
})();