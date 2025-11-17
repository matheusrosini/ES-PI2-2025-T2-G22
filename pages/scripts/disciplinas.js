// Feito por Leonardo

import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete
} from "./api.js";

// Funções específicas
async function getInstituicoes() {
  return apiGet("/instituicoes");
}

async function getDisciplinas() {
  return apiGet("/disciplinas");
}

async function addDisciplina(data) {
  return apiPost("/disciplinas", data);
}

// Ativa ícones Lucide
if (window.lucide && lucide.createIcons) lucide.createIcons();

// ------------------------ ELEMENTOS ------------------------
const form = document.getElementById("form-disciplina");
const tbody = document.getElementById("disciplinas-tbody");
const semDisciplinasMsg = document.getElementById("semDisciplinasMsg");

const inputNome = document.getElementById("disc-nome");
const inputSigla = document.getElementById("disc-sigla");
const inputCodigo = document.getElementById("disc-codigo");
const inputPeriodo = document.getElementById("disc-periodo");
const selectInstituicao = document.getElementById("disc-instituicao");

const fetchInstituicoes = (typeof getInstituicoes === "function")
  ? getInstituicoes
  : () => apiGet("/instituicoes");

// Carrega tudo no início
document.addEventListener("DOMContentLoaded", () => {
  carregarInstituicoes();
  carregarDisciplinas();
});

function showAlert(msg) {
  alert(msg);
}

function clearForm() {
  inputNome.value = "";
  inputSigla.value = "";
  inputCodigo.value = "";
  inputPeriodo.value = "";
  selectInstituicao.value = "";
}

