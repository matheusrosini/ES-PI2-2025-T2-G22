//Feito por Matheus Henrique Portugal Narducci
// Atualizado para implementar cascata Instituição → Disciplina → Turma

import { apiGet, apiPost, apiPut, apiDelete } from "./api.js";

// Seletores do HTML
const selectInstituicao = document.getElementById("selectInstituicao");
const selectDisciplina = document.getElementById("selectDisciplina");
const selectTurma = document.getElementById("selectTurma");
const btnCarregarAlunos = document.getElementById("btnCarregarAlunos");
const tableWrapper = document.getElementById("tableWrapper");
const nenhumaTabela = document.getElementById("nenhumaTabela");
const formulaMediaInput = document.getElementById("formulaMedia");

// Verificar se os elementos foram encontrados
if (!selectInstituicao) console.error("❌ Select Instituição não encontrado!");
if (!selectDisciplina) console.error("❌ Select Disciplina não encontrado!");
if (!selectTurma) console.error("❌ Select Turma não encontrado!");
if (!btnCarregarAlunos) console.error("❌ Botão Carregar Alunos não encontrado!");
if (!tableWrapper) console.error("❌ TableWrapper não encontrado!");

// Store data
let instituicoesCache = [];
let disciplinasCache = [];
let turmasCache = [];

let turmaIdSelecionada = null;
let disciplinaIdSelecionada = null;
let instituicaoIdSelecionada = null;

if (window.lucide && lucide.createIcons) {
  lucide.createIcons();
}

// Helper functions
function escapeHtml(s) {
  if (s == null) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// ===============================
// 1 — CARREGAR INSTITUIÇÕES
// ===============================
async function carregarInstituicoes() {
  try {
    if (!selectInstituicao) {
      console.error("Select Instituição não encontrado!");
      return;
    }
    
    const resp = await apiGet("/instituicoes");
    instituicoesCache = Array.isArray(resp) ? resp : (resp.data || []);
    
    selectInstituicao.innerHTML = "<option value=''>Selecione a instituição</option>";
    instituicoesCache.forEach(inst => {
      const option = document.createElement("option");
      option.value = inst.id || inst.ID;
      option.textContent = inst.nome || inst.NOME;
      selectInstituicao.appendChild(option);
    });
    
    console.log(`✅ ${instituicoesCache.length} instituições carregadas`);
  } catch (err) {
    console.error("Erro ao carregar instituições:", err);
    if (selectInstituicao) {
      selectInstituicao.innerHTML = "<option value=''>Erro ao carregar</option>";
    }
  }
}

// ===============================
// 2 — CARREGAR TODAS AS DISCIPLINAS
// ===============================
async function carregarDisciplinas() {
  try {
    const resp = await apiGet("/disciplinas");
    disciplinasCache = Array.isArray(resp) ? resp : (resp.data || []);
  } catch (err) {
    console.error("Erro ao carregar disciplinas:", err);
    disciplinasCache = [];
  }
}

// ===============================
// 3 — POPULAR DISCIPLINAS FILTRADAS POR INSTITUIÇÃO
// ===============================
function popularDisciplinaSelectByInstituicao(instituicaoId, targetSelect) {
  if (!targetSelect) {
    console.error("Target select não encontrado!");
    return;
  }
  
  targetSelect.innerHTML = "<option value=''>Selecione a disciplina</option>";
  const list = (disciplinasCache || []).filter(d => {
    const idInst = d.instituicao_id || d.INSTITUICAO_ID;
    return instituicaoId ? Number(idInst) === Number(instituicaoId) : true;
  });
  list.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d.id || d.ID;
    opt.textContent = d.nome || d.NOME || `Disciplina ${d.id}`;
    targetSelect.appendChild(opt);
  });
  if (list.length === 0) {
    targetSelect.innerHTML = "<option value=''>Nenhuma disciplina disponível</option>";
  }
}

