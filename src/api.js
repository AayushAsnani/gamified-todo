const API_BASE = "/api";

// ─── Tasks ───────────────────────────────────────────────

export async function fetchTasks() {
  const res = await fetch(`${API_BASE}/tasks`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export async function createTask(task) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

export async function updateTask(id, data) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

export async function deleteTaskApi(id) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete task");
  return res.json();
}

// ─── Progress ────────────────────────────────────────────

export async function fetchProgress() {
  const res = await fetch(`${API_BASE}/progress`);
  if (!res.ok) throw new Error("Failed to fetch progress");
  return res.json();
}

export async function updateProgress(data) {
  const res = await fetch(`${API_BASE}/progress`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update progress");
  return res.json();
}

// ─── Shop ────────────────────────────────────────────────

export async function fetchShop() {
  const res = await fetch(`${API_BASE}/shop`);
  if (!res.ok) throw new Error("Failed to fetch shop data");
  return res.json();
}

export async function updateShop(data) {
  const res = await fetch(`${API_BASE}/shop`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update shop data");
  return res.json();
}
