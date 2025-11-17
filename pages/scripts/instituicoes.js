import { addInstituicao, getInstituicoes } from "./api.js";

const formInstituicao = document.getElementById("form-instituicao");

// Alteração: agora suporta apenas o input 'nome' do HTML de instituicoes.html
formInstituicao.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nome = formInstituicao.querySelector("input").value.trim();

  if (!nome) return alert("Preencha o nome da instituição!");

  try {
    const res = await addInstituicao({ nome }); // Alterado: enviando só {nome} para a API
    alert("Instituição adicionada com sucesso!");
    formInstituicao.reset();
    carregarInstituicoes();
  } catch (err) {
    console.error(err);
    alert("Erro ao adicionar instituição.");
  }
});

async function carregarInstituicoes() {
  try {
    const instituicoes = await getInstituicoes();
    console.log("Instituições:", instituicoes);

    // Alteração: renderizar lista na tabela do HTML
    const tbody = document.querySelector(".list-section tbody");
    tbody.innerHTML = "";
    instituicoes.forEach((i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${i.nome}</td>
        <td>
          <button class="edit">Editar</button>
          <button class="delete" data-id="${i.id}">Excluir</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Delegação de evento para excluir
    tbody.querySelectorAll(".delete").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (!confirm(`Excluir instituição "${btn.closest("tr").children[0].textContent}"?`)) return;
        try {
          await apiDelete(`/instituicao/${btn.dataset.id}`);
          carregarInstituicoes();
        } catch(err) {
          alert("Erro ao excluir instituição.");
        }
      });
    });

  } catch (err) {
    console.error("Erro ao carregar instituições:", err);
  }
}

// Inicializa ao carregar página
carregarInstituicoes();
