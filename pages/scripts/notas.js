// pages/scripts/aluno.js
import { apiGet, apiPost, apiPut, apiDelete } from "./api.js";

// DOM elements for the page
const selectInstituicao = document.getElementById("selectInstituicao");
const selectDisciplina = document.getElementById("selectDisciplina");
const selectTurma = document.getElementById("selectTurma");
const btnAplicarFiltro = document.getElementById("btnAplicarFiltro");
const listaContainer = document.getElementById("lista-container");
const tabelaBody = document.querySelector("#tabela-alunos tbody");
const semAlunosMsg = document.getElementById("semAlunosMsg");

const novoAlunoBtn = document.getElementById("novoAlunoBtn");
const modalAluno = document.getElementById("modalCadastroAluno");
const closeModalAluno = document.getElementById("closeModalAluno");
const alunoNomeInput = document.getElementById("alunoNome");
const alunoMatriculaInput = document.getElementById("alunoMatricula");
const instituicaoAlunoSelect = document.getElementById("instituicaoAluno");
const disciplinaAlunoSelect = document.getElementById("disciplinaAluno");
const turmaAlunoSelect = document.getElementById("turmaAluno");
const salvarAlunoBtn = document.getElementById("salvarAlunoBtn");
const cancelarAlunoBtn = document.getElementById("cancelarAlunoBtn");

// Verificar se os elementos foram encontrados
if (!novoAlunoBtn) console.error("❌ Botão 'Adicionar Aluno' não encontrado!");
if (!modalAluno) console.error("❌ Modal de cadastro não encontrado!");
if (!salvarAlunoBtn) console.error("❌ Botão 'Salvar' não encontrado!");

// Store data
let instituicoesCache = [];
let disciplinasCache = [];
let turmasCache = [];

