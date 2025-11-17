// Feito por Leonardo
// Import correto (antes importava de './auth.js' por engano)
// main.js
import { login } from './auth.js';
import { apiGet, apiPost } from './api.js';


// ===== LOGIN =====
const form = document.getElementById('loginForm');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const senha = form.senha.value.trim();

    if (!email || !senha) {
      alert('Email e senha são obrigatórios!');
      return;
    }

    try {
      // api.login retorna { user, token } conforme backend
      const { user, token } = await login(email, senha);

      localStorage.setItem('usuarioId', user.id);
      localStorage.setItem('token', token);

      alert(`Bem-vindo, ${user.nome}!`);
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error('Erro no login:', err);
      alert(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    }
  });
}

// ===== LOGOUT =====
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuarioId');
  window.location.href = 'index.html';
}

const logoutBtn = document.getElementById('logoutBtn');
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
