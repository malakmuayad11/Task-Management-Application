import { UI, CURRENT_VERSION } from "./main.js";
import { getData } from "./persistence.js";
import { loadStatistics } from "./statistics.js";
import { dragStart, dragEnd } from "./drag&drop.js";
import { handleDeleteTask, handleUpdateTaskStatus } from "./handlers.js";
import { setCurrentTaskId } from "./state.js";

let data;

export function loadTasks(tasks) {
  tasks.forEach((t) => {
    const tr = document.createElement("tr");

    tr.dataset.taskId = t.id;

    tr.addEventListener("dragstart", dragStart);
    tr.addEventListener("dragend", (e) => dragEnd(e, data));

    tr.draggable = true;

    // Completion checkbox
    const checkboxCell = document.createElement("td");

    const isCompleted = document.createElement("input");

    isCompleted.type = "checkbox";
    isCompleted.checked = t.isCompleted;

    isCompleted.addEventListener("change", (e) => {
      setCurrentTaskId(t.id);
      handleUpdateTaskStatus(e.target.checked);
    });

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
      setCurrentTaskId(t.id);

      UI.editTitle.value = t.title;
      UI.editPriority.value = t.priority;
      UI.editStatus.value = t.isCompleted ? "completed" : "pending";

      UI.editTaskModal.showModal();
    });
    actions.appendChild(deleteBtn);
    actions.appendChild(editBtn);

    tr.appendChild(actions);

    UI.tasksTableBody.appendChild(tr);
  });
}

export function refresh() {
  data = getData(CURRENT_VERSION);

  UI.tasksTableBody.innerHTML = "";

  loadTasks(data.tasks);
  loadStatistics(data);
}
