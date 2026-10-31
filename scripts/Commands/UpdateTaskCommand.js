import { Command } from "./Command.js";
import { getTask, updateTask } from "../persistence.js";

export class UpdateTaskCommand extends Command {
  #originalTask;

  constructor(id, updatedTask, currentVersion) {
    super();

    this.id = id;
    this.updatedTask = updatedTask;
    this.currentVersion = currentVersion;
    this.#originalTask = getTask(this.currentVersion, this.id);
  }

  execute() {
    if (!this.#originalTask) return;

    updateTask(this.currentVersion, this.id, this.updatedTask);
  }

  undo() {
    if (!this.#originalTask) return;
    updateTask(this.currentVersion, this.id, this.#originalTask);
  }
}
