// Ativa os ícones Lucide (se existirem)
if (window.lucide && lucide.createIcons) {
  lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', () => {
  const formDisciplina = document.getElementById('form-disciplina');
  const tabela = document.querySelector('.list-section tbody');

  // 🟢 Delegação de eventos para excluir (funciona para linhas existentes + novas)
  tabela.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
      alert('Confirmação de exclusão enviada por e-mail.');
      e.target.closest('tr').remove();
    }
  });

  // 🟢 Adiciona nova disciplina
  formDisciplina.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputs = formDisciplina.querySelectorAll('input');
    const values = Array.from(inputs).map(i => i.value.trim());

    if (values.some(v => v === '')) {
      alert('Preencha todos os campos!');
      return;
    }

    const novaLinha = document.createElement('tr');
    novaLinha.innerHTML = `
      <td>${values[0]}</td>
      <td>${values[1]}</td>
      <td>${values[2]}</td>
      <td>${values[3]}</td>
      <td>
        <button class="edit">Editar</button>
        <button class="delete">Excluir</button>
      </td>
    `;

    tabela.appendChild(novaLinha);

    formDisciplina.reset();
  });
});
