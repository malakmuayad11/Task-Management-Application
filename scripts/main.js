import { Actions } from "./Actions.js";
import { getData } from "./persistence.js";
import { loadStatistics } from "./statistics.js";
import { dragover } from "./drag&drop.js";
import { handleAddTask, handleEditTask } from "./handlers.js";
import { sortTasks, filterByPriority, search, undo, redo } from "./controls.js";
import { loadTasks } from "./render.js";

export const UI = {
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
  undoBtn: document.getElementById("undo"),
  redoBtn: document.getElementById("redo"),

  // Add task modal
  addTaskModal: document.getElementById("addTaskModal"),
  addTitle: document.getElementById("addTitle"),
  addPriority: document.getElementById("addPriority"),
  addSave: document.getElementById("addSave"),
  addCloseBtn: document.getElementById("addCloseBtn"),

  // Edit task modal
  editTaskModal: document.getElementById("editTaskModal"),
  editTitle: document.getElementById("editTitle"),
  editPriority: document.getElementById("editPriority"),
  editStatus: document.getElementById("editStatus"),
  editSave: document.getElementById("editSave"),
  editCloseBtn: document.getElementById("editCloseBtn"),
};

export const CURRENT_VERSION = 1;

export const data = getData(CURRENT_VERSION);

let currentTaskId;

export const actions = new Actions(20);

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
// Event Listeners
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  loadTasks(data.tasks);
  loadStatistics(data);
});

UI.sort.addEventListener("change", sortTasks);

UI.filter.addEventListener("change", filterByPriority);

const debouncedSearch = debounce(search);

UI.search.addEventListener("input", debouncedSearch);

UI.undoBtn.addEventListener("click", undo);

UI.redoBtn.addEventListener("click", redo);

UI.addTaskBtn.addEventListener("click", () => {
  UI.addTaskModal.showModal();
});

UI.addSave.addEventListener("click", handleAddTask);

UI.addCloseBtn.addEventListener("click", () => {
  UI.addTaskModal.close();
});

UI.editSave.addEventListener("click", () => handleEditTask());

UI.editCloseBtn.addEventListener("click", () => {
  UI.editTaskModal.close();
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
    } else if (UI.editTaskModal.open) {
      handleEditTask();
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
    } else if (UI.editTaskModal.open) {
      UI.editTaskModal.close();
    }
    return;
  }
});
