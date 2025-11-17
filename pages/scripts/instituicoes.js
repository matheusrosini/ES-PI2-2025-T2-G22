// Ativa os ícones Lucide (se existirem)
if (window.lucide && lucide.createIcons) {
  lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', () => {
  const formInstituicao = document.getElementById('form-instituicao');
  const tabela = document.querySelector('.list-section tbody');

  // 🟢 Adiciona nova instituição
  formInstituicao.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = formInstituicao.querySelector('input');
    const nome = input.value.trim();

    if (!nome) {
      alert('Digite o nome da instituição!');
      return;
    }

    const novaLinha = document.createElement('tr');
    novaLinha.innerHTML = `
      <td>${nome}</td>
      <td>
        <button class="edit">Editar</button>
        <button class="delete">Excluir</button>
      </td>
    `;
    tabela.appendChild(novaLinha);
    formInstituicao.reset();
  });

  // 🧨 Delegação de eventos para excluir (funciona para linhas novas e antigas)
  tabela.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
      if (confirm('Deseja realmente excluir esta instituição?')) {
        e.target.closest('tr').remove();
      }
    }
  });
});
