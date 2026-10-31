export class Actions {
  #undoStack;
  #redoStack;

  constructor(actionsNum) {
    this.actionsNum = actionsNum;
    this.#undoStack = [];
    this.#redoStack = [];
  }

  pushUndo(value) {
    if (this.#undoStack.length === this.actionsNum) {
      this.#undoStack.shift();
    }
    this.#undoStack.push(value);
  }

  popUndo() {
    return this.#undoStack.pop();
  }

  pushRedo(value) {
    if (this.#redoStack.length === this.actionsNum) {
      this.#redoStack.shift();
    }
    this.#redoStack.push(value);
  }

  popRedo() {
    return this.#redoStack.pop();
  }
}
