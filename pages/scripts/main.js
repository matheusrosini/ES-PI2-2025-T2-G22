// main.js
import { login } from './auth.js';

// ===== LOGIN =====
const form = document.getElementById('loginForm');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const senha = form.senha.value.trim();

    try {
      const { user, token } = await login(email, senha);

      localStorage.setItem('usuarioId', user.id);
      localStorage.setItem('token', token);

      alert("Login efetuado com sucesso!");
      window.location.href = "dashboard.html";

    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao tentar logar. Tente novamente.");
    }
  });
}

// ===== LOGOUT =====
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuarioId');
  window.location.href = 'index.html';
}

// Ativa botão de logout se existir
const logoutBtn = document.querySelector('.logout a') || document.querySelector('a[href="index.html"]');
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}

// ===== CHECAR LOGIN =====
export function checarLogin() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
  }
}
