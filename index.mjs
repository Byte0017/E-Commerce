const inputTask = document.querySelector("#addTask");
const addTaskBtn = document.querySelector("#addTaskBtn");
const speakBtn = document.querySelector("#speakBtn");
const prioritySelect = document.querySelector("#priority");
const container = document.querySelector(".container");
const message = document.querySelector("#message");

let id = localStorage.length > 0 ? Math.max(...Object.keys(localStorage).map(Number)) + 1 : 1;

document.addEventListener("DOMContentLoaded", () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const taskData = JSON.parse(localStorage.getItem(key));
    if (taskData) addTask(taskData.task, taskData.priority, key, false);
  }
});

addTaskBtn.addEventListener("click", () => {
  addTask(inputTask.value.trim(), prioritySelect.value);
});

speakBtn.addEventListener("click", () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.onresult = (e) => addTask(e.results[0][0].transcript.trim(), prioritySelect.value);
  recognition.onerror = recognition.onend = () => (speakBtn.innerHTML = '<i class="material-icons">mic</i> Speak');
  speakBtn.innerHTML = '<i class="material-icons">hearing</i> Listening...';
  recognition.start();
});

function addTask(task, priority, taskId = null, save = true) {
  if (!task) return showMessage("Task cannot be empty.", "error");

  taskId = taskId || id++;
  const taskData = { task, priority, timestamp: new Date().toISOString() };
  if (save) localStorage.setItem(taskId, JSON.stringify(taskData));

  const taskDiv = document.createElement("div");
  taskDiv.className = `task priority-${priority}`;
  taskDiv.dataset.id = taskId;

  taskDiv.innerHTML = `
    <div class="task-header">
      <span class="priority-indicator"></span>
      <span class="timestamp">${new Date(taskData.timestamp).toLocaleString()}</span>
    </div>
    <textarea readonly>${task}</textarea>
    <div class="task-actions">
      <button class="edit"><i class="material-icons">edit</i></button>
      <button class="delete"><i class="material-icons">delete</i></button>
    </div>
  `;

  taskDiv.querySelector(".edit").addEventListener("click", (e) => toggleEdit(e.target));
  taskDiv.querySelector(".delete").addEventListener("click", () => {
    localStorage.removeItem(taskId);
    taskDiv.remove();
    showMessage("Task deleted successfully!", "success");
  });

  container.appendChild(taskDiv);
  inputTask.value = ""; // Clear input after adding
  showMessage("Task added successfully!", "success");
}

function toggleEdit(button) {
  const taskDiv = button.closest(".task");
  const textarea = taskDiv.querySelector("textarea");
  const isReadOnly = textarea.hasAttribute("readonly");
  textarea.toggleAttribute("readonly");
  button.innerHTML = isReadOnly ? '<i class="material-icons">save</i>' : '<i class="material-icons">edit</i>';

  if (!isReadOnly) {
    const taskId = taskDiv.dataset.id;
    const updatedTask = textarea.value.trim();
    const taskData = JSON.parse(localStorage.getItem(taskId));
    taskData.task = updatedTask;
    localStorage.setItem(taskId, JSON.stringify(taskData));
    showMessage("Task updated successfully!", "success");
  }
}

function showMessage(msg, type) {
  message.textContent = msg;
  message.className = type;
  setTimeout(() => (message.textContent = ""), 3000);
}
