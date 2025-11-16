import { apiGet, apiPost, apiPut, apiDelete } from "./api.js";

const turmaSelect = document.getElementById("select-turma");
const disciplinaSelect = document.getElementById("select-disciplina");
const tabelaNotas = document.getElementById("tabela-notas").querySelector("tbody");

let turmaIdSelecionada = null;
let disciplinaIdSelecionada = null;

// ===============================
// 1 — CARREGAR TURMAS
// ===============================
async function carregarTurmas() {
  try {
    const turmas = await apiGet("/turma");

    turmaSelect.innerHTML = `<option value="">Selecione...</option>`;

    turmas.forEach(t => {
      turmaSelect.innerHTML += `<option value="${t.id}">${t.nome}</option>`;
    });
  } catch (err) {
    console.error("Erro ao carregar turmas:", err);
  }
}

// ===============================
// 2 — QUANDO TURMA É SELECIONADA → CARREGA DISCIPLINAS
// ===============================
turmaSelect.addEventListener("change", async () => {
  turmaIdSelecionada = turmaSelect.value;

  tabelaNotas.innerHTML = "";
  disciplinaSelect.innerHTML = `<option value="">Carregando...</option>`;

  if (!turmaIdSelecionada) return;

  try {
    const disciplinas = await apiGet("/disciplina");

    disciplinaSelect.innerHTML = `<option value="">Selecione...</option>`;

    disciplinas.forEach(d => {
      disciplinaSelect.innerHTML += `<option value="${d.id}">${d.nome}</option>`;
    });
  } catch (err) {
    console.error("Erro ao carregar disciplinas:", err);
  }
});

// ===============================
// 3 — CARREGAR NOTAS (ALUNOS + COMPONENTES)
// ===============================
disciplinaSelect.addEventListener("change", () => {
  disciplinaIdSelecionada = disciplinaSelect.value;
  if (turmaIdSelecionada && disciplinaIdSelecionada) carregarNotas();
});

async function carregarNotas() {
  tabelaNotas.innerHTML = `<tr><td colspan="10">Carregando...</td></tr>`;

  try {
    const data = await apiGet(
      `/notas/turma/${turmaIdSelecionada}/disciplina/${disciplinaIdSelecionada}`
    );

    tabelaNotas.innerHTML = "";

    const { alunos, componentes } = data;

    // Montar cabeçalho dinamicamente
    const thead = document.querySelector("#tabela-notas thead tr");
    thead.innerHTML = `
      <th>Aluno</th>
      <th>Matrícula</th>
      ${componentes.map(c => `<th>${c.sigla}</th>`).join("")}
    `;

    alunos.forEach(a => {
      const linha = document.createElement("tr");

      const colunasNotas = a.componentes
        .map(c => {
          return `
            <td>
              <input type="number" 
                     min="0" max="10" step="0.1"
                     value="${c.valor !== null ? c.valor : ""}"
                     data-aluno="${a.aluno_id}"
                     data-componente="${c.componente_id}"
                     style="width:60px;">
            </td>
          `;
        })
        .join("");

      linha.innerHTML = `
        <td>${a.nome}</td>
        <td>${a.matricula}</td>
        ${colunasNotas}
      `;

      tabelaNotas.appendChild(linha);
    });
  } catch (err) {
    console.error("Erro ao carregar notas:", err);
  }
}

// ===============================
// 4 — SALVAR NOTA QUANDO O INPUT É ALTERADO
// ===============================
document.addEventListener("change", async (e) => {
  if (e.target.tagName !== "INPUT") return;

  const aluno_id = e.target.dataset.aluno;
  const componente_id = e.target.dataset.componente;
  const valor = e.target.value;

  if (!aluno_id || !componente_id) return;

  try {
    const resposta = await apiPut("/notas/registrar", {
      aluno_id,
      componente_id,
      valor
    });

    console.log("Nota salva:", resposta.message);
  } catch (err) {
    console.error("Erro ao salvar nota:", err);
  }
});

// ===============================
// INICIAR
// ===============================
carregarTurmas();
