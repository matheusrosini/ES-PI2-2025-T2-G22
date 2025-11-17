// Feito por Leonardo e Matheus Rosini

const API_BASE = "http://localhost:3000/api";

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

/**
 * fetchWithTimeout: wrapper do fetch que aborta a requisição após `timeout` ms.
 * Lança Error("Request timed out") quando o tempo expira.
 */
async function fetchWithTimeout(resource, options = {}, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    return response;
  } catch (err) {
    // Normaliza o erro de timeout para uma mensagem legível
    if (err && err.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
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

// GET: não define Content-Type por padrão
export async function apiGet(path, timeout = 8000) {
  const res = await fetchWithTimeout(API_BASE + path, {
    method: "GET",
    headers: {
      ...authHeaders()
    }
  }, timeout);
  return handleResponse(res);
}

export async function apiPost(path, data, timeout = 8000) {
  const res = await fetchWithTimeout(API_BASE + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders()
    },
    body: JSON.stringify(data)
  }, timeout);
  return handleResponse(res);
}

export async function apiPut(path, data, timeout = 8000) {
  const res = await fetchWithTimeout(API_BASE + path, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders()
    },
    body: JSON.stringify(data)
  }, timeout);
  return handleResponse(res);
}

export async function apiDelete(path, timeout = 8000) {
  const res = await fetchWithTimeout(API_BASE + path, {
    method: "DELETE",
    headers: {
      ...authHeaders()
    }
  }, timeout);
  return handleResponse(res);
}
