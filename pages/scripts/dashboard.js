import { addInstituicao, getInstituicoes, addDisciplina, getDisciplinas, addTurma, getTurmas } from "./api.js";

// Inicializa ícones
lucide.createIcons();

// ---- Instituição (novo, seguindo padrão login/cadastro) ----
const formInstituicao = document.getElementById("form-instituicao");
if(formInstituicao){
  formInstituicao.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = formInstituicao.querySelector("input").value.trim();
    if (!nome) return alert("Preencha o nome da instituição!");

    try {
      await addInstituicao({ nome });
      alert("Instituição adicionada!");
      formInstituicao.reset();
      carregarInstituicoes();
    } catch (err) {
      console.error(err);
      alert("Erro ao adicionar instituição.");
    }
  });

  async function carregarInstituicoes() {
    try {
      const insts = await getInstituicoes();
      console.log("Instituições:", insts);
      // Aqui pode popular selects de curso/disciplina
    } catch (err) {
      console.error(err);
    }
  }

  carregarInstituicoes();
}

// ---- Disciplina ----
const formDisciplina = document.getElementById("form-disciplina");
if(formDisciplina){
  formDisciplina.addEventListener("submit", async (e) => {
    e.preventDefault();
    const inputs = formDisciplina.querySelectorAll("input, select");
    const disciplina = {
      nome: inputs[0].value.trim(),
      sigla: inputs[1].value.trim(),
      codigo: inputs[2].value.trim(),
      periodo: inputs[3].value.trim()
    };
    if(Object.values(disciplina).some(v => !v)) return alert("Preencha todos os campos!");

    try {
      await addDisciplina(disciplina);
      alert("Disciplina cadastrada!");
      formDisciplina.reset();
      carregarDisciplinas();
    } catch(err) {
      console.error(err);
      alert("Erro ao cadastrar disciplina.");
    }
  });

  async function carregarDisciplinas() {
    try {
      const disciplinas = await getDisciplinas();
      console.log("Disciplinas:", disciplinas);
      // Aqui pode popular selects de turma
    } catch(err) {
      console.error(err);
    }
  }

  carregarDisciplinas();
}

// ---- Turma ----
const formTurma = document.getElementById("form-turma");
if(formTurma){
  formTurma.addEventListener("submit", async (e) => {
    e.preventDefault();
    const selects = formTurma.querySelectorAll("select");
    const input = formTurma.querySelector("input");
    const turma = {
      disciplina_id: selects[0].value,
      nome: input.value.trim(),
      periodo: selects[1].value
    };
    if(Object.values(turma).some(v => !v)) return alert("Preencha todos os campos!");

    try {
      await addTurma(turma);
      alert("Turma criada!");
      formTurma.reset();
      carregarTurmas();
    } catch(err){
      console.error(err);
      alert("Erro ao criar turma.");
    }
  });

  async function carregarTurmas() {
    try {
      const turmas = await getTurmas();
      console.log("Turmas:", turmas);
      // Renderizar tabela de turmas
    } catch(err) {
      console.error(err);
    }
  }

  carregarTurmas();
}

// ---- Toggle sections ----
document.querySelectorAll(".section-header .toggle").forEach(toggle => {
  toggle.addEventListener("click", () => {
    const section = toggle.closest(".form-section");
    const content = section.querySelector(".section-content");
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
  });
});
