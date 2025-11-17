// ===============================
//  TURMAS - INTEGRAÇÃO COM API
// ===============================

import { apiGet, apiPost, apiPut, apiDelete } from "./api.js";

let turmas = [];
let editingTurmaId = null;


  if (window.lucide && lucide.createIcons) {
  lucide.createIcons();
}

/* ========================
    CARREGAR TURMAS
======================== */
async function carregarTurmas() {
  try {
    turmas = await apiGet("/turma");
    renderTurmas();
  } catch (err) {
    console.error("Erro ao carregar turmas:", err);
    showAlert("Erro ao carregar turmas.");
  }
}

/* ========================
      RENDER DA TABELA
======================== */
function renderTurmas() {
  tabelaTurmasBody.innerHTML = "";

  if (turmas.length === 0) {
    semTurmasMsg.style.display = "block";
    return;
  }


  semTurmasMsg.style.display = "none";

  turmas.forEach((t) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${escapeHtml(t.nome)}</td>
      <td>${escapeHtml(t.codigo)}</td>
      <td>${escapeHtml(t.periodo)}</td>
      <td>${escapeHtml(t.disciplina_nome || "")}</td>
      <td></td>
    `;

    const actionsTd = tr.querySelector("td:last-child");

    const btnDetalhes = createBtn("Detalhes", "small");
    btnDetalhes.addEventListener("click", () => openDetalhes(t.id));

    const btnEditar = createBtn("Editar", "small");
    btnEditar.classList.add("secondary");
    btnEditar.addEventListener("click", () => openEditTurma(t.id));

    const btnDel = createBtn("Excluir", "small");
    btnDel.classList.add("danger");
    btnDel.addEventListener("click", () =>
      confirmAction(`Excluir turma "${t.nome}"?`, () => excluirTurma(t.id))
    );

    const div = document.createElement("div");
    div.className = "actions";
    div.appendChild(btnDetalhes);
    div.appendChild(btnEditar);
    div.appendChild(btnDel);

    actionsTd.appendChild(div);
    tabelaTurmasBody.appendChild(tr);
  });
}

/* ========================
  SALVAR (CRIAR / EDITAR)
======================== */
salvarTurmaBtn.addEventListener("click", async () => {
  const nome = document.getElementById("nomeTurma").value.trim();
  const codigo = document.getElementById("codigoTurma").value.trim();
  const periodo = document.getElementById("turnoTurma").value;
  const disciplina = document.getElementById("disciplinaTurma").value.trim();

  if (!nome || !codigo || !periodo || !disciplina) {
    showAlert("Preencha todos os campos.");
    return;
  }

  const data = {
    nome,
    codigo,
    periodo,
    disciplina_id: disciplina,
  };

  try {
    if (editingTurmaId) {
      await apiPut(`/turma/${editingTurmaId}`, data);
      showAlert("Turma atualizada.");
    } else {
      await apiPost("/turma", data);
      showAlert("Turma cadastrada.");
    }

    closeModal(modalTurma);
    carregarTurmas();

  } catch (err) {
    console.error(err);
    showAlert("Erro ao salvar turma.");
  }
});

/* ========================
       EXCLUIR TURMA
======================== */
async function excluirTurma(id) {
  try {
    await apiDelete(`/turma/${id}`);
    carregarTurmas();
  } catch (err) {
    console.error(err);
    showAlert("Erro ao excluir turma.");
  }
}

/* ========================
      EDITAR TURMA
======================== */
function openEditTurma(id) {
  const t = turmas.find((x) => x.id === id);
  if (!t) return showAlert("Turma não encontrada.");

  editingTurmaId = id;

  document.getElementById("modalTurmaTitle").textContent = "Editar Turma";
  document.getElementById("nomeTurma").value = t.nome;
  document.getElementById("codigoTurma").value = t.codigo;
  document.getElementById("turnoTurma").value = t.periodo;
  document.getElementById("disciplinaTurma").value = t.disciplina_id;

  openModal(modalTurma);
}

/* ========================
    DETALHES / ALUNOS
======================== */
async function openDetalhes(id) {
  try {
    const alunos = await apiGet(`/aluno/turma/${id}`);

    detalhesTitle.textContent = "Alunos";
    renderAlunosModal({ alunos, id });

    openModal(modalDetalhes);
  } catch (err) {
    console.error(err);
    showAlert("Erro ao carregar alunos.");
  }
}

/* ========================
  INICIALIZAÇÃO
======================== */
carregarTurmas();

