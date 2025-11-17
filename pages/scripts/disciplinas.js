// Feito por Leonardo

import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete
} from "./api.js";

// Funções da API específicas
async function getInstituicoes() {
  return apiGet("/instituicoes");
}

async function getDisciplinas() {
  return apiGet("/disciplinas");
}

async function addDisciplina(data) {
  return apiPost("/disciplinas", data);
}



// Ativa Lucide (ícones)
if (window.lucide && lucide.createIcons) lucide.createIcons();

// Elementos
const form = document.getElementById("form-disciplina");
const tbody = document.getElementById("disciplinas-tbody");
const semDisciplinasMsg = document.getElementById("semDisciplinasMsg");

const inputNome = document.getElementById("disc-nome");
const inputSigla = document.getElementById("disc-sigla");
const inputCodigo = document.getElementById("disc-codigo");
const inputPeriodo = document.getElementById("disc-periodo");
const selectInstituicao = document.getElementById("disc-instituicao");

// 
const fetchInstituicoes = (typeof getInstituicoes === "function")
  ? getInstituicoes
  : () => apiGet("/instituicoes");


// Carrega inicialmente
document.addEventListener("DOMContentLoaded", () => {
  carregarInstituicoes();
  carregarDisciplinas();
});

// ---------- helpers ----------
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

// escapando texto simples para evitar XSS básico
function escapeHtml(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ---------- carregar instituições para select ----------
async function carregarInstituicoes() {
  try {
    const insts = await fetchInstituicoes();
    // caso o retorno venha envelopado, lidamos também
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

// ---------- carregar disciplinas ----------
async function carregarDisciplinas() {
  try {
    const disciplinas = await (typeof getDisciplinas === "function" ? getDisciplinas() : apiGet("/disciplinas"));
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
    // o backend aqui retorna a coluna 'instituicao' (i.nome AS instituicao)
    const instituicaoNome = d.instituicao || (d.instituicao_nome) || (d.instituicao?.nome) || "";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(d.nome)}</td>
      <td>${escapeHtml(d.sigla)}</td>
      <td>${escapeHtml(d.codigo)}</td>
      <td>${escapeHtml(d.periodo)}</td>
      <td>${escapeHtml(instituicaoNome)}</td>
      <td>
        <button class="btn-edit" data-id="${d.id}">Editar</button>
        <button class="btn-delete" data-id="${d.id}">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ---------- criar disciplina ----------
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
    if (typeof addDisciplina === "function") {
      await addDisciplina(payload);
    } else {
      // fallback para api generic POST
      await fetch("/disciplinas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).then(r => {
        if (!r.ok) throw new Error("Erro na criação");
        return r.json();
      });
    }

    showAlert("Disciplina cadastrada com sucesso.");
    clearForm();
    carregarDisciplinas();
  } catch (err) {
    console.error("Erro ao cadastrar disciplina:", err);
    showAlert("Erro ao cadastrar disciplina.");
  }
});

// ---------- delegação para editar / excluir ----------
tbody.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  // EXCLUIR
  if (e.target.classList.contains("btn-delete")) {
    if (!confirm("Deseja realmente excluir esta disciplina?")) return;
    try {
      if (typeof apiDelete === "function") {
        await apiDelete(`/disciplinas/${id}`);
      } else {
        const res = await fetch(`/disciplinas/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Erro ao deletar");
      }
      showAlert("Disciplina excluída.");
      carregarDisciplinas();
    } catch (err) {
      console.error("Erro ao excluir disciplina:", err);
      showAlert("Erro ao excluir disciplina.");
    }
  }

  // EDITAR (simples prompts)
  if (e.target.classList.contains("btn-edit")) {
    const tr = e.target.closest("tr");
    const curNome = tr.children[0].textContent;
    const curSigla = tr.children[1].textContent;
    const curCodigo = tr.children[2].textContent;
    const curPeriodo = tr.children[3].textContent;
    const curInstituicaoTxt = tr.children[4].textContent || "";

    const novoNome = prompt("Nome da disciplina:", curNome);
    if (novoNome === null) return; // cancelou
    const novaSigla = prompt("Sigla:", curSigla);
    if (novaSigla === null) return;
    const novoCodigo = prompt("Código:", curCodigo);
    if (novoCodigo === null) return;
    const novoPeriodo = prompt("Período:", curPeriodo);
    if (novoPeriodo === null) return;

    let novaInstId = null;
    const mudarInst = confirm("Deseja alterar a instituição? (OK = Sim, Cancel = Não)");
    if (mudarInst) {
      // mostra opções curtas para o usuário colar o ID
      const options = Array.from(selectInstituicao.options)
        .filter(o => o.value)
        .map(o => `${o.value}: ${o.textContent}`)
        .join("\n");
      const escolha = prompt(`Cole o ID da instituição desejada:\n${options}`, "");
      if (escolha === null) return;
      novaInstId = Number(escolha.trim());
      if (!Number.isFinite(novaInstId) || novaInstId <= 0) {
        showAlert("ID de instituição inválido. Edição cancelada.");
        return;
      }
    }

    const payload = {
      nome: novoNome.trim(),
      sigla: novaSigla.trim(),
      codigo: novoCodigo.trim(),
      periodo: novoPeriodo.trim()
    };
    if (novaInstId) payload.instituicao_id = novaInstId;

    try {
      if (typeof apiPut === "function") {
        await apiPut(`/disciplinas/${id}`, payload);
      } else {
        const res = await fetch(`/disciplinas/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Erro ao atualizar");
      }
      showAlert("Disciplina atualizada.");
      carregarDisciplinas();
    } catch (err) {
      console.error("Erro ao atualizar disciplina:", err);
      showAlert("Erro ao atualizar disciplina.");
    }
  }
});