// Helper functions
function escapeHtml(s) {
  if (s == null) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

async function openModal() {
  if (!modalAluno) {
    console.error("❌ Modal não encontrado na função openModal!");
    return;
  }
  
  console.log("Abrindo modal...");
  modalAluno.classList.add("show");
  
  // Preencher os campos do modal com os valores dos filtros se estiverem selecionados
  if (selectInstituicao && selectInstituicao.value) {
    if (instituicaoAlunoSelect) {
      instituicaoAlunoSelect.value = selectInstituicao.value;
      // Popular disciplinas baseado na instituição selecionada
      popularDisciplinaSelectByInstituicao(selectInstituicao.value, disciplinaAlunoSelect);
      
      if (selectDisciplina && selectDisciplina.value) {
        if (disciplinaAlunoSelect) {
          disciplinaAlunoSelect.value = selectDisciplina.value;
          // Carregar turmas baseado na instituição e disciplina selecionadas
          await carregarTurmas(selectInstituicao.value, selectDisciplina.value, turmaAlunoSelect);
          
          if (selectTurma && selectTurma.value && turmaAlunoSelect) {
            turmaAlunoSelect.value = selectTurma.value;
          }
        }
      } else {
        // Limpar turma se não houver disciplina selecionada
        if (turmaAlunoSelect) {
          turmaAlunoSelect.innerHTML = "<option value=''>Selecione...</option>";
        }
      }
    }
  } else {
    // Se não houver instituição selecionada, popular disciplinas sem filtro
    if (disciplinaAlunoSelect) {
      popularDisciplinaSelectByInstituicao(null, disciplinaAlunoSelect);
    }
    if (turmaAlunoSelect) {
      turmaAlunoSelect.innerHTML = "<option value=''>Selecione...</option>";
    }
  }
  
  console.log("✅ Modal aberto com sucesso!");
}

function closeModal() {
  if (!modalAluno) {
    console.error("❌ Modal não encontrado na função closeModal!");
    return;
  }
  modalAluno.classList.remove("show");
  console.log("✅ Modal fechado!");
}

// Carregar as Instituições
async function carregarInstituicoes() {
  try {
    const resp = await apiGet("/instituicoes");
    instituicoesCache = Array.isArray(resp) ? resp : (resp.data || []);
    
    // Popular select de filtro
    selectInstituicao.innerHTML = "<option value=''>Selecione...</option>";
    instituicoesCache.forEach(inst => {
      const option = document.createElement("option");
      option.value = inst.id || inst.ID;
      option.textContent = inst.nome || inst.NOME;
      selectInstituicao.appendChild(option);
    });
    
    // Popular select do modal
    instituicaoAlunoSelect.innerHTML = "<option value=''>Selecione...</option>";
    instituicoesCache.forEach(inst => {
      const option = document.createElement("option");
      option.value = inst.id || inst.ID;
      option.textContent = inst.nome || inst.NOME;
      instituicaoAlunoSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Erro ao carregar instituições:", err);
  }
}

// Carregar todas as Disciplinas
async function carregarDisciplinas() {
  try {
    const resp = await apiGet("/disciplinas");
    disciplinasCache = Array.isArray(resp) ? resp : (resp.data || []);
  } catch (err) {
    console.error("Erro ao carregar disciplinas:", err);
    disciplinasCache = [];
  }
}

// Popular disciplinas filtradas por instituição
function popularDisciplinaSelectByInstituicao(instituicaoId, targetSelect) {
  targetSelect.innerHTML = "<option value=''>Selecione...</option>";
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

// Carregar turmas para a Instituição e Disciplina selecionadas
async function carregarTurmas(instituicaoId, disciplinaId, targetSelect) {
  try {
    const params = new URLSearchParams();
    if (instituicaoId) params.append("instituicao_id", instituicaoId);
    if (disciplinaId) params.append("disciplina_id", disciplinaId);

    const turmas = await apiGet(`/turmas?${params.toString()}`);
    const turmasList = Array.isArray(turmas) ? turmas : (turmas.data || []);

    targetSelect.innerHTML = "<option value=''>Selecione...</option>";
    turmasList.forEach(turma => {
      const option = document.createElement("option");
      option.value = turma.id || turma.ID;
      option.textContent = turma.nome || turma.NOME;
      targetSelect.appendChild(option);
    });
    
    if (turmasList.length === 0) {
      targetSelect.innerHTML = "<option value=''>Nenhuma turma disponível</option>";
    }
  } catch (err) {
    console.error("Erro ao carregar turmas:", err);
    targetSelect.innerHTML = "<option value=''>Erro ao carregar</option>";
  }
}

// Carregar alunos com base nos filtros
async function carregarAlunos() {
  const instituicaoId = selectInstituicao.value;
  const disciplinaId = selectDisciplina.value;
  const turmaId = selectTurma.value;

  // Validar se pelo menos um filtro foi selecionado
  if (!instituicaoId && !disciplinaId && !turmaId) {
    alert("Por favor, selecione pelo menos um filtro (Instituição, Disciplina ou Turma) para visualizar os alunos.");
    return;
  }

  try {
    const params = new URLSearchParams();
    if (instituicaoId) params.append("instituicao_id", instituicaoId);
    if (disciplinaId) params.append("disciplina_id", disciplinaId);
    if (turmaId) params.append("turma_id", turmaId);

    console.log("Carregando alunos com filtros:", {
      instituicao_id: instituicaoId,
      disciplina_id: disciplinaId,
      turma_id: turmaId
    });

    const alunos = await apiGet(`/alunos?${params.toString()}`);
    const alunosList = Array.isArray(alunos) ? alunos : (alunos.data || []);
    
    console.log("Alunos recebidos:", alunosList);
    
    tabelaBody.innerHTML = "";

    if (alunosList.length === 0) {
      semAlunosMsg.style.display = "block";
      listaContainer.style.display = "block";
    } else {
      semAlunosMsg.style.display = "none";
      listaContainer.style.display = "block";
    }

    alunosList.forEach(aluno => {
      const tr = document.createElement("tr");
      const alunoId = aluno.id || aluno.ID || "";
      const alunoNome = aluno.nome || aluno.NOME || "";
      const alunoMatricula = aluno.matricula || aluno.MATRICULA || "";
      
      tr.innerHTML = `
        <td>${escapeHtml(alunoNome)}</td>
        <td>${escapeHtml(alunoMatricula)}</td>
        <td>
          <button class="btn small secondary btn-editar" data-id="${alunoId}">Editar</button>
          <button class="btn small danger btn-excluir" data-id="${alunoId}">Excluir</button>
        </td>
      `;
      tabelaBody.appendChild(tr);
    });
    
    // Adicionar eventos aos botões
    tabelaBody.querySelectorAll(".btn-editar").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        // TODO: Implementar edição
        alert("Funcionalidade de edição ainda não implementada");
      });
    });
    
    tabelaBody.querySelectorAll(".btn-excluir").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.currentTarget.dataset.id;
        if (confirm("Deseja realmente excluir este aluno?")) {
          try {
            await apiDelete(`/alunos/${id}`);
            alert("Aluno excluído com sucesso!");
            carregarAlunos();
          } catch (err) {
            console.error("Erro ao excluir aluno:", err);
            alert("Erro ao excluir aluno.");
          }
        }
      });
    });
  } catch (err) {
    console.error("Erro ao carregar alunos:", err);
    alert("Erro ao carregar alunos. Verifique o console para mais detalhes.");
    tabelaBody.innerHTML = "";
    semAlunosMsg.style.display = "block";
    listaContainer.style.display = "block";
  }
}

