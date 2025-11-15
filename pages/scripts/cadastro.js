// cadastro.js
import { register } from './auth.js';

const form = document.getElementById('cadastroForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = form.nome.value.trim();
  const email = form.email.value.trim();
  const telefone = form.telefone.value.trim();
  const senha = form.senha.value.trim();

  try {
    // chama função de registro do auth.js
    const { user, token } = await register({ nome, email, telefone, senha });

    // armazena token e ID do usuário
    localStorage.setItem('usuarioId', user.id);
    localStorage.setItem('token', token);

    alert("Conta criada com sucesso!");
    window.location.href = "dashboard.html";
  } catch (err) {
    console.error(err);
    alert(err.message || "Erro ao criar conta. Tente novamente.");
  }
});
