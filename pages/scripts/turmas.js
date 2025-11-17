// Feito por Leonardo, Matheus Rosini e Matheus Henrique Portugal Narducci
import { apiGet, apiPost, apiPut, apiDelete } from "./api.js";

let turmas = [];
let editingTurmaId = null;

/* -------------------------
    ELEMENTOS DO HTML
-------------------------- */
const tabelaTurmasBody = document.querySelector("#tabela-turmas tbody");
const semTurmasMsg = document.getElementById("semTurmasMsg");
const salvarTurmaBtn = document.getElementById("salvarTurmaBtn");
const novaTurmaBtn = document.getElementById("novaTurmaBtn");
const modalTurma = document.getElementById("modalTurma");
const closeModalTurma = document.getElementById("closeModalTurma");

const nomeInput = document.getElementById("nomeTurma");
const codigoInput = document.getElementById("codigoTurma");
const turnoInput = document.getElementById("turnoTurma");
const disciplinaInput = document.getElementById("disciplinaTurma");

if (window.lucide) lucide.createIcons();

/* -------------------------
      FUNÇÕES DE MODAL
-------------------------- */
function openModal(modal) {
  modal.classList.add("show");
}

function closeModal(modal) {
  modal.classList.remove("show");
}

closeModalTurma.addEventListener("click", () => closeModal(modalTurma));

/* -------------------------
     CARREGAR DISCIPLINAS
-------------------------- */
async function carregarDisciplinas() {
  try {
    const disciplinas = await apiGet("/disciplina");

    disciplinaInput.innerHTML = `<option value="">Selecione...</option>`;

    disciplinas.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = d.nome;
      disciplinaInput.appendChild(opt);
    });

  } catch (err) {
    console.error("Erro ao carregar disciplinas:", err);
    showAlert("Erro ao carregar disciplinas.");
  }
}

/* -------------------------
     CARREGAR TURMAS
-------------------------- */
async function carregarTurmas() {
  try {
    turmas = await apiGet("/turma");
    renderTurmas();
  } catch (err) {
    console.error(err);
    showAlert("Erro ao carregar turmas.");
  }
}

/* -------------------------
      RENDER DA TABELA
-------------------------- */
function renderTurmas() {
  tabelaTurmasBody.innerHTML = "";

  if (turmas.length === 0) {
    semTurmasMsg.style.display = "block";
    return;
  }

  semTurmasMsg.style.display = "none";

  turmas.forEach(t => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${t.nome}</td>
      <td>${t.codigo}</td>
      <td>${t.periodo}</td>
      <td>${t.disciplina_nome || ""}</td>
      <td>
        <button class="btn small secondary btn-editar" data-id="${t.id}">Editar</button>
        <button class="btn small danger btn-excluir" data-id="${t.id}">Excluir</button>
      </td>
    `;

    tabelaTurmasBody.appendChild(tr);
  });

  document.querySelectorAll(".btn-editar").forEach(btn => {
    btn.addEventListener("click", () => openEditTurma(btn.dataset.id));
  });

  document.querySelectorAll(".btn-excluir").forEach(btn => {
    btn.addEventListener("click", () =>
      excluirTurma(btn.dataset.id)
    );
  });
}

/* -------------------------
   BOTÃO "NOVA TURMA"
-------------------------- */
novaTurmaBtn.addEventListener("click", () => {
  editingTurmaId = null;

  document.getElementById("modalTurmaTitle").textContent = "Cadastrar Turma";
  nomeInput.value = "";
  codigoInput.value = "";
  turnoInput.value = "Manhã";
  disciplinaInput.value = "";

  openModal(modalTurma);
});

/* -------------------------
     SALVAR (CRIAR / EDITAR)
-------------------------- */
salvarTurmaBtn.addEventListener("click", async () => {
  const data = {
    nome: nomeInput.value.trim(),
    codigo: codigoInput.value.trim(),
    periodo: turnoInput.value,
    disciplina_id: parseInt(disciplinaInput.value)
  };

  if (!data.nome || !data.codigo || !data.periodo || !data.disciplina_id) {
    showAlert("Preencha todos os campos.");
    return;
  }

  try {
    if (editingTurmaId) {
      await apiPut(`/turma/${editingTurmaId}`, data);
      showAlert("Turma atualizada!");
    } else {
      await apiPost("/turma", data);
      showAlert("Turma cadastrada!");
    }

    closeModal(modalTurma);
    carregarTurmas();

  } catch (err) {
    console.error(err);
    showAlert("Erro ao salvar turma.");
  }
});

/* -------------------------
        EDITAR TURMA
-------------------------- */
function openEditTurma(id) {
  const t = turmas.find(x => x.id == id);
  if (!t) return showAlert("Turma não encontrada");

  editingTurmaId = id;

  document.getElementById("modalTurmaTitle").textContent = "Editar Turma";

  nomeInput.value = t.nome;
  codigoInput.value = t.codigo;
  turnoInput.value = t.periodo;
  disciplinaInput.value = t.disciplina_id;

  openModal(modalTurma);
}

/* -------------------------
        EXCLUIR
-------------------------- */
async function excluirTurma(id) {
  if (!confirm("Deseja mesmo excluir esta turma?")) return;

  try {
    await apiDelete(`/turma/${id}`);
    showAlert("Turma excluída!");
    carregarTurmas();
  } catch (err) {
    console.error(err);
    showAlert("Erro ao excluir turma.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Seletores de fallback — tenta vários nomes/ids possíveis
  const logoutTrigger =
    document.getElementById("logoutBtn") ||
    document.querySelector('a[data-logout]') ||
    document.querySelector('a[href="#"][id="logoutBtn"]') ||
    document.querySelector('a.logout-link') ||
    document.querySelector('a:contains("Sair")'); // fallback fraco, pode falhar em alguns navegadores

  const modal = document.getElementById("logoutModal");
  const cancelBtn = document.getElementById("logoutCancel") || document.getElementById("cancelLogout");
  const confirmBtn = document.getElementById("logoutConfirm") || document.getElementById("confirmLogout");

  // Segurança: se modal ou trigger não existem, não crashar
  if (!modal) {
    console.warn("logout.js: modal (#logoutModal) não encontrado no DOM.");
    return;
  }

  // Abre o modal ao clicar no link/botão de logout
  if (logoutTrigger) {
    logoutTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      modal.style.display = "flex"; // mostra o modal
    });
  } else {
    // Se não encontrar o trigger, tenta ligar a todos os links 'Sair' por texto (último recurso)
    document.querySelectorAll("a").forEach(a => {
      if (a.textContent.trim().toLowerCase() === "sair") {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          modal.style.display = "flex";
        });
      }
    });
  }

  // Cancelar fecha o modal
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  } else {
    console.warn("logout.js: botão de cancelar não encontrado (logoutCancel/cancelLogout).");
  }

  // Confirmar faz logout real
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      try {
        localStorage.removeItem("token");
      } catch (err) {
        console.warn("Erro ao remover token do localStorage:", err);
      }
      // opcional: também limpar outros dados de sessão
      // localStorage.removeItem('user');
      modal.style.display = "none";
      window.location.href = "index.html";
    });
  } else {
    console.warn("logout.js: botão de confirmar não encontrado (logoutConfirm/confirmLogout).");
  }

  // Fecha o modal se clicar fora da caixa
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});


/* -------------------------
      INICIAR TELA
-------------------------- */
carregarDisciplinas();
carregarTurmas();

