const API_URL = "https://es-pi2-2025-t2-g22-production-b5bc.up.railway.app/api";

/**
 * Faz login do usuário
 * @param {string} email
 * @param {string} senha
 * @returns {Promise<Object>} Retorna objeto { user, token } ou erro
 */
export async function login(email, senha) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message);
    return data;

  } catch (err) {
    console.error("Erro no login:", err.message);
    throw err;
  }
}

/**
 * Faz registro do usuário
 * @param {string} nome
 * @param {string} email
 * @param {string} senha
 * @param {string} telefone
 * @returns {Promise<Object>} Retorna mensagem de sucesso ou erro
 */
export async function register(nome, email, senha, telefone = "") {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha, telefone })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message);
    return data;

  } catch (err) {
    console.error("Erro no registro:", err.message);
    throw err;
  }
}
