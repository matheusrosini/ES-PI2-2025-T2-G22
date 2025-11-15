// recuperacao-senha.js

const form = document.getElementById('recuperacaoForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = form.email.value.trim();

  if (!email) {
    alert('Digite um e-mail válido.');
    return;
  }

  // Aqui você chamaria a API real de recuperação de senha
  // Para fins de demonstração, só exibimos um alerta
  alert(`Um link de recuperação foi enviado para ${email}.`);

  form.reset();
});
