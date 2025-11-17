// Feito por Leonardo e Matheus Rosini

const API_BASE = "https://es-pi2-2025-t2-g22-production-b5bc.up.railway.app/api";


function getToken() {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

function authHeaders() {
  const token = getToken();
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  const contentType = res.headers.get("content-type") || "";

  if (!res.ok) {
    let body;
    try {
      body = contentType.includes("application/json") ? await res.json() : { message: await res.text() };
    } catch {
      body = { message: "Erro inesperado na resposta" };
    }
    const error = new Error(body.message || "Erro na requisição");
    error.status = res.status;
    throw error;
  }

  return contentType.includes("application/json") ? res.json() : res.text();
}

export async function apiGet(path) {
  return fetch(API_BASE + path, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders()
    }
  }).then(handleResponse);
}

export async function apiPost(path, data) {
  return fetch(API_BASE + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders()
    },
    body: JSON.stringify(data)
  }).then(handleResponse);
}

export async function apiPut(path, data) {
  return fetch(API_BASE + path, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders()
    },
    body: JSON.stringify(data)
  }).then(handleResponse);
}

export async function apiDelete(path) {
  return fetch(API_BASE + path, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders()
    }
  }).then(handleResponse);
}
