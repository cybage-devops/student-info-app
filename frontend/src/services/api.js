/**
 * API service layer for Student Information App.
 * Communicates with the FastAPI backend.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An unexpected error occurred' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

/**
 * Fetch all students with optional search query.
 */
export async function fetchStudents(search = '') {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  const response = await fetch(`${API_BASE}/api/students/${params}`);
  return handleResponse(response);
}

/**
 * Fetch a single student by ID.
 */
export async function fetchStudent(id) {
  const response = await fetch(`${API_BASE}/api/students/${id}`);
  return handleResponse(response);
}

/**
 * Get student statistics.
 */
export async function fetchStats() {
  const response = await fetch(`${API_BASE}/api/students/stats`);
  return handleResponse(response);
}

/**
 * Create a new student.
 */
export async function createStudent(data) {
  const response = await fetch(`${API_BASE}/api/students/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

/**
 * Update an existing student.
 */
export async function updateStudent(id, data) {
  const response = await fetch(`${API_BASE}/api/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

/**
 * Delete a student by ID.
 */
export async function deleteStudent(id) {
  const response = await fetch(`${API_BASE}/api/students/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}
