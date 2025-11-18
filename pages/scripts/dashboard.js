//Feito por Matheus Rosini

import { apiGet } from "./api.js";

if (window.lucide && lucide.createIcons) {
  lucide.createIcons();
}

const listaInst = document.getElementById("listaInstituicoes");
const countInstituicoes = document.getElementById("countInstituicoes");
const countDisciplinas = document.getElementById("countDisciplinas");
const countTurmas = document.getElementById("countTurmas");
const countAlunos = document.getElementById("countAlunos");

async function carregarDashboard() {
    try {
        // Carregar instituições do usuário logado
        const inst = await apiGet("/instituicoes");
        const instituicoesList = Array.isArray(inst) ? inst : (inst.data || []);
        
        listaInst.innerHTML = "";

        if (instituicoesList.length === 0) {
            listaInst.innerHTML = "<li>Nenhuma instituição cadastrada.</li>";
        } else {
            instituicoesList.forEach(i => {
                const li = document.createElement("li");
                li.textContent = i.nome || i.NOME || "Instituição sem nome";
                listaInst.appendChild(li);
            });
        }

        // Contador de instituições
        if (countInstituicoes) {
            countInstituicoes.textContent = instituicoesList.length;
        }

        // Carregar contadores (já filtrados por usuário no backend)
        const disciplinas = await apiGet("/disciplinas");
        const disciplinasList = Array.isArray(disciplinas) ? disciplinas : (disciplinas.data || []);
        
        const turmas = await apiGet("/turmas");
        const turmasList = Array.isArray(turmas) ? turmas : (turmas.data || []);
        
        const alunos = await apiGet("/alunos");
        const alunosList = Array.isArray(alunos) ? alunos : (alunos.data || []);

        // Atualizar contadores
        if (countDisciplinas) {
            countDisciplinas.textContent = disciplinasList.length;
        }
        if (countTurmas) {
            countTurmas.textContent = turmasList.length;
        }
        if (countAlunos) {
            countAlunos.textContent = alunosList.length;
        }

        console.log("Dashboard carregado:", {
            instituicoes: instituicoesList.length,
            disciplinas: disciplinasList.length,
            turmas: turmasList.length,
            alunos: alunosList.length
        });

    } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
        listaInst.innerHTML = "<li>Erro ao carregar dados.</li>";
        
        // Mostrar erro nos contadores também
        if (countInstituicoes) countInstituicoes.textContent = "—";
        if (countDisciplinas) countDisciplinas.textContent = "—";
        if (countTurmas) countTurmas.textContent = "—";
        if (countAlunos) countAlunos.textContent = "—";
    }
}

// Carregar dashboard quando a página carregar
carregarDashboard();
