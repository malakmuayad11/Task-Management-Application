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
  return (
    JSON.parse(localStorage.getItem("data")) || {
      version,
      tasks: [],
    }
  );
}

export function updateVersion(newVersion) {
  const data = getData(newVersion - 1);
  data.version = newVersion;
  localStorage.setItem("data", JSON.stringify(data));
}