// ===============================
// 4 — CARREGAR TURMAS PARA INSTITUIÇÃO E DISCIPLINA
// ===============================
async function carregarTurmas(instituicaoId, disciplinaId, targetSelect) {
  try {
    if (!targetSelect) {
      console.error("Target select não encontrado!");
      return;
    }
    
    const params = new URLSearchParams();
    if (instituicaoId) params.append("instituicao_id", instituicaoId);
    if (disciplinaId) params.append("disciplina_id", disciplinaId);

    const turmas = await apiGet(`/turmas?${params.toString()}`);
    const turmasList = Array.isArray(turmas) ? turmas : (turmas.data || []);

    targetSelect.innerHTML = "<option value=''>Selecione a turma</option>";
    turmasList.forEach(turma => {
      const option = document.createElement("option");
      option.value = turma.id || turma.ID;
      option.textContent = turma.nome || turma.NOME;
      targetSelect.appendChild(option);
    });
    
    if (turmasList.length === 0) {
      targetSelect.innerHTML = "<option value=''>Nenhuma turma disponível</option>";
    }
    
    console.log(`✅ ${turmasList.length} turmas carregadas`);
  } catch (err) {
    console.error("Erro ao carregar turmas:", err);
    if (targetSelect) {
      targetSelect.innerHTML = "<option value=''>Erro ao carregar</option>";
    }
  }
}

// ===============================
// 5 — EVENT LISTENERS PARA CASCATA
// ===============================

// Quando mudar instituição, filtrar disciplinas
selectInstituicao.addEventListener("change", () => {
  instituicaoIdSelecionada = selectInstituicao.value;
  popularDisciplinaSelectByInstituicao(instituicaoIdSelecionada, selectDisciplina);
  // Limpar turma quando mudar instituição
  selectTurma.innerHTML = "<option value=''>Selecione a turma</option>";
  turmaIdSelecionada = null;
  disciplinaIdSelecionada = null;
  // Limpar tabela
  tableWrapper.innerHTML = "";
  nenhumaTabela.style.display = "block";
});

// Quando mudar disciplina, carregar turmas
selectDisciplina.addEventListener("change", async () => {
  disciplinaIdSelecionada = selectDisciplina.value;
  const instId = selectInstituicao.value;
  await carregarTurmas(instId, disciplinaIdSelecionada, selectTurma);
  turmaIdSelecionada = null;
  // Limpar tabela
  tableWrapper.innerHTML = "";
  nenhumaTabela.style.display = "block";
});

// Quando mudar turma, limpar tabela
selectTurma.addEventListener("change", () => {
  turmaIdSelecionada = selectTurma.value;
  tableWrapper.innerHTML = "";
  nenhumaTabela.style.display = "block";
});

