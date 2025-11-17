import { addDisciplina, addTurma, getDisciplinas } from "./api.js";

// Inicializa ícones
lucide.createIcons();

// ---- Disciplina ----
const formDisciplina = document.getElementById("form-disciplina");
formDisciplina.addEventListener("submit", async (e) => {
  e.preventDefault();
  const inputs = formDisciplina.querySelectorAll("input, select");
  const disciplina = {
    nome: inputs[0].value.trim(),
    sigla: inputs[1].value.trim(),
    codigo: inputs[2].value.trim(),
    periodo: inputs[3].value
  };

  if (!disciplina.nome || !disciplina.sigla || !disciplina.codigo || !disciplina.periodo)
    return alert("Preencha todos os campos!");

  try {
    await addDisciplina(disciplina);
    alert("Disciplina cadastrada com sucesso!");
    formDisciplina.reset();
    carregarDisciplinas();
  } catch (err) {
    console.error(err);
    alert("Erro ao cadastrar disciplina.");
  }
});

async function carregarDisciplinas() {
  try {
    const disciplinas = await getDisciplinas();
    console.log("Disciplinas:", disciplinas);
    // Renderizar na tabela ou select de turma
  } catch (err) {
    console.error(err);
  }
}

// ---- Turma ----
const formTurma = document.getElementById("form-turma");
formTurma.addEventListener("submit", async (e) => {
  e.preventDefault();
  const selects = formTurma.querySelectorAll("select");
  const inputTurma = formTurma.querySelector("input");
  const turma = {
    disciplina: selects[0].value,
    nome: inputTurma.value.trim(),
    periodo: selects[1].value
  };

  if (!turma.disciplina || !turma.nome || !turma.periodo) return alert("Preencha todos os campos!");

  try {
    await addTurma(turma);
    alert("Turma criada com sucesso!");
    formTurma.reset();
  } catch (err) {
    console.error(err);
    alert("Erro ao criar turma.");
  }
});

// ---- Toggle sections ----
document.querySelectorAll(".section-header .toggle").forEach(toggle => {
  toggle.addEventListener("click", () => {
    const section = toggle.closest(".form-section");
    const content = section.querySelector(".section-content");
    content.style.display = content.style.display === "none" ? "block" : "none";
  });
});
