import { Command } from "./Command.js";
import { addTask, deleteTask, getTask } from "../persistence.js";

export class DeleteTaskCommand extends Command {
  #currentTask;

  constructor(id, currentVersion) {
    super();

    this.id = id;
    this.currentVersion = currentVersion;
    this.#currentTask = getTask(this.currentVersion, this.id);
  }

  execute() {
    if (!this.#currentTask) return;

    deleteTask(this.currentVersion, this.id);
  }

  undo() {
    if (!this.#currentTask) return;

    addTask(this.currentVersion, this.#currentTask);
  }
}
