const grid = document.getElementById("grid");
const timer = document.getElementById("timer");
const nextDisplay = document.getElementById("next");
const mistakesDisplay = document.getElementById("mistakes");
const progressBar = document.getElementById("progressBar");
const message = document.getElementById("message");
const bestDisplay = document.getElementById("bestTime");

let nextNumber = 1;
let mistakes = 0;
let startTime = null;
let interval = null;
let finished = false;
let bestTime = Number(localStorage.getItem("schulteBest")) || null;

function formatTime(ms) {
  const seconds = ms / 1000;
  const minutes = Math.floor(seconds / 60);
  const remaining = (seconds % 60).toFixed(1);
  return `${String(minutes).padStart(2, "0")}:${String(
    Math.floor(remaining)
  ).padStart(2, "0")}.${remaining.split(".")[1]}`;
}

function updateTimer() {
  if (startTime !== null) {
    timer.textContent = formatTime(Date.now() - startTime);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function updateBest() {
  bestDisplay.textContent = bestTime ? formatTime(bestTime) : "--:--.-";
}

function newGame() {
  clearInterval(interval);
  nextNumber = 1;
  mistakes = 0;
  startTime = null;
  finished = false;

  timer.textContent = "00:00.0";
  nextDisplay.textContent = "01";
  mistakesDisplay.textContent = "0";
  progressBar.style.width = "0%";
  message.textContent = "Find numbers in order from 1 to 25.";
  grid.innerHTML = "";

  const numbers = shuffle(Array.from({ length: 25 }, (_, i) => i + 1));

  numbers.forEach((number) => {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "cell";
    cell.textContent = number;
    cell.setAttribute("aria-label", `Number ${number}`);
    cell.addEventListener("click", () => handleClick(number, cell));
    grid.appendChild(cell);
  });

  updateBest();
}

function handleClick(number, cell) {
  if (finished || cell.classList.contains("correct")) return;

  if (startTime === null) {
    startTime = Date.now();
    interval = setInterval(updateTimer, 50);
  }

  if (number === nextNumber) {
    cell.classList.add("correct");
    cell.disabled = true;
    nextNumber++;

    nextDisplay.textContent =
      nextNumber <= 25 ? String(nextNumber).padStart(2, "0") : "DONE";

    progressBar.style.width = `${((nextNumber - 1) / 25) * 100}%`;

    if (nextNumber > 25) finishGame();
  } else {
    mistakes++;
    mistakesDisplay.textContent = mistakes;
    cell.classList.add("wrong");
    setTimeout(() => cell.classList.remove("wrong"), 250);
  }
}

function finishGame() {
  finished = true;
  clearInterval(interval);

  const totalTime = Date.now() - startTime;
  timer.textContent = formatTime(totalTime);
  message.textContent = `Completed! Your time: ${formatTime(totalTime)}`;

  if (bestTime === null || totalTime < bestTime) {
    bestTime = totalTime;
    localStorage.setItem("schulteBest", String(bestTime));
    message.textContent += " New personal best!";
  }

  updateBest();
}

document.getElementById("restart").addEventListener("click", newGame);
newGame();
