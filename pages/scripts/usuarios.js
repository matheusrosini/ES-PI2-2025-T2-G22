// ===============================
//  USUÁRIOS - INTEGRAÇÃO COM API
// ===============================

import { apiGet, apiPost, apiPut, apiDelete } from "./api.js";

lucide.createIcons();

const tabelaUsuarios = document.getElementById("tabela-usuarios")?.querySelector("tbody");
const salvarUsuarioBtn = document.getElementById("salvarUsuarioBtn");

let usuarios = [];
let editingUsuarioId = null;

/* ========================
      CARREGAR USUÁRIOS
======================== */
async function carregarUsuarios() {
  try {
    usuarios = await apiGet("/usuario");
    renderUsuarios();
  } catch (err) {
    console.error(err);
    showAlert("Erro ao carregar usuários.");
  }
}

/* ========================
        RENDER TABELA
======================== */
function renderUsuarios() {
  if (!tabelaUsuarios) return;

  tabelaUsuarios.innerHTML = "";

  usuarios.forEach((u) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.nome}</td>
      <td>${u.email}</td>
      <td>${u.telefone || "-"}</td>
      <td>
        <button class="edit-btn" data-id="${u.id}">Editar</button>
        <button class="delete-btn" data-id="${u.id}">Excluir</button>
      </td>
    `;
    tabelaUsuarios.appendChild(tr);
  });
}

/* ========================
     CRIAR / EDITAR
======================== */
salvarUsuarioBtn?.addEventListener("click", async () => {
  const nome = document.getElementById("nomeUsuario").value.trim();
  const email = document.getElementById("emailUsuario").value.trim();
  const telefone = document.getElementById("telefoneUsuario").value.trim();
  const senha = document.getElementById("senhaUsuario").value.trim();

  if (!nome || !email || (!editingUsuarioId && !senha)) {
    showAlert("Preencha os campos obrigatórios.");
    return;
  }

  const data = { nome, email, telefone, senha };

  try {
    if (editingUsuarioId) {
      await apiPut(`/usuario/${editingUsuarioId}`, data);
      showAlert("Usuário atualizado.");
    } else {
      await apiPost("/usuario", data);
      showAlert("Usuário criado.");
    }

    closeModal(modalUsuario);
    carregarUsuarios();
  } catch (err) {
    console.error(err);
    showAlert("Erro ao salvar usuário.");
  }
});

/* ========================
       EXCLUIR USUÁRIO
======================== */
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.dataset.id;

    confirmAction("Excluir usuário?", async () => {
      try {
        await apiDelete(`/usuario/${id}`);
        carregarUsuarios();
      } catch (err) {
        console.error(err);
        showAlert("Erro ao excluir.");
      }
    });
  }
});

/* ========================
       EDITAR USUÁRIO
======================== */
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-btn")) {
    const id = e.target.dataset.id;
    const user = usuarios.find((u) => u.id == id);

    if (!user) return;

    editingUsuarioId = user.id;

    document.getElementById("modalUsuarioTitle").textContent = "Editar Usuário";
    document.getElementById("nomeUsuario").value = user.nome;
    document.getElementById("emailUsuario").value = user.email;
    document.getElementById("telefoneUsuario").value = user.telefone;
    document.getElementById("senhaUsuario").value = ""; // não mostrar senha

    openModal(modalUsuario);
  }
});

/* ========================
     INICIALIZAÇÃO
======================== */
carregarUsuarios();
