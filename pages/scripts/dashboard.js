import { getInstituicoes, addInstituicao, getDisciplinas, addDisciplina, addTurma } from './api.js';

// ---- INICIALIZA ÍCONES LUCIDE ----
lucide.createIcons();

// ---- SEÇÃO 1: Instituição e Curso ----
const formInstituicao = document.getElementById('form-instituicao');
formInstituicao.addEventListener('submit', async (e) => {
  e.preventDefault();
  const [nomeInput, cursoInput] = formInstituicao.querySelectorAll('input');
  const nome = nomeInput.value.trim();
  const curso = cursoInput.value.trim();

  if (!nome || !curso) return alert('Preencha todos os campos!');

  try {
    await addInstituicao({ nome, curso });
    alert('Instituição adicionada com sucesso!');
    formInstituicao.reset();
  } catch (err) {
    console.error(err);
    alert('Erro ao adicionar instituição.');
  }
});

// ---- SEÇÃO 2: Disciplina ----
const formDisciplina = document.getElementById('form-disciplina');
formDisciplina.addEventListener('submit', async (e) => {
  e.preventDefault();
  const inputs = formDisciplina.querySelectorAll('input, select');
  const disciplina = {
    nome: inputs[0].value.trim(),
    sigla: inputs[1].value.trim(),
    codigo: inputs[2].value.trim(),
    periodo: inputs[3].value
  };

  if (!disciplina.nome || !disciplina.sigla || !disciplina.codigo || !disciplina.periodo) return alert('Preencha todos os campos!');

  try {
    await addDisciplina(disciplina);
    alert('Disciplina cadastrada com sucesso!');
    formDisciplina.reset();
  } catch (err) {
    console.error(err);
    alert('Erro ao cadastrar disciplina.');
  }
});

// ---- SEÇÃO 3: Turma ----
const formTurma = document.getElementById('form-turma');
formTurma.addEventListener('submit', async (e) => {
  e.preventDefault();
  const selects = formTurma.querySelectorAll('select');
  const inputTurma = formTurma.querySelector('input');
  const turma = {
    disciplina: selects[0].value,
    nome: inputTurma.value.trim(),
    periodo: selects[1].value
  };

  if (!turma.disciplina || !turma.nome || !turma.periodo) return alert('Preencha todos os campos!');

  try {
    await addTurma(turma);
    alert('Turma criada com sucesso!');
    formTurma.reset();
  } catch (err) {
    console.error(err);
    alert('Erro ao criar turma.');
  }
});

// ---- TOGGLE SECTIONS ----
document.querySelectorAll('.section-header .toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const section = toggle.closest('.form-section');
    const content = section.querySelector('.section-content');
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
  });
});

// ---- MODAL ----
const modal = document.getElementById('modal');
document.querySelectorAll('.delete').forEach(btn => {
  btn.addEventListener('click', () => {
    modal.style.display = 'flex';
  });
});
document.getElementById('fechar-modal').addEventListener('click', () => {
  modal.style.display = 'none';
});
