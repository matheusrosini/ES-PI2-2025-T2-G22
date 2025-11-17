//Feito por Matheus Rosini

import { apiGet } from "./api.js";

if (window.lucide && lucide.createIcons) {
  lucide.createIcons();
}

const listaInst = document.getElementById("listaInstituicoes");
const countDisciplinas = document.getElementById("countDisciplinas");
const countTurmas = document.getElementById("countTurmas");
const countAlunos = document.getElementById("countAlunos");

async function carregarDashboard() {
    try {
        // Carrega instituições
        const inst = await apiGet("/instituicao");
        listaInst.innerHTML = "";

        inst.forEach(i => {
            const li = document.createElement("li");
            li.textContent = i.nome;
            listaInst.appendChild(li);
        });

        // Contadores
        const disciplinas = await apiGet("/disciplina");
        const turmas = await apiGet("/turma");
        const alunos = await apiGet("/aluno");

        countDisciplinas.textContent = disciplinas.length;
        countTurmas.textContent = turmas.length;
        countAlunos.textContent = alunos.length;

    } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
        listaInst.innerHTML = "<li>Erro ao carregar instituições.</li>";
    }
}

carregarDashboard();
