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
const tipoCalculoSelect = document.getElementById("tipoCalculo");
const arredondarNotasCheck = document.getElementById("arredondarNotas");
const btnSalvarFormula = document.getElementById("btnSalvarFormula");
const btnExportCsv = document.getElementById("btnExportCsv");

// Configurações de cálculo
let configDisciplina = {
  formula: "",
  tipoCalculo: "normal", // "normal" ou "ponderada"
  arredondar: false
};

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
let componentesCache = []; // Cache de componentes com pesos
let componentesModalCache = []; // Cache de componentes para o modal

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

// Quando mudar disciplina, carregar turmas e fórmula
selectDisciplina.addEventListener("change", async () => {
  disciplinaIdSelecionada = selectDisciplina.value;
  const instId = selectInstituicao.value;
  await carregarTurmas(instId, disciplinaIdSelecionada, selectTurma);
  turmaIdSelecionada = null;
  // Limpar tabela
  tableWrapper.innerHTML = "";
  nenhumaTabela.style.display = "block";
  // Carregar fórmula da disciplina
  if (disciplinaIdSelecionada) {
    await carregarFormulaDisciplina();
  }
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
    console.log("Carregando notas para turma:", turmaIdSelecionada, "disciplina:", disciplinaIdSelecionada);
    const data = await apiGet(`/notas/turma/${turmaIdSelecionada}/disciplina/${disciplinaIdSelecionada}`);
    
    console.log("Dados recebidos:", data);
    
    if (!data) {
      console.error("Dados vazios recebidos da API");
      tableWrapper.innerHTML = "";
      nenhumaTabela.style.display = "block";
      nenhumaTabela.textContent = "Erro ao carregar dados. Tente novamente.";
      return;
    }

    const alunos = data.alunos || [];
    const componentes = data.componentes || [];
    
    console.log(`Alunos encontrados: ${alunos.length}, Componentes encontrados: ${componentes.length}`);
    
    // Armazenar componentes no cache para cálculo ponderado
    componentesCache = componentes;
    console.log("Componentes armazenados no cache:", componentesCache);
    
    if (alunos.length === 0) {
      console.warn("Nenhum aluno encontrado para esta turma e disciplina");
      tableWrapper.innerHTML = "";
      nenhumaTabela.style.display = "block";
      nenhumaTabela.textContent = "Nenhum aluno encontrado para esta turma e disciplina.";
      return;
    }

    console.log(`Carregando ${alunos.length} alunos e ${componentes.length} componentes`);

    try {
      // Criar tabela dinamicamente
      const table = document.createElement("table");
      table.id = "tabela-notas";
      table.className = "notas-table";
      
      // Criar thead
      const thead = document.createElement("thead");
      const trHead = document.createElement("tr");
      const colunasComponentes = componentes.length > 0 
        ? componentes.map(c => `<th>${escapeHtml(c.sigla || c.SIGLA || "")}</th>`).join("")
        : `<th colspan="1" style="text-align: center; color: #999;">Nenhum componente cadastrado</th>`;
      
      trHead.innerHTML = `
        <th>Aluno</th>
        <th>Matrícula</th>
        ${colunasComponentes}
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

      // Se não houver componentes, criar uma célula vazia
      let colunasNotas = "";
      if (componentes.length > 0) {
        // Garantir que temos componentes para cada aluno (mesmo que vazios)
        colunasNotas = componentes.map(comp => {
          const compAluno = (a.componentes || []).find(c => {
            const compId = c.componente_id || c.COMPONENTE_ID;
            const compIdNum = comp.id || comp.ID;
            return String(compId) === String(compIdNum);
          });
          const componenteId = comp.id || comp.ID;
          const componenteNome = comp.nome || comp.NOME || "";
          const componenteSigla = comp.sigla || comp.SIGLA || "";
          const valor = compAluno && compAluno.valor !== null && compAluno.valor !== undefined 
            ? compAluno.valor 
            : "";
          
          return `<td>
            <input type="number" min="0" max="10" step="0.1"
                   value="${escapeHtml(String(valor))}"
                   data-aluno="${escapeHtml(String(alunoId))}"
                   data-componente="${escapeHtml(String(componenteId))}"
                   data-componente-nome="${escapeHtml(componenteNome)}"
                   data-componente-sigla="${escapeHtml(componenteSigla)}"
                   placeholder="0.0"
                   class="nota-input"
                   style="width:70px; padding: 6px; text-align: center;">
          </td>`;
        }).join("");
      } else {
        colunasNotas = `<td style="text-align: center; color: #999;">—</td>`;
      }

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
      
      console.log("Tabela criada com sucesso!");

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
      console.error("Erro ao criar tabela:", err);
      throw err; // Re-lançar para ser capturado pelo catch externo
    }

  } catch (err) {
    console.error("Erro ao carregar notas:", err);
    console.error("Detalhes do erro:", err.message, err.stack);
    tableWrapper.innerHTML = "";
    nenhumaTabela.style.display = "block";
    nenhumaTabela.textContent = `Erro ao carregar notas: ${err.message || "Erro desconhecido"}. Verifique se a turma e disciplina estão corretas.`;
  }
}

// ===============================
// 7 — CARREGAR FÓRMULA DA DISCIPLINA
// ===============================
async function carregarFormulaDisciplina() {
  if (!disciplinaIdSelecionada) return;

  try {
    const disciplina = await apiGet(`/disciplinas/${disciplinaIdSelecionada}`);
    const formulaCompleta = disciplina.FORMULA_NOTA || disciplina.formula_nota || "";
    
    // Extrair tipo de cálculo e arredondamento da fórmula se houver (formato: "FORMULA|tipo|arredondar")
    const partes = formulaCompleta.split("|");
    let formula = formulaCompleta;
    
    if (partes.length >= 2) {
      formula = partes[0]; // Apenas a fórmula
      configDisciplina.tipoCalculo = partes[1] || "normal";
      configDisciplina.arredondar = partes[2] === "true";
    } else {
      // Se não tiver formato com |, usar valores padrão
      configDisciplina.tipoCalculo = "normal";
      configDisciplina.arredondar = false;
    }
    
    if (formulaMediaInput) {
      formulaMediaInput.value = formula;
    }
    
    configDisciplina.formula = formula;
    
    if (tipoCalculoSelect) {
      tipoCalculoSelect.value = configDisciplina.tipoCalculo;
    }
    if (arredondarNotasCheck) {
      arredondarNotasCheck.checked = configDisciplina.arredondar;
    }
  } catch (err) {
    console.error("Erro ao carregar fórmula da disciplina:", err);
  }
}

// ===============================
// 8 — SALVAR FÓRMULA DA DISCIPLINA
// ===============================
async function salvarFormulaDisciplina() {
  if (!disciplinaIdSelecionada) {
    alert("Por favor, selecione uma disciplina primeiro.");
    return;
  }

  const formula = formulaMediaInput?.value.trim() || "";
  const tipoCalculo = tipoCalculoSelect?.value || "normal";
  const arredondar = arredondarNotasCheck?.checked || false;

  // Salvar no formato: "FORMULA|tipo|arredondar"
  const formulaCompleta = `${formula}|${tipoCalculo}|${arredondar}`;

  try {
    // Buscar disciplina atual
    const disciplina = await apiGet(`/disciplinas/${disciplinaIdSelecionada}`);
    
    // Atualizar disciplina com nova fórmula
    await apiPut(`/disciplinas/${disciplinaIdSelecionada}`, {
      nome: disciplina.NOME || disciplina.nome,
      sigla: disciplina.SIGLA || disciplina.sigla,
      codigo: disciplina.CODIGO || disciplina.codigo,
      periodo: disciplina.PERIODO || disciplina.periodo,
      formula_nota: formulaCompleta,
      instituicao_id: disciplina.INSTITUICAO_ID || disciplina.instituicao_id
    });

    configDisciplina.formula = formula;
    configDisciplina.tipoCalculo = tipoCalculo;
    configDisciplina.arredondar = arredondar;

    alert("Fórmula salva com sucesso!");
    
    // Recalcular médias se a tabela estiver carregada
    if (tableWrapper.querySelector("#tabela-notas")) {
      tableWrapper.querySelectorAll("#tabela-notas tbody tr").forEach(linha => {
        calcularMedia(linha);
      });
    }
  } catch (err) {
    console.error("Erro ao salvar fórmula:", err);
    alert("Erro ao salvar fórmula: " + (err.message || "Erro desconhecido"));
  }
}

// ===============================
// 9 — CALCULAR MÉDIA DINÂMICA (COM SUPORTE A PONDERADA E ARREDONDAMENTO)
// ===============================
function calcularMedia(linha) {
  try {
    if (!linha) {
      console.error("Linha não fornecida para calcular média");
      return;
    }

    const notas = linha.querySelectorAll('input[type="number"].nota-input');
    if (!notas || notas.length === 0) {
      // Se não houver inputs de nota, não calcular
      const mediaCell = linha.querySelector('td.media');
      if (mediaCell) {
        mediaCell.textContent = '—';
      }
      return;
    }

    const tipoCalculo = configDisciplina.tipoCalculo || "normal";
    const arredondar = configDisciplina.arredondar || false;
    
    let media = 0;

    if (tipoCalculo === "ponderada") {
      // Cálculo ponderado: precisa dos pesos dos componentes
      let somaPonderada = 0;
      let somaPesos = 0;

      notas.forEach(input => {
        const valor = parseFloat(input.value);
        if (!isNaN(valor) && valor !== "" && valor >= 0) {
          // Buscar peso do componente (se disponível)
          const componenteId = input.dataset.componente;
          const componente = componentesCache?.find(c => c.id == componenteId || c.ID == componenteId);
          const peso = (componente?.peso || componente?.PESO || 1); // Padrão: peso 1 se não especificado
          
          somaPonderada += valor * peso;
          somaPesos += peso;
        }
      });

      media = somaPesos > 0 ? somaPonderada / somaPesos : 0;
    } else {
      // Cálculo normal (aritmética)
      let soma = 0;
      let qtd = 0;

      notas.forEach(input => {
        const valor = parseFloat(input.value);
        if (!isNaN(valor) && valor !== "" && valor >= 0) {
          soma += valor;
          qtd++;
        }
      });

      media = qtd > 0 ? soma / qtd : 0;
    }

    // Aplicar arredondamento se necessário
    if (arredondar && media > 0) {
      // Arredondar para múltiplos de 0.5, sempre arredondando para cima
      // Exemplo: 2.25 → 2.5, 2.1 → 2.5, 2.6 → 3.0
      media = Math.ceil(media * 2) / 2;
    }

    const mediaCell = linha.querySelector('td.media');
    if (mediaCell) {
      if (media > 0) {
        if (arredondar) {
          // Se for inteiro, mostrar sem .0, senão mostrar com .5
          mediaCell.textContent = media % 1 === 0 ? media.toString() : media.toFixed(1);
        } else {
          mediaCell.textContent = media.toFixed(2);
        }
      } else {
        mediaCell.textContent = '—';
      }
    }
  } catch (err) {
    console.error("Erro ao calcular média:", err);
    const mediaCell = linha?.querySelector('td.media');
    if (mediaCell) {
      mediaCell.textContent = '—';
    }
  }
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
// 9 — GERENCIAR COMPONENTES DE NOTA
// ===============================
const compModal = document.getElementById("compModal");
const closeCompModal = document.getElementById("closeCompModal");
const btnAddComp = document.getElementById("btnAddComp");
const compNome = document.getElementById("compNome");
const compSigla = document.getElementById("compSigla");
const compDesc = document.getElementById("compDesc");
const compTable = document.getElementById("compTable");
let componenteEditando = null;

// Função para obter o tbody da tabela de componentes
function getCompTableBody() {
  if (!compTable) return null;
  return compTable.querySelector("tbody");
}

// Abrir modal de componentes
function abrirModalComponentes() {
  if (!disciplinaIdSelecionada) {
    alert("Por favor, selecione uma disciplina primeiro.");
    return;
  }
  compModal?.classList.remove("oculto");
  compModal?.setAttribute("aria-hidden", "false");
  carregarComponentesNaTabela();
}

// Fechar modal
function fecharModalComponentes() {
  compModal?.classList.add("oculto");
  compModal?.setAttribute("aria-hidden", "true");
  limparFormComponente();
}

// Limpar formulário
function limparFormComponente() {
  if (compNome) compNome.value = "";
  if (compSigla) compSigla.value = "";
  if (compDesc) compDesc.value = "";
  componenteEditando = null;
  if (btnAddComp) btnAddComp.textContent = "Adicionar";
}

// Carregar componentes na tabela do modal
async function carregarComponentesNaTabela() {
  const compTableBody = getCompTableBody();
  if (!compTableBody || !disciplinaIdSelecionada) {
    console.error("compTableBody não encontrado ou disciplina não selecionada");
    return;
  }

  try {
    const componentes = await apiGet(`/componentes/disciplina/${disciplinaIdSelecionada}`);
    compTableBody.innerHTML = "";

    // Armazenar componentes no cache para uso posterior
    componentesModalCache = componentes || [];

    if (componentes.length === 0) {
      compTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px;">Nenhum componente cadastrado.</td></tr>`;
      return;
    }

    componentes.forEach(comp => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(comp.sigla || "")}</td>
        <td>${escapeHtml(comp.nome || "")}</td>
        <td>${escapeHtml(comp.descricao || "-")}</td>
        <td>
          <button class="btn-edit-comp" data-id="${comp.id}">Editar</button>
          <button class="btn-delete-comp" data-id="${comp.id}">Excluir</button>
        </td>
      `;
      compTableBody.appendChild(tr);
    });

    // Adicionar eventos
    compTableBody.querySelectorAll(".btn-edit-comp").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        editarComponente(id);
      });
    });

    compTableBody.querySelectorAll(".btn-delete-comp").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        deletarComponente(id);
      });
    });

  } catch (err) {
    console.error("Erro ao carregar componentes:", err);
    const compTableBody = getCompTableBody();
    if (compTableBody) {
      compTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px; color: red;">Erro ao carregar componentes: ${err.message || "Erro desconhecido"}</td></tr>`;
    }
  }
}

