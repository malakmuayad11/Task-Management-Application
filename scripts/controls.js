import { getData } from "./persistence.js";
import { UI, actions, CURRENT_VERSION } from "./main.js";
import { loadTasks, refresh } from "./render.js";

let data;

export function sortTasks() {
  data = getData(CURRENT_VERSION);

  UI.tasksTableBody.innerHTML = "";

  if (UI.sort.checked) {
    data.tasks.sort((a, b) => a.title.localeCompare(b.title));
  }

  loadTasks(data.tasks);
}

export function filterByPriority() {
  data = getData(CURRENT_VERSION);

  UI.tasksTableBody.innerHTML = "";

  const filteredTasks = UI.filter.value
    ? data.tasks.filter((t) => t.priority === UI.filter.value)
    : data.tasks;

  loadTasks(filteredTasks);
}

export function search(e) {
  data = getData(CURRENT_VERSION);

  UI.tasksTableBody.innerHTML = "";

  const value = e.target.value.trim().toLowerCase();

  const filteredTasks = data.tasks.filter((t) =>
    t.title.toLowerCase().includes(value),
  );

  loadTasks(filteredTasks);
}

export function undo() {
  const command = actions.popUndo();
  command.undo();
  actions.pushRedo(command);
  refresh();
}

export function redo() {
  const command = actions.popRedo();
  command.execute();
  actions.pushUndo(command);
  refresh();
}
