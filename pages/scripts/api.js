const API_URL = "https://es-pi2-2025-t2-g22-production-b5bc.up.railway.app/api";

async function handleResponse(response) {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.message || `Erro na requisição: ${response.status}`);
    }
    return data;
}

// ==== CRUD genérico ====
export async function apiGet(path) {
    const response = await fetch(`${API_URL}${path}`);
    return handleResponse(response);
}

export async function apiPost(path, data) {
    const response = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return handleResponse(response);
}

export async function apiPut(path, data) {
    const response = await fetch(`${API_URL}${path}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return handleResponse(response);
}

export async function apiDelete(path) {
    const response = await fetch(`${API_URL}${path}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    });
    return handleResponse(response);
}

// ==== Auth ====
export async function login(email, senha) {
    return apiPost('/auth/login', { email, senha });
}

export async function register(nome, email, senha, telefone = "") {
    return apiPost('/auth/register', { nome, email, senha, telefone });
}
