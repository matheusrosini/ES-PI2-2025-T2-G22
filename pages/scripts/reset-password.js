// Feito por Matheus Rosini e Leonardo
import { apiPost } from './api.js';

function getQuery() {
  const q = new URLSearchParams(window.location.search);
  return {
    token: q.get('token') || '',
    email: q.get('email') || ''
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const { token, email } = getQuery();

  const form = document.getElementById('resetForm');
  const tokenInput = document.getElementById('token');
  const emailInput = document.getElementById('email');
  const enviarLinkBtn = document.getElementById('enviarLinkBtn');

  if (tokenInput) tokenInput.value = token;
  if (emailInput && email) emailInput.value = decodeURIComponent(email);

  if (!form) return;

  // Handler para enviar link de recuperação
  if (enviarLinkBtn) {
    enviarLinkBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const emailValue = emailInput ? emailInput.value.trim() : '';
      
      if (!emailValue) {
        return alert('Digite o e-mail cadastrado para receber o link de recuperação.');
      }

      try {
        const res = await apiPost('/auth/forgot-password', { email: emailValue });
        alert(res.message || 'Se o e-mail estiver cadastrado, você receberá instruções.');
      } catch (err) {
        console.error(err);
        alert(err.message || 'Erro ao solicitar recuperação de senha.');
      }
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const body = {
      token: tokenInput.value.trim(),
      email: emailInput.value.trim(),
      senha: form.senha.value.trim()
    };

    if (!body.token || !body.email || !body.senha) {
      return alert('Preencha todos os campos.');
    }

    try {
      const res = await apiPost('/auth/reset-password', body);
      alert(res.message || 'Senha redefinida com sucesso. Faça login.');
      window.location.href = 'index.html';
    } catch (err) {
      console.error(err);
      alert(err.message || 'Erro ao redefinir senha.');
    }
  });
});
