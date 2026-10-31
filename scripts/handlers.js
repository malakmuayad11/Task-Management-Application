import { UI, CURRENT_VERSION, actions } from "./main.js";
import { AddTaskCommand } from "./Commands/AddTaskCommand.js";
import { DeleteTaskCommand } from "./Commands/DeleteTaskCommand.js";
import { UpdateTaskCommand } from "./Commands/UpdateTaskCommand.js";
import { Task } from "./task.js";
import { refresh } from "./render.js";

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

export function handleEditTask(taskId) {
  const status = UI.editStatus.value.toLowerCase() === "completed";
  const updateCommand = new UpdateTaskCommand(
    taskId,
    new Task(taskId, UI.editTitle.value.trim(), UI.editPriority.value, status),
    CURRENT_VERSION,
  );
  updateCommand.execute();
  actions.pushUndo(updateCommand);
  refresh();

  UI.editTaskModel.close();
}
