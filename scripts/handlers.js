import { UI, CURRENT_VERSION, actions } from "./main.js";
import { AddTaskCommand } from "./Commands/AddTaskCommand.js";
import { DeleteTaskCommand } from "./Commands/DeleteTaskCommand.js";
import { UpdateTaskCommand } from "./Commands/UpdateTaskCommand.js";
import { Task } from "./task.js";
import { refresh } from "./render.js";
import { currentTaskId, setCurrentTaskId } from "./state.js";
import { getTask } from "./persistence.js";

export function handleAddTask() {
  const title = UI.addTitle.value.trim();

  if (!title) return;

  const addCommand = new AddTaskCommand(
    title,
    UI.addPriority.value,
    CURRENT_VERSION,
  );

  addCommand.execute();
  actions.pushUndo(addCommand);

  UI.addTaskModal.close();
  refresh();

  UI.addTitle.value = "";
}

export function handleDeleteTask(taskId) {
  const deleteCommand = new DeleteTaskCommand(taskId, CURRENT_VERSION);
  deleteCommand.execute();
  actions.pushUndo(deleteCommand);
  refresh();
}

export function handleEditTask() {
  if (currentTaskId === null) return;

  const title = UI.editTitle.value.trim();

  if (!title) return;

  const status = UI.editStatus.value === "completed";

  const updateCommand = new UpdateTaskCommand(
    currentTaskId,
    new Task(currentTaskId, title, UI.editPriority.value, status),
    CURRENT_VERSION,
  );

  updateCommand.execute();
  actions.pushUndo(updateCommand);

  refresh();

  UI.editTaskModal.close();
  setCurrentTaskId(null);
}

export function handleUpdateTaskStatus(isCompleted) {
  if (currentTaskId === null) return;

  const task = getTask(CURRENT_VERSION, currentTaskId);

  const updateCommand = new UpdateTaskCommand(
    currentTaskId,
    new Task(currentTaskId, task.title, task.priority, isCompleted),
    CURRENT_VERSION,
  );

  updateCommand.execute();

  actions.pushUndo(updateCommand);

  refresh();
  setCurrentTaskId(null);
}