// Editar componente
function editarComponente(id) {
  if (!id) {
    console.error("ID do componente não fornecido");
    return;
  }

  // Buscar componente no cache ou recarregar se necessário
  let comp = componentesModalCache.find(c => c.id == id || c.ID == id);
  
  if (!comp && componentesModalCache.length === 0) {
    // Se o cache estiver vazio, tentar recarregar
    console.warn("Cache de componentes vazio, recarregando...");
    carregarComponentesNaTabela().then(() => {
      comp = componentesModalCache.find(c => c.id == id || c.ID == id);
      if (comp) {
        preencherFormularioComponente(comp);
      } else {
        alert("Componente não encontrado.");
      }
    });
    return;
  }

  if (!comp) {
    console.error("Componente não encontrado com ID:", id);
    alert("Componente não encontrado.");
    return;
  }

  preencherFormularioComponente(comp);
}

// Função auxiliar para preencher formulário
function preencherFormularioComponente(comp) {
  componenteEditando = comp;
  if (compNome) compNome.value = comp.nome || "";
  if (compSigla) compSigla.value = comp.sigla || "";
  if (compDesc) compDesc.value = comp.descricao || "";
  if (btnAddComp) btnAddComp.textContent = "Salvar Alterações";
}

// Deletar componente
async function deletarComponente(id) {
  if (!confirm("Tem certeza que deseja excluir este componente? Esta ação não pode ser desfeita.")) {
    return;
  }

  try {
    await apiDelete(`/componentes/${id}`);
    alert("Componente excluído com sucesso!");
    carregarComponentesNaTabela();
    // Recarregar notas se já estiverem carregadas
    if (turmaIdSelecionada && disciplinaIdSelecionada) {
      await carregarNotas();
    }
  } catch (err) {
    console.error("Erro ao deletar componente:", err);
    alert("Erro ao excluir componente: " + (err.message || "Erro desconhecido"));
  }
}

