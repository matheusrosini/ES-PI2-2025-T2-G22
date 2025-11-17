// pages/scripts/turmas.js
// Frontend para turmas: carrega instituições -> disciplinas -> aplicar filtro -> lista turmas
import { apiGet, apiPost, apiPut, apiDelete } from "./api.js";

// DOM elements
const selectInstituicao = document.getElementById("selectInstituicao");
const selectDisciplina = document.getElementById("selectDisciplina");
const btnAplicarFiltro = document.getElementById("btnAplicarFiltro");
const listaContainer = document.getElementById("lista-container");
const tabelaBody = document.querySelector("#tabela-turmas tbody");
const semTurmasMsg = document.getElementById("semTurmasMsg");

const novaTurmaBtn = document.getElementById("novaTurmaBtn");
const modalTurma = document.getElementById("modalTurma");
const closeModalTurma = document.getElementById("closeModalTurma");
const modalTitle = document.getElementById("modalTurmaTitle");
const nomeTurmaInput = document.getElementById("nomeTurma");
const codigoTurmaInput = document.getElementById("codigoTurma");
const turnoTurmaInput = document.getElementById("turnoTurma");
const disciplinaTurmaSelect = document.getElementById("disciplinaTurma");
const salvarTurmaBtn = document.getElementById("salvarTurmaBtn");
const cancelarTurmaBtn = document.getElementById("cancelarTurmaBtn");

let disciplinasCache = []; // todas disciplinas carregadas
let turmasCache = []; // turmas exibidas
let editingId = null;

if (window.lucide && lucide.createIcons) lucide.createIcons();

// helpers
function showAlert(msg) { alert(msg); }
function escapeHtml(s){ if (s == null) return ""; return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"); }
function openModal() { modalTurma.classList.add("open"); }
function closeModal() { modalTurma.classList.remove("open"); }

// load institutions
async function carregarInstituicoes() {
  try {
    const insts = await apiGet("/instituicoes");
    const list = Array.isArray(insts) ? insts : (insts.data || []);
    selectInstituicao.innerHTML = `<option value="">Selecione...</option>`;
    list.forEach(i => {
      const opt = document.createElement("option");
      opt.value = i.id || i.ID;
      opt.textContent = i.nome || i.NOME || `Instituição ${i.id}`;
      selectInstituicao.appendChild(opt);
    });
  } catch (err) {
    console.error("Erro ao carregar instituições:", err);
    selectInstituicao.innerHTML = `<option value="">Erro ao carregar</option>`;
  }
}

// load disciplines (all) and cache
async function carregarDisciplinasTotais() {
  try {
    const resp = await apiGet("/disciplinas");
    disciplinasCache = Array.isArray(resp) ? resp : (resp.data || []);
  } catch (err) {
    console.error("Erro ao carregar disciplinas:", err);
    disciplinasCache = [];
  }
}

// populate disciplinas select filtered by instituicao
function popularDisciplinaSelectByInstituicao(instituicaoId, targetSelect) {
  targetSelect.innerHTML = `<option value="">Selecione...</option>`;
  const list = (disciplinasCache || []).filter(d => {
    const idInst = d.instituicao_id || d.INSTITUICAO_ID || d.instituicao_id;
    return instituicaoId ? Number(idInst) === Number(instituicaoId) : true;
  });
  list.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d.id || d.ID;
    opt.textContent = d.nome || d.NOME || `Disciplina ${d.id}`;
    targetSelect.appendChild(opt);
  });
  if (list.length === 0) {
    targetSelect.innerHTML = `<option value="">Nenhuma disciplina disponível</option>`;
  }
}

// aplicar filtro — chama backend
async function aplicarFiltro() {
  try {
    const instituicao_id = selectInstituicao.value;
    const disciplina_id = selectDisciplina.value;

    const params = new URLSearchParams();
    if (instituicao_id) params.append("instituicao_id", instituicao_id);
    if (disciplina_id) params.append("disciplina_id", disciplina_id);

    const turmas = await apiGet("/turmas?" + params.toString());
    turmasCache = Array.isArray(turmas) ? turmas : (turmas.data || []);
    renderTurmas(turmasCache);
    listaContainer.style.display = "block";
  } catch (err) {
    console.error("Erro ao aplicar filtro:", err);
    showAlert("Erro ao carregar turmas.");
  }
}

