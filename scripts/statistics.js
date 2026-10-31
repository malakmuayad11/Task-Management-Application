import { UI } from "../scripts/main.js";
export function loadStatistics(data) {
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
