const API_BASE = "/api";

// Helper: get auth token and build headers
async function authHeaders(currentUser) {
  if (!currentUser) return { "Content-Type": "application/json" };
  const token = await currentUser.getIdToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ─── Tasks ───────────────────────────────────────────────

export async function fetchTasks(currentUser) {
  const headers = await authHeaders(currentUser);
  const res = await fetch(`${API_BASE}/tasks`, { headers });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export async function createTask(task, currentUser) {
  const headers = await authHeaders(currentUser);
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers,
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

export async function updateTask(id, data, currentUser) {
  const headers = await authHeaders(currentUser);
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

export async function deleteTaskApi(id, currentUser) {
  const headers = await authHeaders(currentUser);
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error("Failed to delete task");
  return res.json();
}

// ─── Progress ────────────────────────────────────────────

export async function fetchProgress(currentUser) {
  const headers = await authHeaders(currentUser);
  const res = await fetch(`${API_BASE}/progress`, { headers });
  if (!res.ok) throw new Error("Failed to fetch progress");
  return res.json();
}

export async function updateProgress(data, currentUser) {
  const headers = await authHeaders(currentUser);
  const res = await fetch(`${API_BASE}/progress`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update progress");
  return res.json();
}

// ─── Shop ────────────────────────────────────────────────

export async function fetchShop(currentUser) {
  const headers = await authHeaders(currentUser);
  const res = await fetch(`${API_BASE}/shop`, { headers });
  if (!res.ok) throw new Error("Failed to fetch shop data");
  return res.json();
}

export async function updateShop(data, currentUser) {
  const headers = await authHeaders(currentUser);
  const res = await fetch(`${API_BASE}/shop`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update shop data");
  return res.json();
}
