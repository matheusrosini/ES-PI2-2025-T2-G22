// Assumindo que apiPost existe em ./api.js
import { apiPost } from './api.js';

const form = document.getElementById('recuperacaoForm');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!email) return alert('Digite o e-mail cadastrado.');

    try {
      const res = await apiPost('/auth/forgot-password', { email });
      alert(res.message || 'Se o e-mail estiver cadastrado, você receberá instruções.');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Erro ao solicitar recuperação de senha.');
    }
  });
}