// Adicionar ou atualizar componente
async function salvarComponente() {
  if (!disciplinaIdSelecionada) {
    alert("Por favor, selecione uma disciplina primeiro.");
    return;
  }

  const nome = compNome?.value.trim();
  const sigla = compSigla?.value.trim();
  const descricao = compDesc?.value.trim() || null;

  if (!nome || !sigla) {
    alert("Nome e sigla são obrigatórios.");
    return;
  }

  try {
    if (componenteEditando) {
      // Atualizar
      await apiPut(`/componentes/${componenteEditando.id}`, {
        nome,
        sigla,
        descricao
      });
      alert("Componente atualizado com sucesso!");
    } else {
      // Criar
      await apiPost("/componentes", {
        nome,
        sigla,
        descricao,
        disciplina_id: Number(disciplinaIdSelecionada)
      });
      alert("Componente criado com sucesso!");
    }

    limparFormComponente();
    carregarComponentesNaTabela();
    
    // Recarregar notas se já estiverem carregadas
    if (turmaIdSelecionada && disciplinaIdSelecionada) {
      await carregarNotas();
    }
  } catch (err) {
    console.error("Erro ao salvar componente:", err);
    alert("Erro ao salvar componente: " + (err.message || "Erro desconhecido"));
  }
}

// Event listeners para modal de componentes
if (closeCompModal) {
  closeCompModal.addEventListener("click", fecharModalComponentes);
}

