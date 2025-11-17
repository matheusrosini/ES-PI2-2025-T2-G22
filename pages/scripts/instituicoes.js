import {
  addInstituicao,
  getInstituicoes,
  deleteInstituicao,
  updateInstituicao
} from "./api.js";

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

// Inicialização
carregarInstituicoes();
