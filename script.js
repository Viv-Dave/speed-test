// Multiple sample word arrays for variety
// Multiple sample word arrays for variety
const sampleWords1 = [
  "the",
  "quick",
  "brown",
  "fox",
  "jumps",
  "over",
  "lazy",
  "dog",
  "sun",
  "rises",
  "in",
  "east",
  "happy",
  "people",
  "work",
  "together",
  "to",
  "build",
  "better",
  "world",
];
const sampleWords2 = [
  "rain",
  "falls",
  "gently",
  "on",
  "green",
  "fields",
  "birds",
  "sing",
  "sweet",
  "songs",
  "trees",
  "sway",
  "wind",
  "blows",
  "softly",
  "clouds",
  "drift",
  "sky",
  "blue",
  "calm",
];
const sampleWords3 = [
  "time",
  "flies",
  "when",
  "you",
  "are",
  "having",
  "fun",
  "life",
  "moves",
  "fast",
  "days",
  "pass",
  "nights",
  "grow",
  "long",
  "stars",
  "shine",
  "moon",
  "glows",
  "peace",
];
const sampleWords4 = [
  "cats",
  "chase",
  "mice",
  "dogs",
  "bark",
  "loud",
  "fish",
  "swim",
  "deep",
  "waters",
  "birds",
  "fly",
  "high",
  "above",
  "trees",
  "grow",
  "tall",
  "hills",
  "stand",
  "firm",
];
const sampleWords5 = [
  "love",
  "brings",
  "joy",
  "hearts",
  "beat",
  "strong",
  "hope",
  "lifts",
  "spirits",
  "high",
  "dreams",
  "guide",
  "us",
  "forward",
  "light",
  "shines",
  "bright",
  "path",
  "clear",
  "now",
];

// Array of all sample word sets
const allSampleWords = [
  sampleWords1,
  sampleWords2,
  sampleWords3,
  sampleWords4,
  sampleWords5,
];

// DOM elements
const testParagraph = document.getElementById("test-paragraph");
const inputArea = document.getElementById("input-area");
const submitBtn = document.getElementById("submit-btn");
const timerDisplay = document.getElementById("timer");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const mistakesDisplay = document.getElementById("mistakes");
const statsDialog = document.getElementById("stats-dialog");
const dialogTimer = document.getElementById("dialog-timer");
const dialogWpm = document.getElementById("dialog-wpm");
const dialogAccuracy = document.getElementById("dialog-accuracy");
const dialogMistakes = document.getElementById("dialog-mistakes");
const tryAgainBtn = document.getElementById("try-again-btn");

// State variables
let startTime = null;
let timerInterval = null;
let generatedText = "";

// Generate a random paragraph from a randomly selected word set
function generateRandomParagraph(wordCount = 20) {
  const randomSetIndex = Math.floor(Math.random() * allSampleWords.length);
  const selectedWords = allSampleWords[randomSetIndex];
  const shuffledWords = [...selectedWords].sort(() => Math.random() - 0.5);
  return shuffledWords.slice(0, wordCount).join(" ");
}

// Calculate results (WPM, accuracy, mistakes)
function calculateResults() {
  const elapsedTime = startTime ? (Date.now() - startTime) / 1000 : 0;
  const typedText = inputArea.value.trim();
  const typedWords = typedText.split(/\s+/).filter((word) => word.length > 0);
  const correctText = generatedText.split(" ");
  const minutes = elapsedTime / 60;
  const wpm = minutes > 0 ? Math.round(typedWords.length / minutes) : 0;
  const totalCharsTyped = typedText.length;
  const totalCharsCorrect = generatedText
    .slice(0, totalCharsTyped)
    .split("")
    .filter((char, i) => char === typedText[i]).length;
  const accuracy =
    totalCharsTyped > 0
      ? Math.round((totalCharsCorrect / totalCharsTyped) * 100)
      : 0;
  let mistakes = 0;
  for (let i = 0; i < typedWords.length; i++) {
    if (typedWords[i] !== correctText[i]) mistakes++;
  }
  return { elapsedTime, wpm, accuracy, mistakes };
}

// Update display during typing (no mistakes yet)
function updateTypingDisplay() {
  const { elapsedTime, wpm, accuracy } = calculateResults();
  timerDisplay.textContent = Math.round(elapsedTime);
  wpmDisplay.textContent = wpm;
  accuracyDisplay.textContent = `${accuracy}%`;
  mistakesDisplay.textContent = "-";
}

// Show final stats in dialog
function showStatsDialog() {
  // Calculate results before resetting the timer
  const { elapsedTime, wpm, accuracy, mistakes } = calculateResults();

  // Stop the timer
  if (timerInterval) clearInterval(timerInterval);
  startTime = null;

  // Update main display
  timerDisplay.textContent = Math.round(elapsedTime);
  wpmDisplay.textContent = wpm;
  accuracyDisplay.textContent = `${accuracy}%`;
  mistakesDisplay.textContent = mistakes;

  // Update dialog with the same values
  dialogTimer.textContent = Math.round(elapsedTime);
  dialogWpm.textContent = wpm;
  dialogAccuracy.textContent = accuracy;
  dialogMistakes.textContent = mistakes;

  statsDialog.showModal(); // Show the dialog
}

// Start the timer
function startTimer() {
  if (!startTime) {
    startTime = Date.now();
    timerInterval = setInterval(updateTypingDisplay, 100);
  }
}

// Reset the test
function resetTest() {
  if (timerInterval) clearInterval(timerInterval);
  startTime = null;
  timerInterval = null;
  inputArea.value = "";
  generatedText = generateRandomParagraph();
  testParagraph.textContent = generatedText;
  timerDisplay.textContent = "0";
  wpmDisplay.textContent = "0";
  accuracyDisplay.textContent = "0%";
  mistakesDisplay.textContent = "-";
}

// Event listeners
inputArea.addEventListener("input", () => {
  if (!startTime) startTimer();
  updateTypingDisplay();
});

submitBtn.addEventListener("click", () => {
  if (startTime) {
    // Only proceed if test has started
    showStatsDialog();
  }
});

tryAgainBtn.addEventListener("click", () => {
  statsDialog.close(); // Close the dialog
  resetTest(); // Reset for a new attempt
});

// Initialize the test on page load
document.addEventListener("DOMContentLoaded", () => {
  resetTest();
  testParagraph.addEventListener("contextmenu", (event) =>
    event.preventDefault()
  );
});
