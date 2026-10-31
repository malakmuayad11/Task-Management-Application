export function addTask(version, newTask) {
  const data = getData(version);

  data.tasks.push(newTask);

  localStorage.setItem("data", JSON.stringify(data));
}

export function deleteTask(version, taskId) {
  const data = getData(version);

  data.tasks = data.tasks.filter((t) => t.id !== taskId);

  localStorage.setItem("data", JSON.stringify(data));
}

export function updateTask(version, taskId, updatedTask) {
  const data = getData(version);
  data.tasks = data.tasks.map((t) =>
    t.id === taskId ? { ...t, ...updatedTask } : t,
  );

  localStorage.setItem("data", JSON.stringify(data));
}

export function getTasks() {
  const data = JSON.parse(localStorage.getItem("data"));

  return data ? data.tasks : [];
}

export function getData(version) {
  const data = JSON.parse(localStorage.getItem("data"));
  if (data === null) {
    const initialData = {
      version,
      tasks: [],
    };

    localStorage.setItem("data", JSON.stringify(initialData));

    return initialData;
  }
  // Suppose that we add the priority property
  if (data.version < version) {
    data.tasks = data.tasks.map((t) => ({
      ...t,
      priority: t.priority ?? "normal",
    }));
    data.version = version;
    updateVersion(version, data.tasks);
  }
  return data;
}

export function updateVersion(newVersion, newTasks) {
  localStorage.setItem(
    "data",
    JSON.stringify({ version: newVersion, tasks: newTasks }),
  );
}

export function getLatestTaskId(version) {
  const data = getData(version);

  return data.tasks.reduce((maxId, task) => {
    return Math.max(maxId, task.id);
  }, 0);
}

// This method is used for updating data after reordering
export function updateData(version, updatedTasks) {
  const data = getData(version);

  data.tasks = updatedTasks;

  localStorage.setItem("data", JSON.stringify(data));
}

export function getTask(version, taskId) {
  const data = getData(version);

  if (data !== null) {
    return data.tasks.find((t) => t.id === taskId) ?? null;
  }

  return null;
}
