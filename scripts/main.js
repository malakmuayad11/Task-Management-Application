import {
  addTask,
  deleteTask,
  getData,
  getLatestTaskId,
} from "./persistence.js";
import { Task } from "./task.js";

const UI = {
  addTaskBtn: document.getElementById("addTaskBtn"),

  // Statistics
  totalTasks: document.getElementById("totalTasks"),
  completedTasks: document.getElementById("completedTasks"),
  pendingTasks: document.getElementById("pendingTasks"),
  highPriorityTasks: document.getElementById("highPriorityTasks"),

  // Tasks table
  tasksTableBody: document.getElementById("tasksTableBody"),

  addTaskModal: document.getElementById("addTaskModal"),
  addTitle: document.getElementById("addTitle"),
  addPriority: document.getElementById("addPriority"),
  addSave: document.getElementById("addSave"),
  addCloseBtn: document.getElementById("addCloseBtn"),

  editTaskModel: document.getElementById("editTaskModal"),
  editCloseBtn: document.getElementById("editCloseBtn"),
};

let data = getData(1);

function loadStatistics() {
  UI.totalTasks.textContent = data.tasks.length;
  UI.completedTasks.textContent = data.tasks.reduce((acc, current) => {
    return current.isCompleted ? acc + 1 : acc;
  }, 0);
  UI.pendingTasks.textContent = data.tasks.reduce((acc, current) => {
    return current.isCompleted ? acc : acc + 1;
  }, 0);
  UI.highPriorityTasks.textContent = data.tasks.reduce((acc, current) => {
    return current.priority === "high" ? acc + 1 : acc;
  }, 0);
}

function loadTasks() {
  data.tasks.forEach((t) => {
    const tr = document.createElement("tr");
    const isCompleted = document.createElement("input");
    isCompleted.type = "checkbox";
    isCompleted.checked = t.isCompleted;
    tr.appendChild(isCompleted);

    const title = document.createElement("td");
    title.textContent = t.title;
    tr.appendChild(title);

    const priority = document.createElement("td");
    priority.textContent = t.priority;
    tr.appendChild(priority);

    const status = document.createElement("td");
    status.textContent = t.isCompleted ? "Completed" : "Pending";
    tr.appendChild(status);

    const actions = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.addEventListener("click", () => handleDeleteTask(t.id));

    const editBtn = document.createElement("button");
    editBtn.addEventListener("click", () => UI.editTaskModel.showModal());
    actions.appendChild(deleteBtn);
    actions.appendChild(editBtn);
    tr.appendChild(actions);

    UI.tasksTableBody.appendChild(tr);
  });
}

function refresh() {
  UI.tasksTableBody.innerHTML = "";
  data = getData(1);
  loadTasks();
  loadStatistics();
}

function handleAddTask() {
  addTask(
    1,
    new Task(
      getLatestTaskId(1) + 1,
      UI.addTitle.value.trim(),
      UI.addPriority.value,
      false,
    ),
  );
  refresh();
}

function handleDeleteTask(taskId) {
  deleteTask(1, taskId);
  refresh();
}

document.addEventListener("DOMContentLoaded", loadTasks);
document.addEventListener("DOMContentLoaded", loadStatistics);

UI.addTaskBtn.addEventListener("click", () => UI.addTaskModal.showModal());
UI.addSave.addEventListener("click", handleAddTask);

UI.addCloseBtn.addEventListener("click", () => UI.addTaskModal.close());
UI.editCloseBtn.addEventListener("click", () => UI.editTaskModel.close());
