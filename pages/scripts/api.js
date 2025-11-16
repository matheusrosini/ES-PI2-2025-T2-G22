const API_URL = "https://es-pi2-2025-t2-g22-production-b5bc.up.railway.app/api";

async function handleResponse(response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro na requisição: ${response.status}`);
    }
    return response.json();
}

// ==== CRUD genérico ====
export async function apiGet(path) {
    const response = await fetch(`${API_URL}${path}`, {
        method: "GET",
        credentials: "include"
    });
    return handleResponse(response);
}

export async function apiPost(path, data) {
    const response = await fetch(`${API_URL}${path}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return handleResponse(response);
}

export async function apiPut(path, data) {
    const response = await fetch(`${API_URL}${path}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return handleResponse(response);
}

export async function apiDelete(path) {
    const response = await fetch(`${API_URL}${path}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });
    return handleResponse(response);
}

// ==== Auth ====
export async function login(email, senha) {
    try {
        return await apiPost('/auth/login', { email, senha });
    } catch (err) {
        console.error('Erro no login:', err.message);
        throw err;
    }
}

export async function register(nome, email, senha, telefone = "") {
    try {
        return await apiPost('/auth/register', { nome, email, senha, telefone });
    } catch (err) {
        console.error('Erro no registro:', err.message);
        throw err;
    }
}
