import { addInstituicao, getInstituicoes } from "./api.js";

const formInstituicao = document.getElementById("form-instituicao");

formInstituicao.addEventListener("submit", async (e) => {
  e.preventDefault();
  const [nomeInput, cursoInput] = formInstituicao.querySelectorAll("input");
  const nome = nomeInput.value.trim();
  const curso = cursoInput.value.trim();

  if (!nome || !curso) return alert("Preencha todos os campos!");

  try {
    const res = await addInstituicao({ nome, curso });
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
    // Aqui você pode renderizar na tabela do dashboard
  } catch (err) {
    console.error("Erro ao carregar instituições:", err);
  }
}

// Inicializar
carregarInstituicoes();