if (compModal) {
  compModal.addEventListener("click", (e) => {
    if (e.target === compModal) {
      fecharModalComponentes();
    }
  });
}

if (btnAddComp) {
  btnAddComp.addEventListener("click", salvarComponente);
}

// Botão para abrir modal (adicionar ao HTML se não existir)
function criarBotaoGerenciarComponentes() {
  const notasExtras = document.getElementById("notasExtras");
  if (!notasExtras) return;

  // Verificar se o botão já existe
  if (document.getElementById("btnGerenciarComponentes")) return;

  const btn = document.createElement("button");
  btn.id = "btnGerenciarComponentes";
  btn.className = "btn";
  btn.textContent = "Gerenciar Componentes";
  btn.addEventListener("click", abrirModalComponentes);
  notasExtras.appendChild(btn);
}

// ===============================
// 10 — EXPORTAR CSV
// ===============================
function exportarCSV() {
  const tabela = document.getElementById("tabela-notas");
  if (!tabela) {
    alert("Nenhuma tabela de notas carregada para exportar.");
    return;
  }

  const linhas = [];
  const thead = tabela.querySelector("thead tr");
  const tbody = tabela.querySelector("tbody");

  if (!thead || !tbody) {
    alert("Tabela inválida para exportação.");
    return;
  }

  // Função auxiliar para escapar valores CSV
  function escapeCSV(valor) {
    if (valor === null || valor === undefined) return "";
    const str = String(valor).trim();
    // Se contém vírgula, aspas ou quebra de linha, envolver em aspas e duplicar aspas internas
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  // Cabeçalho
  const headers = [];
  thead.querySelectorAll("th").forEach(th => {
    headers.push(escapeCSV(th.textContent));
  });
  linhas.push(headers.join(","));

  // Dados
  tbody.querySelectorAll("tr").forEach(tr => {
    const linha = [];
    tr.querySelectorAll("td").forEach((td, index) => {
      // Se for a coluna de média, pegar o texto
      if (td.classList.contains("media")) {
        linha.push(escapeCSV(td.textContent));
      } else {
        // Se for input, pegar o valor
        const input = td.querySelector("input");
        if (input) {
          linha.push(escapeCSV(input.value));
        } else {
          linha.push(escapeCSV(td.textContent));
        }
      }
    });
    linhas.push(linha.join(","));
  });

  // Criar arquivo CSV
  const csvContent = linhas.join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" }); // BOM para Excel
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  // Nome do arquivo com data
  const dataAtual = new Date().toISOString().split("T")[0];
  link.setAttribute("href", url);
  link.setAttribute("download", `notas_${dataAtual}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ===============================
// 11 — EVENT LISTENERS PARA CONTROLES
// ===============================
if (btnSalvarFormula) {
  btnSalvarFormula.addEventListener("click", salvarFormulaDisciplina);
}

if (btnExportCsv) {
  btnExportCsv.addEventListener("click", exportarCSV);
}

if (tipoCalculoSelect) {
  tipoCalculoSelect.addEventListener("change", () => {
    configDisciplina.tipoCalculo = tipoCalculoSelect.value;
    // Recalcular médias
    if (tableWrapper.querySelector("#tabela-notas")) {
      tableWrapper.querySelectorAll("#tabela-notas tbody tr").forEach(linha => {
        calcularMedia(linha);
      });
    }
  });
}

if (arredondarNotasCheck) {
  arredondarNotasCheck.addEventListener("change", () => {
    configDisciplina.arredondar = arredondarNotasCheck.checked;
    // Recalcular médias
    if (tableWrapper.querySelector("#tabela-notas")) {
      tableWrapper.querySelectorAll("#tabela-notas tbody tr").forEach(linha => {
        calcularMedia(linha);
      });
    }
  });
}

// ===============================
// 12 — INICIALIZAÇÃO
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
    
    // Criar botão de gerenciar componentes
    criarBotaoGerenciarComponentes();
    
    console.log("✅ Página de notas inicializada com sucesso!");
  } catch (err) {
    console.error("❌ Erro na inicialização:", err);
    alert("Erro ao inicializar a página. Verifique o console para mais detalhes.");
  }
})();
