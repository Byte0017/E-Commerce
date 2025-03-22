const inputTask = document.querySelector("#addTask");
const addTaskBtn = document.querySelector("#addTaskBtn");
const speakBtn = document.querySelector("#speakBtn");
const container = document.querySelector(".container");
const message = document.querySelector("#message");

// Initialize ID based on localStorage
let id =
  localStorage.length > 0
    ? Math.max(...Object.keys(localStorage).map(Number)) + 1
    : 1;

// Load tasks from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const task = localStorage.getItem(key);
    if (task) addTask(task, key, false); // Pass false to prevent re-adding to localStorage
  }
});

// Add task event
addTaskBtn.addEventListener("click", () => addTask(inputTask.value.trim()));

// Speech recognition setup
speakBtn.addEventListener("click", () => {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.onresult = (e) => addTask(e.results[0][0].transcript.trim());
  recognition.onerror = recognition.onend = () =>
    (speakBtn.textContent = "Speak");
  speakBtn.textContent = "Listening...";
  recognition.start();
});

// Add task to the container and localStorage
function addTask(task, taskId = null, save = true) {
  if (!task) return showMessage("Task cannot be empty.", "error");

  taskId = taskId || id++; // Use existing ID if provided, otherwise increment the ID
  if (save) localStorage.setItem(taskId, task);

  const taskDiv = document.createElement("div");
  taskDiv.className = "task";
  taskDiv.dataset.id = taskId; // Store the ID in the element for easy access

  taskDiv.innerHTML = `
    <textarea readonly>${task}</textarea>
    <button class="edit">Edit</button>
    <button class="delete">Delete</button>
  `;

  taskDiv
    .querySelector(".edit")
    .addEventListener("click", (e) => toggleEdit(e.target));
  taskDiv.querySelector(".delete").addEventListener("click", () => {
    localStorage.removeItem(taskId); // Remove task from localStorage
    taskDiv.remove(); // Remove task from DOM
    showMessage("Task deleted successfully!", "success");
  });

  container.appendChild(taskDiv);
  showMessage("Task added successfully!", "success");
}

// Toggle edit/save functionality
function toggleEdit(button) {
  const textarea = button.previousElementSibling;
  const isReadOnly = textarea.hasAttribute("readonly");
  textarea.toggleAttribute("readonly");
  button.textContent = isReadOnly ? "Save" : "Edit";

  if (!isReadOnly) {
    const taskId = button.parentElement.dataset.id;
    const updatedTask = textarea.value.trim();
    localStorage.setItem(taskId, updatedTask); // Update the task in localStorage
    showMessage("Task updated successfully!", "success");
  }
}

// Display feedback message
function showMessage(msg, type) {
  message.textContent = msg;
  message.style.color = type === "error" ? "red" : "green";
  setTimeout(() => (message.textContent = ""), 3000); // Clear after 3 seconds
}
