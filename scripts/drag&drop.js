import { UI, CURRENT_VERSION } from "./main.js";
import { updateData } from "./persistence.js";

export function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.dataset.taskId);
  e.target.classList.add("dragging");
}

function updateTasksOrder(data) {
  const newOrder = [...UI.tasksTableBody.querySelectorAll("tr")].map((row) =>
    Number(row.dataset.taskId),
  );

  data.tasks.sort((a, b) => newOrder.indexOf(a.id) - newOrder.indexOf(b.id));

  updateData(CURRENT_VERSION, data.tasks);
}

export function dragEnd(e, data) {
  e.target.classList.remove("dragging");

  updateTasksOrder(data);
}

export function dragover(e) {
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
