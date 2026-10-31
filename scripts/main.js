import {
  addTask,
  deleteTask,
  getData,
  getLatestTaskId,
  updateData,
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

function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.dataset.id);
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

function loadTasks() {
  data.tasks.forEach((t) => {
    const tr = document.createElement("tr");
    tr.dataset.taskId = t.id;
    tr.addEventListener("dragstart", dragStart);
    tr.addEventListener("dragend", dragEnd);
    tr.draggable = true;
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

function sortTasks() {
  UI.tasksTableBody.innerHTML = "";
  if (UI.sort.checked) {
    data.tasks.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    data = getData(1);
  }
  loadTasks();
}

function filterByPriority() {
  data = getData(1);
  UI.tasksTableBody.innerHTML = "";
  data.tasks = data.tasks.filter((t) => t.priority === UI.filter.value);
  loadTasks();
}

document.addEventListener("DOMContentLoaded", loadTasks);
document.addEventListener("DOMContentLoaded", loadStatistics);

UI.sort.addEventListener("change", sortTasks);
UI.filter.addEventListener("change", filterByPriority);

UI.addTaskBtn.addEventListener("click", () => UI.addTaskModal.showModal());
UI.addSave.addEventListener("click", handleAddTask);

UI.addCloseBtn.addEventListener("click", () => UI.addTaskModal.close());
UI.editCloseBtn.addEventListener("click", () => UI.editTaskModel.close());

UI.tasksTableBody.addEventListener("dragover", (e) => {
  e.preventDefault();
  const draggingRow = document.querySelector(".dragging");
  // Get all table rows inside the tbody except the one being dragged
  const siblings = [...UI.tasksTableBody.querySelectorAll("tr:not(.dragging)")];

  // Find the row the cursor is currently over
  const nextSibling = siblings.find((sibling) => {
    const box = sibling.getBoundingClientRect();
    const boxCenter = box.top + box.height / 2;
    return e.clientY <= boxCenter;
  });

  // Insert the moving row before the target sibling row
  UI.tasksTableBody.insertBefore(draggingRow, nextSibling);
});
