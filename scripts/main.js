import {
  addTask,
  deleteTask,
  getData,
  getLatestTaskId,
  updateData,
  updateTask,
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

  sort: document.getElementById("sort"),
  filter: document.getElementById("filter"),
  search: document.getElementById("search"),

  // Add task modal
  addTaskModal: document.getElementById("addTaskModal"),
  addTitle: document.getElementById("addTitle"),
  addPriority: document.getElementById("addPriority"),
  addSave: document.getElementById("addSave"),
  addCloseBtn: document.getElementById("addCloseBtn"),

  // Edit task modal
  editTaskModel: document.getElementById("editTaskModal"),
  editTitle: document.getElementById("editTitle"),
  editPriority: document.getElementById("editPriority"),
  editStatus: document.getElementById("editStatus"),
  editSave: document.getElementById("editSave"),
  editCloseBtn: document.getElementById("editCloseBtn"),
};

let data = getData(1);

// ==============================
// Statistics
// ==============================

function loadStatistics() {
  UI.totalTasks.textContent = data.tasks.length;

  UI.completedTasks.textContent = data.tasks.reduce(
    (acc, current) => (current.isCompleted ? acc + 1 : acc),
    0,
  );

  UI.pendingTasks.textContent = data.tasks.reduce(
    (acc, current) => (current.isCompleted ? acc : acc + 1),
    0,
  );

  UI.highPriorityTasks.textContent = data.tasks.reduce(
    (acc, current) => (current.priority === "high" ? acc + 1 : acc),
    0,
  );
}

let currentTaskId;

// ==============================
// Drag and Drop
// ==============================

function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.dataset.taskId);
  e.target.classList.add("dragging");
}

function updateTasksOrder() {
  const newOrder = [...UI.tasksTableBody.querySelectorAll("tr")].map((row) =>
    Number(row.dataset.taskId),
  );

  data.tasks.sort((a, b) => newOrder.indexOf(a.id) - newOrder.indexOf(b.id));

  updateData(1, data.tasks);
}

function dragEnd(e) {
  e.target.classList.remove("dragging");

  updateTasksOrder();
}

function dragover(e) {
  e.preventDefault();

  const draggingRow = document.querySelector(".dragging");

  if (!draggingRow) return;

  const siblings = [...UI.tasksTableBody.querySelectorAll("tr:not(.dragging)")];

  const nextSibling = siblings.find((sibling) => {
    const box = sibling.getBoundingClientRect();
    const boxCenter = box.top + box.height / 2;

    return e.clientY <= boxCenter;
  });

  UI.tasksTableBody.insertBefore(draggingRow, nextSibling);
}

// ==============================
// Load Tasks
// ==============================

function loadTasks(tasks) {
  tasks.forEach((t) => {
    const tr = document.createElement("tr");

    tr.dataset.taskId = t.id;

    tr.addEventListener("dragstart", dragStart);
    tr.addEventListener("dragend", dragEnd);

    tr.draggable = true;

    // Completion checkbox
    const checkboxCell = document.createElement("td");

    const isCompleted = document.createElement("input");

    isCompleted.type = "checkbox";
    isCompleted.checked = t.isCompleted;

    checkboxCell.appendChild(isCompleted);
    tr.appendChild(checkboxCell);

    // Title
    const title = document.createElement("td");

    title.textContent = t.title;

    tr.appendChild(title);

    // Priority
    const priority = document.createElement("td");

    priority.textContent = t.priority;

    tr.appendChild(priority);

    // Status
    const status = document.createElement("td");

    status.textContent = t.isCompleted ? "Completed" : "Pending";

    tr.appendChild(status);

    // Actions
    const actions = document.createElement("td");

    const deleteBtn = document.createElement("button");

    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", () => handleDeleteTask(t.id));

    const editBtn = document.createElement("button");

    editBtn.type = "button";
    editBtn.textContent = "Edit";

    editBtn.addEventListener("click", () => {
      currentTaskId = t.id;
      UI.editTaskModel.showModal();
    });

    actions.appendChild(deleteBtn);
    actions.appendChild(editBtn);

    tr.appendChild(actions);

    UI.tasksTableBody.appendChild(tr);
  });
}

