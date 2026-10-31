import { Command } from "./Command.js";
import { getLatestTaskId, addTask, deleteTask } from "../persistence.js";
import { Task } from "../task.js";

export class AddTaskCommand extends Command {
  #id;

  constructor(title, priority, currentVersion) {
    super();

    this.title = title;
    this.priority = priority;
    this.currentVersion = currentVersion;

    this.#id = getLatestTaskId(currentVersion) + 1;
  }

  execute() {
    addTask(
      this.currentVersion,
      new Task(this.#id, this.title, this.priority, false),
    );
  }

  undo() {
    deleteTask(this.currentVersion, this.#id);
  }
}