function renderTurmas(list) {
  tabelaBody.innerHTML = "";
  if (!list || list.length === 0) {
    semTurmasMsg.style.display = "block";
    return;
  }
  semTurmasMsg.style.display = "none";

  list.forEach(t => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(t.nome || t.NOME || "")}</td>
      <td>${escapeHtml(t.codigo || t.CODIGO || "")}</td>
      <td>${escapeHtml(t.periodo || t.PERIODO || "")}</td>
      <td>${escapeHtml(t.disciplina_nome || t.DISCIPLINA_NOME || "")}</td>
      <td>
        <button class="btn small secondary btn-editar" data-id="${t.id || t.ID}">Editar</button>
        <button class="btn small danger btn-excluir" data-id="${t.id || t.ID}">Excluir</button>
      </td>
    `;
    tabelaBody.appendChild(tr);
  });

  // attach handlers
  tabelaBody.querySelectorAll(".btn-editar").forEach(b => b.addEventListener("click", onEditarClick));
  tabelaBody.querySelectorAll(".btn-excluir").forEach(b => b.addEventListener("click", onExcluirClick));
}

// editar
function onEditarClick(e) {
  const id = e.currentTarget.dataset.id;
  const t = turmasCache.find(x => String(x.id) === String(id) || String(x.ID) === String(id));
  if (!t) return showAlert("Turma não encontrada.");

  editingId = id;
  modalTitle.textContent = "Editar Turma";
  nomeTurmaInput.value = t.nome || t.NOME || "";
  codigoTurmaInput.value = t.codigo || t.CODIGO || "";
  turnoTurmaInput.value = t.periodo || t.PERIODO || "";
  // popular disciplinas do mesmo instituicao and set value
  const instId = t.instituicao_id || t.INSTITUICAO_ID || t.instituicao_id;
  popularDisciplinaSelectByInstituicao(instId, disciplinaTurmaSelect);
  disciplinaTurmaSelect.value = t.disciplina_id || t.DISCIPLINA_ID || "";
  openModal();
}

// excluir
async function onExcluirClick(e) {
  const id = e.currentTarget.dataset.id;
  if (!confirm("Deseja realmente excluir esta turma?")) return;
  try {
    await apiDelete(`/turmas/${id}`);
    showAlert("Turma excluída.");
    aplicarFiltro();
  } catch (err) {
    console.error("Erro ao excluir turma:", err);
    showAlert("Erro ao excluir turma.");
  }
}

// nova turma
novaTurmaBtn.addEventListener("click", () => {
  editingId = null;
  modalTitle.textContent = "Cadastrar Turma";
  nomeTurmaInput.value = "";
  codigoTurmaInput.value = "";
  turnoTurmaInput.value = "Manhã";
  // popular disciplinas com base na seleção do filtro (se houver)
  popularDisciplinaSelectByInstituicao(selectInstituicao.value, disciplinaTurmaSelect);
  disciplinaTurmaSelect.value = "";
  openModal();
});

closeModalTurma.addEventListener("click", closeModal);
cancelarTurmaBtn.addEventListener("click", closeModal);

// salvar turma (create ou update)
salvarTurmaBtn.addEventListener("click", async () => {
  const nome = nomeTurmaInput.value.trim();
  const codigo = codigoTurmaInput.value.trim();
  const periodo = turnoTurmaInput.value.trim();
  const disciplina_id = disciplinaTurmaSelect.value;

  if (!nome || !disciplina_id) {
    return showAlert("Preencha nome e selecione disciplina.");
  }

  const payload = { nome, codigo, periodo, disciplina_id: Number(disciplina_id) };

  try {
    if (editingId) {
      await apiPut(`/turmas/${editingId}`, payload);
      showAlert("Turma atualizada.");
    } else {
      await apiPost("/turmas", payload);
      showAlert("Turma criada.");
    }
    closeModal();
    aplicarFiltro();
  } catch (err) {
    console.error("Erro ao salvar turma:", err);
    showAlert("Erro ao salvar turma.");
  }
});

// quando muda instituição no filtro, popular disciplinas do filtro
selectInstituicao.addEventListener("change", () => {
  const instId = selectInstituicao.value;
  popularDisciplinaSelectByInstituicao(instId, selectDisciplina);
});

// aplicar botão
btnAplicarFiltro.addEventListener("click", aplicarFiltro);

// inicialização
(async function init(){
  await carregarInstituicoes();
  await carregarDisciplinasTotais();
  // popular selects inicialmente (sem filtro)
  popularDisciplinaSelectByInstituicao(null, selectDisciplina);
  popularDisciplinaSelectByInstituicao(selectInstituicao.value, disciplinaTurmaSelect);
})();
