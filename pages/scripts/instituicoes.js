// Ativa os ícones Lucide
lucide.createIcons();

document.addEventListener('DOMContentLoaded', () => {
  const formInstituicao = document.getElementById('form-instituicao');
  const tabela = document.querySelector('.list-section tbody');

  // Adiciona nova instituição na tabela
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

    // Evento para o botão de exclusão
    novaLinha.querySelector('.delete').addEventListener('click', () => {
      if (confirm('Deseja realmente excluir esta instituição?')) {
        novaLinha.remove();
      }
    });

    formInstituicao.reset();
  });

  // Eventos para botões de exclusão existentes
  const deleteButtons = document.querySelectorAll('.delete');
  deleteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Deseja realmente excluir esta instituição?')) {
        btn.closest('tr').remove();
      }
    });
  });
});
