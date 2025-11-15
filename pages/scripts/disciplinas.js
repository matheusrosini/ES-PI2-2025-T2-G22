// Ativa os ícones Lucide
lucide.createIcons();

// Função para lidar com exclusão de disciplinas
document.addEventListener('DOMContentLoaded', () => {
  const deleteButtons = document.querySelectorAll('.delete');
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      alert('Confirmação de exclusão enviada por e-mail.');
    });
  });

  const formDisciplina = document.getElementById('form-disciplina');
  const tabela = document.querySelector('.list-section tbody');

  // Adiciona nova disciplina na tabela
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

    // Reaplica o evento de exclusão ao novo botão
    novaLinha.querySelector('.delete').addEventListener('click', () => {
      alert('Confirmação de exclusão enviada por e-mail.');
      novaLinha.remove();
    });

    formDisciplina.reset();
  });
});
