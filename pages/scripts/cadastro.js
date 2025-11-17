// Feito por Matheus Rosini
import { register } from './auth.js';

const form = document.getElementById('cadastroForm');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const telefone = form.telefone.value.trim();
    const senha = form.senha.value.trim();

    if (!nome || !email || !senha) {
      alert('Nome, email e senha são obrigatórios.');
      return;
    }

    try {
      // O endpoint /auth/register retorna provavelmente token e user,
      // então mantemos a mesma expectativa.
      const { user, token } = await register(nome, email, senha, telefone);

      if (token) {
        localStorage.setItem('usuarioId', user.id);
        localStorage.setItem('token', token);
        alert("Conta criada com sucesso!");
        window.location.href = "dashboard.html";
      } else {
        // Caso o backend retorne apenas message, tratar genericamente:
        alert('Conta criada com sucesso! Faça login para continuar.');
        window.location.href = "index.html";
      }
    } catch (err) {
      console.error('Erro no cadastro:', err);
      alert(err.message || 'Erro ao criar conta. Tente novamente.');
    }
  });
}
