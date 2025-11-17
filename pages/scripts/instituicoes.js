// Feito por Leonardo

import { apiGet, apiPost, apiPut, apiDelete } from "./api.js";

const API_PATH = "/instituicoes";

// Wrappers corretos
async function addInstituicao(data) {
  return apiPost(API_PATH, data);
}

async function getInstituicoes() {
  return apiGet(API_PATH);
}

async function deleteInstituicao(id) {
  return apiDelete(`${API_PATH}/${id}`);
}

async function updateInstituicao(id, data) {
  return apiPut(`${API_PATH}/${id}`, data);
}


const formInstituicao = document.getElementById("form-instituicao");

// Ativar ícones Lucide
if (window.lucide && lucide.createIcons) {
  lucide.createIcons();
}

// =====================
// CADASTRAR INSTITUIÇÃO
// =====================
formInstituicao.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome-instituicao").value.trim();

  if (!nome) return alert("Preencha o nome da instituição!");

  try {
    await addInstituicao({ nome });
    alert("Instituição adicionada com sucesso!");
    formInstituicao.reset();
    carregarInstituicoes();
  } catch (err) {
    console.error(err);
    alert("Erro ao adicionar instituição.");
  }
});

// =====================
// CARREGAR LISTA
// =====================
async function carregarInstituicoes() {
  try {
    const instituicoes = await getInstituicoes();

    const tbody = document.querySelector(".list-section tbody");
    tbody.innerHTML = "";

    instituicoes.forEach((i) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${i.nome}</td>
        <td>
          <button class="edit" data-id="${i.id}" data-nome="${i.nome}">Editar</button>
          <button class="delete" data-id="${i.id}">Excluir</button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    // Excluir
    tbody.querySelectorAll(".delete").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const nome = btn.closest("tr").children[0].textContent;

        if (!confirm(`Deseja excluir "${nome}"?`)) return;

        try {
          await deleteInstituicao(id);
          carregarInstituicoes();
        } catch (err) {
          console.error(err);
          alert("Erro ao excluir instituição.");
        }
      });
    });

    // Editar
    tbody.querySelectorAll(".edit").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const nomeAtual = btn.dataset.nome;

        const novoNome = prompt("Novo nome da instituição:", nomeAtual);

        if (!novoNome || novoNome.trim() === "") return;

        try {
          await updateInstituicao(id, { nome: novoNome });
          carregarInstituicoes();
        } catch (err) {
          console.error(err);
          alert("Erro ao editar instituição.");
        }
      });
    });

  } catch (err) {
    console.error("Erro ao carregar instituições:", err);
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





// Inicialização
carregarInstituicoes();
