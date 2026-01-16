// Track previous state
let wasGenerating = false;

// Function to play the sound
function playNotificationSound() {
  console.log("AI Studio Notifier: Playing sound...");
  const soundUrl = chrome.runtime.getURL("coin.mp3");
  const audio = new Audio(soundUrl);
  audio.play().catch(error => {
    console.warn("AI Studio Notifier: Could not play sound.", error);
  });
}

function checkButtonState() {
  // 1. Find the button using the specific tooltip class from your HTML
  const runBtn = document.querySelector(
    'button[mattooltipclass="run-button-tooltip"]'
  );

  if (!runBtn) return;

  // 2. Check if the button is currently in "Stop" mode.
  // Based on your HTML:
  // - Idle: innerText is "Run"
  // - Active: innerText contains "Stop" AND has a span with class "spin"
  const textContent = runBtn.innerText || "";

  // We check if the text includes "Stop" OR if we find the spinner class
  const hasSpinner = runBtn.querySelector(".spin") !== null;
  const isGenerating = textContent.includes("Stop") || hasSpinner;

  // 3. Logic: If we WERE generating, and now we are NOT, then it finished.
  if (wasGenerating && !isGenerating) {
    console.log("AI Studio Notifier: Generation Finished!");
    playNotificationSound();
  }

  // 4. Update status for next check
  wasGenerating = isGenerating;
}

// Observer to watch for changes
const observer = new MutationObserver(() => {
  checkButtonState();
});

// Start watching the body for changes (subtrees included)
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  characterData: true
});

console.log("AI Studio Notifier: Loaded and watching for 'Stop' button...");