// ==============================
// Refresh
// ==============================

function refresh() {
  data = getData(1);

  UI.tasksTableBody.innerHTML = "";

  loadTasks(data.tasks);
  loadStatistics();
}

// ==============================
// Add Task
// ==============================

function handleAddTask() {
  const title = UI.addTitle.value.trim();

  if (!title) return;

  addTask(
    1,
    new Task(getLatestTaskId(1) + 1, title, UI.addPriority.value, false),
  );

  refresh();

  UI.addTaskModal.close();

  UI.addTitle.value = "";
}

// ==============================
// Delete Task
// ==============================

function handleDeleteTask(taskId) {
  deleteTask(1, taskId);

  refresh();
}

function handleEditTask(taskId) {
  const status = UI.editStatus.value.toLowerCase() === "completed";
  updateTask(
    1,
    taskId,
    new Task(taskId, UI.editTitle.value.trim(), UI.editPriority.value, status),
  );
  refresh();

  UI.editTaskModel.close();
}

// ==============================
// Sort Tasks
// ==============================

function sortTasks() {
  data = getData(1);

  UI.tasksTableBody.innerHTML = "";

  if (UI.sort.checked) {
    data.tasks.sort((a, b) => a.title.localeCompare(b.title));
  }

  loadTasks(data.tasks);
}

// ==============================
// Filter Tasks
// ==============================

function filterByPriority() {
  data = getData(1);

  UI.tasksTableBody.innerHTML = "";

  const filteredTasks = UI.filter.value
    ? data.tasks.filter((t) => t.priority === UI.filter.value)
    : data.tasks;

  loadTasks(filteredTasks);
}

// ==============================
// Debounce
// ==============================

function debounce(callback, delay = 300) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}

// ==============================
// Search Tasks
// ==============================

function search(e) {
  data = getData(1);

  UI.tasksTableBody.innerHTML = "";

  const value = e.target.value.trim().toLowerCase();

  const filteredTasks = data.tasks.filter((t) =>
    t.title.toLowerCase().includes(value),
  );

  loadTasks(filteredTasks);
}

// ==============================
// Event Listeners
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  data = getData(1);

  loadTasks(data.tasks);
  loadStatistics();
});

UI.sort.addEventListener("change", sortTasks);

UI.filter.addEventListener("change", filterByPriority);

const debouncedSearch = debounce(search);

UI.search.addEventListener("input", debouncedSearch);

UI.addTaskBtn.addEventListener("click", () => {
  UI.addTaskModal.showModal();
});

UI.addSave.addEventListener("click", handleAddTask);

UI.addCloseBtn.addEventListener("click", () => {
  UI.addTaskModal.close();
});

UI.editSave.addEventListener("click", () => handleEditTask(currentTaskId));

UI.editCloseBtn.addEventListener("click", () => {
  UI.editTaskModel.close();
});

UI.tasksTableBody.addEventListener("dragover", dragover);

// Save shortcut
document.addEventListener("keydown", (e) => {
  // Ctrl + S or Cmd + S
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
    e.preventDefault();
    e.stopPropagation();

    if (UI.addTaskModal.open) {
      handleAddTask();
    } else if (UI.editTaskModel.open) {
      handleEditTask(currentTaskId);
    }

    return;
  }
});

// Add new task shortcut
document.addEventListener("keydown", (e) => {
  if (e.altKey && e.key.toLowerCase() === "n") {
    e.preventDefault();
    e.stopPropagation();

    UI.addTaskModal.showModal();
  }
});

// Close add/edit task modal shortcut
document.addEventListener("keydown", (e) => {
  if (e.key.toLocaleLowerCase() === "escape") {
    if (UI.addTaskModal.open) {
      UI.addTaskModal.close();
    } else if (UI.editTaskModel.open) {
      UI.editTaskModel.close();
    }
    return;
  }
});