// Event Listeners

// Quando mudar instituição no filtro, filtrar disciplinas
selectInstituicao.addEventListener("change", () => {
  const instId = selectInstituicao.value;
  popularDisciplinaSelectByInstituicao(instId, selectDisciplina);
  // Limpar turma quando mudar instituição
  selectTurma.innerHTML = "<option value=''>Selecione...</option>";
});

// Quando mudar disciplina no filtro, carregar turmas
selectDisciplina.addEventListener("change", async () => {
  const instId = selectInstituicao.value;
  const discId = selectDisciplina.value;
  await carregarTurmas(instId, discId, selectTurma);
});

// Quando mudar instituição no modal, filtrar disciplinas
instituicaoAlunoSelect.addEventListener("change", () => {
  const instId = instituicaoAlunoSelect.value;
  popularDisciplinaSelectByInstituicao(instId, disciplinaAlunoSelect);
  // Limpar turma quando mudar instituição
  turmaAlunoSelect.innerHTML = "<option value=''>Selecione...</option>";
});

// Quando mudar disciplina no modal, carregar turmas
disciplinaAlunoSelect.addEventListener("change", async () => {
  const instId = instituicaoAlunoSelect.value;
  const discId = disciplinaAlunoSelect.value;
  await carregarTurmas(instId, discId, turmaAlunoSelect);
});

// Exibir o modal para adicionar aluno
if (novoAlunoBtn) {
  novoAlunoBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("✅ Botão 'Adicionar Aluno' clicado!");
    
    if (!modalAluno) {
      console.error("❌ Modal não encontrado!");
      return;
    }
    
    alunoNomeInput.value = "";
    alunoMatriculaInput.value = "";
    await openModal();
    console.log("✅ Modal aberto!");
  });
  console.log("✅ Event listener adicionado ao botão 'Adicionar Aluno'");
} else {
  console.error("❌ Botão 'Adicionar Aluno' não encontrado!");
}

// Fechar modal
closeModalAluno.addEventListener("click", closeModal);
if (cancelarAlunoBtn) {
  cancelarAlunoBtn.addEventListener("click", closeModal);
}

// Salvar novo aluno
if (salvarAlunoBtn) {
  salvarAlunoBtn.addEventListener("click", async () => {
    const nome = alunoNomeInput.value.trim();
    const matricula = alunoMatriculaInput.value.trim();
    const turma_id = turmaAlunoSelect.value;

    if (!nome || !matricula || !turma_id) {
      alert("Por favor, preencha todos os campos obrigatórios (Nome, Matrícula e Turma).");
      return;
    }

    try {
      const alunoData = { 
        nome, 
        matricula, 
        turma_id: Number(turma_id) 
      };
      
      console.log("Enviando dados do aluno:", alunoData);
      const response = await apiPost("/alunos", alunoData);
      console.log("Resposta do servidor:", response);
      
      alert("Aluno cadastrado com sucesso!");
      closeModal();
      
      // Limpar campos
      alunoNomeInput.value = "";
      alunoMatriculaInput.value = "";
      
      // Recarregar a lista de alunos se houver filtros aplicados
      if (selectInstituicao.value || selectDisciplina.value || selectTurma.value) {
        await carregarAlunos();
      }
    } catch (err) {
      console.error("Erro ao salvar aluno:", err);
      const errorMsg = err.response?.data?.error || err.message || "Erro ao cadastrar aluno.";
      alert(`Erro ao cadastrar aluno: ${errorMsg}`);
    }
  });
} else {
  console.error("Botão 'Salvar' não encontrado!");
}

// Aplicar filtro
btnAplicarFiltro.addEventListener("click", async () => {
  await carregarAlunos();
});

// Inicializar a página
(async function init() {
  await carregarInstituicoes();
  await carregarDisciplinas();
  // Popular disciplinas inicialmente (sem filtro)
  popularDisciplinaSelectByInstituicao(null, selectDisciplina);
  popularDisciplinaSelectByInstituicao(null, disciplinaAlunoSelect);
})();
