import { apiGet, apiPost, apiPut, apiDelete } from "./api.js";

// DOM elements for the page
const selectInstituicao = document.getElementById("selectInstituicao");
const selectDisciplina = document.getElementById("selectDisciplina");
const selectTurma = document.getElementById("selectTurma");
const btnAplicarFiltro = document.getElementById("btnAplicarFiltro");
const tabelaBody = document.querySelector("#tabela-alunos tbody");
const semAlunosMsg = document.getElementById("semAlunosMsg");

const novoAlunoBtn = document.getElementById("novoAlunoBtn");
const modalAluno = document.getElementById("modalCadastroAluno");
const closeModalAluno = document.getElementById("closeModalAluno");
const alunoNomeInput = document.getElementById("alunoNome");
const alunoMatriculaInput = document.getElementById("alunoMatricula");
const instituicaoAlunoSelect = document.getElementById("instituicaoAluno");
const disciplinaAlunoSelect = document.getElementById("disciplinaAluno");
const turmaAlunoSelect = document.getElementById("turmaAluno");
const salvarAlunoBtn = document.getElementById("salvarAlunoBtn");

// Store data
let instituicoesCache = [];
let disciplinasCache = [];
let turmasCache = [];

// Carregar as Instituições
async function carregarInstituicoes() {
  try {
    const resp = await apiGet("/instituicoes");
    instituicoesCache = resp;
    selectInstituicao.innerHTML = "<option value=''>Selecione...</option>";
    resp.forEach(inst => {
      const option = document.createElement("option");
      option.value = inst.id;
      option.textContent = inst.nome;
      selectInstituicao.appendChild(option);
    });
    
    // Após carregar as instituições, carregar as disciplinas
    selectInstituicao.addEventListener('change', carregarDisciplinas); // Alteração: Garantir que disciplinas sejam carregadas ao selecionar uma instituição.
  } catch (err) {
    console.error("Erro ao carregar instituições:", err);
  }
}

// Carregar as Disciplinas
async function carregarDisciplinas() {
  const instituicaoId = selectInstituicao.value;  // Pegar o id da instituição selecionada
  if (!instituicaoId) return;  // Evitar erro se não houver instituição selecionada.

  try {
    const resp = await apiGet(`/disciplinas?instituicao_id=${instituicaoId}`);
    disciplinasCache = resp;
    selectDisciplina.innerHTML = "<option value=''>Selecione...</option>";
    resp.forEach(disciplina => {
      const option = document.createElement("option");
      option.value = disciplina.id;
      option.textContent = disciplina.nome;
      selectDisciplina.appendChild(option);
    });

    // Após carregar as disciplinas, carregar as turmas
    selectDisciplina.addEventListener('change', carregarTurmas); // Alteração: Garantir que turmas sejam carregadas ao selecionar uma disciplina
  } catch (err) {
    console.error("Erro ao carregar disciplinas:", err);
  }
}

// Carregar as Turmas para a Instituição e Disciplina selecionadas
async function carregarTurmas() {
  const instituicaoId = selectInstituicao.value;
  const disciplinaId = selectDisciplina.value;

  if (!instituicaoId || !disciplinaId) return;  // Garantir que há instituição e disciplina selecionadas.

  try {
    const params = new URLSearchParams();
    params.append("instituicao_id", instituicaoId);
    params.append("disciplina_id", disciplinaId);

    const turmas = await apiGet(`/turmas?${params.toString()}`);
    turmasCache = turmas;

    selectTurma.innerHTML = "<option value=''>Selecione...</option>";
    turmas.forEach(turma => {
      const option = document.createElement("option");
      option.value = turma.id;
      option.textContent = turma.nome;
      selectTurma.appendChild(option);
    });
  } catch (err) {
    console.error("Erro ao carregar turmas:", err);
  }
}

// Carregar alunos com base nos filtros
async function carregarAlunos() {
  const instituicaoId = selectInstituicao.value;
  const disciplinaId = selectDisciplina.value;
  const turmaId = selectTurma.value;

  try {
    const params = new URLSearchParams();
    if (instituicaoId) params.append("instituicao_id", instituicaoId);
    if (disciplinaId) params.append("disciplina_id", disciplinaId);
    if (turmaId) params.append("turma_id", turmaId);

    const alunos = await apiGet(`/alunos?${params.toString()}`);
    tabelaBody.innerHTML = "";

    if (alunos.length === 0) {
      semAlunosMsg.style.display = "block";
    } else {
      semAlunosMsg.style.display = "none";
    }

    alunos.forEach(aluno => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(aluno.nome)}</td>
        <td>${escapeHtml(aluno.matricula)}</td>
        <td>
          <button class="btn small secondary btn-editar" data-id="${aluno.id}">Editar</button>
          <button class="btn small danger btn-excluir" data-id="${aluno.id}">Excluir</button>
        </td>
      `;
      tabelaBody.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao carregar alunos:", err);
  }
}

// Exibir o modal para adicionar aluno
novoAlunoBtn.addEventListener("click", () => {
  alunoNomeInput.value = "";
  alunoMatriculaInput.value = "";
  openModal();
});

// Abrir modal
function openModal() {
  modalAluno.classList.add("show");
}

// Fechar modal
closeModalAluno.addEventListener("click", () => {
  modalAluno.classList.remove("show");
});

// Salvar novo aluno
salvarAlunoBtn.addEventListener("click", async () => {
  const nome = alunoNomeInput.value.trim();
  const matricula = alunoMatriculaInput.value.trim();
  const instituicao_id = instituicaoAlunoSelect.value;
  const disciplina_id = disciplinaAlunoSelect.value;
  const turma_id = turmaAlunoSelect.value;

  if (!nome || !matricula || !instituicao_id || !disciplina_id || !turma_id) {
    alert("Todos os campos são obrigatórios.");
    return;
  }

  try {
    const alunoData = { nome, matricula, instituicao_id, disciplina_id, turma_id };
    await apiPost("/alunos", alunoData);
    alert("Aluno cadastrado com sucesso!");
    modalAluno.classList.remove("show");
    carregarAlunos(); // Recarregar a lista de alunos
  } catch (err) {
    console.error("Erro ao salvar aluno:", err);
    alert("Erro ao cadastrar aluno.");
  }
});

// Aplicar filtro
btnAplicarFiltro.addEventListener("click", carregarAlunos);

// Inicializar a página
(async function init() {
  await carregarInstituicoes();
  carregarAlunos(); // Carregar alunos após as instituições
})();