// proteção básica XSS
function escapeHtml(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ------------------------ INSTITUIÇÕES ------------------------
async function carregarInstituicoes() {
  try {
    const insts = await fetchInstituicoes();
    const list = Array.isArray(insts) ? insts : (insts.data || insts.result || []);
    selectInstituicao.innerHTML = `<option value="">Selecione a instituição</option>`;

    list.forEach(i => {
      const opt = document.createElement("option");
      opt.value = i.id;
      opt.textContent = i.nome || i.instituicao || `Instituição ${i.id}`;
      selectInstituicao.appendChild(opt);
    });

    if (list.length === 0) {
      selectInstituicao.innerHTML = `<option value="">Nenhuma instituição disponível</option>`;
    }
  } catch (err) {
    console.error("Erro ao carregar instituições:", err);
    selectInstituicao.innerHTML = `<option value="">Erro ao carregar instituições</option>`;
  }
}

// ------------------------ DISCIPLINAS ------------------------
async function carregarDisciplinas() {
  try {
    const disciplinas = await getDisciplinas();
    const list = Array.isArray(disciplinas) ? disciplinas : (disciplinas.data || []);
    renderDisciplinas(list || []);
  } catch (err) {
    console.error("Erro ao carregar disciplinas:", err);
    showAlert("Erro ao carregar disciplinas.");
  }
}

function renderDisciplinas(list) {
  tbody.innerHTML = "";

  if (!list || list.length === 0) {
    semDisciplinasMsg.style.display = "block";
    return;
  }

  semDisciplinasMsg.style.display = "none";

  list.forEach(d => {
    const nome = d.nome || d.NOME || "";
    const sigla = d.sigla || d.SIGLA || "";
    const codigo = d.codigo || d.CODIGO || "";
    const periodo = d.periodo || d.PERIODO || "";
    const instituicao = d.instituicao || d.INSTITUICAO || "";

    const id = d.id || d.ID;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(nome)}</td>
      <td>${escapeHtml(sigla)}</td>
      <td>${escapeHtml(codigo)}</td>
      <td>${escapeHtml(periodo)}</td>
      <td>${escapeHtml(instituicao)}</td>
      <td>
        <button class="btn-edit" data-id="${id}">Editar</button>
        <button class="btn-delete" data-id="${id}">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ------------------------ CRIAR DISCIPLINA ------------------------
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = inputNome.value.trim();
  const sigla = inputSigla.value.trim();
  const codigo = inputCodigo.value.trim();
  const periodo = inputPeriodo.value.trim();
  const instituicao_id = selectInstituicao.value;

  if (!nome || !sigla || !codigo || !periodo || !instituicao_id) {
    return showAlert("Preencha todos os campos e selecione a instituição.");
  }

  const payload = { nome, sigla, codigo, periodo, instituicao_id: Number(instituicao_id) };

  try {
    await addDisciplina(payload);
    showAlert("Disciplina cadastrada com sucesso.");
    clearForm();
    carregarDisciplinas();
  } catch (err) {
    console.error("Erro ao cadastrar disciplina:", err);
    showAlert("Erro ao cadastrar disciplina.");
  }
});

// ------------------------ EDITAR / EXCLUIR ------------------------
tbody.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  // ---------------- EXCLUIR ----------------
  if (e.target.classList.contains("btn-delete")) {
    if (!confirm("Deseja realmente excluir esta disciplina?")) return;

    try {
      await apiDelete(`/disciplinas/${id}`);
      showAlert("Disciplina excluída.");
      carregarDisciplinas();
    } catch (err) {
      console.error("Erro ao excluir disciplina:", err);
      showAlert("Erro ao excluir disciplina.");
    }
  }

  // ---------------- EDITAR ----------------
  if (e.target.classList.contains("btn-edit")) {
    const tr = e.target.closest("tr");

    const curNome = tr.children[0].textContent;
    const curSigla = tr.children[1].textContent;
    const curCodigo = tr.children[2].textContent;
    const curPeriodo = tr.children[3].textContent;
    const curInstituicaoTxt = tr.children[4].textContent || "";

    const novoNome = prompt("Nome da disciplina:", curNome);
    if (novoNome === null) return;

    const novaSigla = prompt("Sigla:", curSigla);
    if (novaSigla === null) return;

    const novoCodigo = prompt("Código:", curCodigo);
    if (novoCodigo === null) return;

    const novoPeriodo = prompt("Período:", curPeriodo);
    if (novoPeriodo === null) return;

    // Obter lista atual de instituições
    const instituicoes = Array.from(selectInstituicao.options)
      .filter(o => o.value)
      .map(o => ({ id: Number(o.value), nome: o.textContent }));

    // Tentar identificar a instituição atual
    const instituicaoAtualObj = instituicoes.find(i => i.nome === curInstituicaoTxt);
    const instituicaoAtualId = instituicaoAtualObj ? instituicaoAtualObj.id : null;

    // GARANTIA: se não achar, NÃO perde a instituição
    let novaInstId = instituicaoAtualId;

    const mudarInst = confirm("Deseja alterar a instituição? (OK = Sim, Cancel = Não)");
    if (mudarInst) {
      const options = instituicoes.map(o => `${o.id}: ${o.nome}`).join("\n");

      const escolha = prompt(
        `Digite o ID da nova instituição:\n${options}`,
        instituicaoAtualId ? String(instituicaoAtualId) : ""
      );

      if (escolha === null) return;

      const numero = Number(escolha.trim());
      if (!Number.isFinite(numero) || numero <= 0) {
        showAlert("ID de instituição inválido. Edição cancelada.");
        return;
      }

      novaInstId = numero;
    }

    const payload = {
      nome: novoNome.trim(),
      sigla: novaSigla.trim(),
      codigo: novoCodigo.trim(),
      periodo: novoPeriodo.trim(),
      instituicao_id: novaInstId // <- SEMPRE manda um ID válido
    };

    try {
      await apiPut(`/disciplinas/${id}`, payload);
      showAlert("Disciplina atualizada.");
      carregarDisciplinas();
    } catch (err) {
      console.error("Erro ao atualizar disciplina:", err);
      showAlert("Erro ao atualizar disciplina.");
    }
  }
});