// ===============================
// 6 — CARREGAR NOTAS (ALUNOS + COMPONENTES)
// ===============================
async function carregarNotas() {
  if (!turmaIdSelecionada || !disciplinaIdSelecionada) {
    alert("Por favor, selecione instituição, disciplina e turma antes de carregar os alunos.");
    return;
  }

  tableWrapper.innerHTML = "<div style='padding: 20px; text-align: center;'>Carregando...</div>";
  nenhumaTabela.style.display = "none";

  try {
    const data = await apiGet(`/notas/turma/${turmaIdSelecionada}/disciplina/${disciplinaIdSelecionada}`);
    
    if (!data || !data.alunos || data.alunos.length === 0) {
      tableWrapper.innerHTML = "";
      nenhumaTabela.style.display = "block";
      nenhumaTabela.textContent = "Nenhum aluno encontrado para esta turma e disciplina.";
      return;
    }

    const { alunos, componentes } = data;

    // Criar tabela dinamicamente
    const table = document.createElement("table");
    table.id = "tabela-notas";
    table.className = "notas-table";
    
    // Criar thead
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    trHead.innerHTML = `
      <th>Aluno</th>
      <th>Matrícula</th>
      ${componentes.map(c => `<th>${escapeHtml(c.sigla || c.SIGLA || "")}</th>`).join("")}
      <th>Média</th>
    `;
    thead.appendChild(trHead);
    table.appendChild(thead);

    // Criar tbody
    const tbody = document.createElement("tbody");
    
    alunos.forEach(a => {
      const linha = document.createElement("tr");
      const alunoId = a.aluno_id || a.ALUNO_ID;
      const alunoNome = a.nome || a.NOME || "";
      const alunoMatricula = a.matricula || a.MATRICULA || "";

      const colunasNotas = (a.componentes || []).map(c => {
        const componenteId = c.componente_id || c.COMPONENTE_ID;
        const componenteNome = c.nome || c.NOME || "";
        const componenteSigla = c.sigla || c.SIGLA || "";
        const valor = c.valor !== null && c.valor !== undefined ? c.valor : "";
        
        return `<td>
          <input type="number" min="0" max="10" step="0.1"
                 value="${valor}"
                 data-aluno="${alunoId}"
                 data-componente="${componenteId}"
                 data-componente-nome="${escapeHtml(componenteNome)}"
                 data-componente-sigla="${escapeHtml(componenteSigla)}"
                 placeholder="0.0"
                 class="nota-input"
                 style="width:70px; padding: 6px; text-align: center;">
        </td>`;
      }).join("");

      linha.innerHTML = `
        <td>${escapeHtml(alunoNome)}</td>
        <td>${escapeHtml(alunoMatricula)}</td>
        ${colunasNotas}
        <td class="media">—</td>
      `;

      tbody.appendChild(linha);
      calcularMedia(linha); // Calcula média inicial
    });

    table.appendChild(tbody);
    tableWrapper.innerHTML = "";
    tableWrapper.appendChild(table);
    nenhumaTabela.style.display = "none";

    // Adiciona listener para recalcular média ao digitar
    tbody.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener('input', () => {
        const linha = input.closest('tr');
        calcularMedia(linha);
      });
    });

    // Adiciona listener para salvar nota ao alterar (change = quando o valor mudar e sair do campo)
    tbody.querySelectorAll('input[type="number"].nota-input').forEach(input => {
      let valorAnterior = input.value;
      
      input.addEventListener("change", async function() {
        const aluno_id = this.dataset.aluno;
        const componente_id = this.dataset.componente;
        const componenteNome = this.dataset.componenteNome || "";
        const valor = this.value.trim();

        if (!aluno_id || !componente_id) return;
        
        // Se o valor não mudou, não fazer nada
        if (valor === valorAnterior) return;

        try {
          const resposta = await apiPut("/notas/registrar", { 
            aluno_id: Number(aluno_id), 
            componente_id: Number(componente_id), 
            valor: valor ? parseFloat(valor) : null 
          });
          console.log(`Nota salva para ${componenteNome}:`, resposta.message || "Sucesso");
          
          // Atualizar valor anterior
          valorAnterior = valor;
          
          // Feedback visual
          this.style.backgroundColor = "#d4edda";
          setTimeout(() => {
            this.style.backgroundColor = "";
          }, 500);
        } catch (err) {
          console.error("Erro ao salvar nota:", err);
          const errorMsg = err.response?.data?.message || err.message || "Erro ao salvar nota.";
          alert(`Erro ao salvar nota: ${errorMsg}`);
          // Restaurar valor anterior em caso de erro
          this.value = valorAnterior;
          this.focus();
        }
      });
      
      // Também salvar ao pressionar Enter
      input.addEventListener("keypress", async (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.target.blur(); // Dispara o evento change
        }
      });
    });

  } catch (err) {
    console.error("Erro ao carregar notas:", err);
    tableWrapper.innerHTML = "";
    nenhumaTabela.style.display = "block";
    nenhumaTabela.textContent = "Erro ao carregar notas. Verifique se a turma e disciplina estão corretas.";
  }
}

// ===============================
// 7 — CALCULAR MÉDIA DINÂMICA
// ===============================
function calcularMedia(linha) {
  const notas = linha.querySelectorAll('input[type="number"]');
  let soma = 0;
  let qtd = 0;

  notas.forEach(input => {
    const valor = parseFloat(input.value);
    if (!isNaN(valor) && valor !== "") {
      soma += valor;
      qtd++;
    }
  });

  const mediaCell = linha.querySelector('td.media');
  mediaCell.textContent = qtd > 0 ? (soma / qtd).toFixed(2) : '—';
}

// ===============================
// 8 — BOTÃO CARREGAR ALUNOS
// ===============================
btnCarregarAlunos.addEventListener("click", async () => {
  // Atualizar valores dos selects
  turmaIdSelecionada = selectTurma.value;
  disciplinaIdSelecionada = selectDisciplina.value;
  instituicaoIdSelecionada = selectInstituicao.value;
  
  if (!instituicaoIdSelecionada || !disciplinaIdSelecionada || !turmaIdSelecionada) {
    alert("Por favor, selecione instituição, disciplina e turma antes de carregar os alunos.");
    return;
  }
  
  await carregarNotas();
});

// ===============================
// 9 — INICIALIZAÇÃO
// ===============================
(async function init() {
  try {
    console.log("Inicializando página de notas...");
    await carregarInstituicoes();
    console.log("Instituições carregadas:", instituicoesCache.length);
    await carregarDisciplinas();
    console.log("Disciplinas carregadas:", disciplinasCache.length);
    // Popular disciplinas inicialmente (sem filtro)
    popularDisciplinaSelectByInstituicao(null, selectDisciplina);
    console.log("✅ Página de notas inicializada com sucesso!");
  } catch (err) {
    console.error("❌ Erro na inicialização:", err);
    alert("Erro ao inicializar a página. Verifique o console para mais detalhes.");
  }
})();
