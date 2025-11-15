// turmas.js

lucide.createIcons();

const formTurma = document.getElementById('form-turma');
const tabela = document.getElementById('tabela-turmas').querySelector('tbody');
const selectDisciplina = document.getElementById('select-disciplina');

// Exemplo: disciplinas disponíveis (pode vir da API)
const disciplinas = [
  "Engenharia de Software",
  "Matemática",
  "Banco de Dados",
  "Física"
];

// Preenche select de disciplinas
disciplinas.forEach(d => {
  const option = document.createElement('option');
  option.value = d;
  option.textContent = d;
  selectDisciplina.appendChild(option);
});

// Evento para criar nova turma
formTurma.addEventListener('submit', (e) => {
  e.preventDefault();

  const disciplina = selectDisciplina.value;
  const nomeTurma = document.getElementById('nome-turma').value.trim();
  const periodo = document.getElementById('periodo').value;

  if (!disciplina || !nomeTurma || !periodo) return;

  const novaLinha = document.createElement('tr');
  novaLinha.innerHTML = `
    <td>${disciplina}</td>
    <td>${nomeTurma}</td>
    <td>${periodo}</td>
    <td>
      <button class="edit-btn">Editar</button>
      <button class="delete-btn">Excluir</button>
    </td>
  `;
  tabela.appendChild(novaLinha);

  formTurma.reset();
});

// Função para excluir turma
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    e.target.closest('tr').remove();
  }
});
