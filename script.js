let workDuration = 25 * 60; // 25 minutes in seconds
let breakDuration = 5 * 60; // 5 minutes in seconds
let totalSessions = 4;
let currentSession = 0;
let timerInterval;
let isRunning = false;
let isWorkTime = true;

const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");
const workDurationInput = document.getElementById("work-duration");
const breakDurationInput = document.getElementById("break-duration");
const sessionsInput = document.getElementById("sessions");
const darkModeButton = document.getElementById("dark-mode");
const taskInput = document.getElementById("task-input");
const addTaskButton = document.getElementById("add-task");
const tasksList = document.getElementById("tasks");
const sessionCountElement = document.getElementById("session-count");
const progressBar = document.getElementById("progress");
const beepSound = document.getElementById("beep-sound");

function updateTimerDisplay(minutes, seconds) {
  minutesElement.textContent = String(minutes).padStart(2, "0");
  secondsElement.textContent = String(seconds).padStart(2, "0");
}

function updateProgressBar() {
  const totalTime = isWorkTime ? workDuration : breakDuration;
  const elapsedTime = isWorkTime ? workDuration : breakDuration;
  const progress = ((totalTime - elapsedTime) / totalTime) * 100;
  progressBar.style.width = `${progress}%`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  timerInterval = setInterval(() => {
    if (isWorkTime) {
      workDuration--;
      if (workDuration < 0) {
        clearInterval(timerInterval);
        isWorkTime = false;
        beepSound.play(); // Play beep sound
        alert("Work time is over! Take a break.");
        currentSession++;
        sessionCountElement.textContent = currentSession;
        if (currentSession >= totalSessions) {
          alert("All sessions completed!");
          resetTimer();
          return;
        }
        startTimer();
        return;
      }
      updateTimerDisplay(Math.floor(workDuration / 60), workDuration % 60);
    } else {
      breakDuration--;
      if (breakDuration < 0) {
        clearInterval(timerInterval);
        isWorkTime = true;
        beepSound.play(); // Play beep sound
        alert("Break time is over! Back to work.");
        startTimer();
        return;
      }
      updateTimerDisplay(Math.floor(breakDuration / 60), breakDuration % 60);
    }
    updateProgressBar();
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  isWorkTime = true;
  currentSession = 0;
  sessionCountElement.textContent = currentSession;
  workDuration = parseInt(workDurationInput.value) * 60;
  breakDuration = parseInt(breakDurationInput.value) * 60;
  updateTimerDisplay(Math.floor(workDuration / 60), workDuration % 60);
  progressBar.style.width = "0%";
}

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;
  const taskItem = document.createElement("li");
  taskItem.textContent = taskText;
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    tasksList.removeChild(taskItem);
  });
  taskItem.appendChild(deleteButton);
  tasksList.appendChild(taskItem);
  taskInput.value = "";
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);
workDurationInput.addEventListener("change", () => {
  workDuration = parseInt(workDurationInput.value) * 60;
  if (!isRunning && isWorkTime) {
    updateTimerDisplay(Math.floor(workDuration / 60), workDuration % 60);
  }
});
breakDurationInput.addEventListener("change", () => {
  breakDuration = parseInt(breakDurationInput.value) * 60;
  if (!isRunning && !isWorkTime) {
    updateTimerDisplay(Math.floor(breakDuration / 60), breakDuration % 60);
  }
});
sessionsInput.addEventListener("change", () => {
  totalSessions = parseInt(sessionsInput.value);
});
darkModeButton.addEventListener("click", toggleDarkMode);
addTaskButton.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});