//Feito por Matheus Henrique Portugal Narducci

import { apiGet, apiPost, apiPut, apiDelete } from "./api.js";

// Seletores
const turmaSelect = document.getElementById("select-turma");
const disciplinaSelect = document.getElementById("select-disciplina");
const tabelaNotas = document.getElementById("tabela-notas").querySelector("tbody");
const formulaMediaInput = document.getElementById("formulaMedia");

let turmaIdSelecionada = null;
let disciplinaIdSelecionada = null;


  if (window.lucide && lucide.createIcons) {
  lucide.createIcons();
}
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
    const data = await apiGet(`/notas/turma/${turmaIdSelecionada}/disciplina/${disciplinaIdSelecionada}`);
    tabelaNotas.innerHTML = "";

    const { alunos, componentes } = data;

    // Montar cabeçalho dinamicamente
    const thead = document.querySelector("#tabela-notas thead tr");
    thead.innerHTML = `
      <th>Aluno</th>
      <th>Matrícula</th>
      ${componentes.map(c => `<th>${c.sigla}</th>`).join("")}
      <th>Média</th>
    `;

    alunos.forEach(a => {
      const linha = document.createElement("tr");

      const colunasNotas = a.componentes
        .map(c => `<td>
              <input type="number" min="0" max="10" step="0.1"
                     value="${c.valor !== null ? c.valor : ""}"
                     data-aluno="${a.aluno_id}"
                     data-componente="${c.componente_id}"
                     style="width:60px;">
            </td>`)
        .join("");

      linha.innerHTML = `<td>${a.nome}</td><td>${a.matricula}</td>${colunasNotas}<td class="media">—</td>`;

      tabelaNotas.appendChild(linha);
      calcularMedia(linha); // Calcula média inicial
    });

    // Adiciona listener para recalcular média ao digitar
    tabelaNotas.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener('input', () => {
        const linha = input.closest('tr');
        calcularMedia(linha);
      });
    });

  } catch (err) {
    console.error("Erro ao carregar notas:", err);
  }
}

// ===============================
// 4 — CALCULAR MÉDIA DINÂMICA
// ===============================
function calcularMedia(linha) {
  const notas = linha.querySelectorAll('input[type="number"]');
  let soma = 0;
  let qtd = 0;

  notas.forEach(input => {
    const valor = parseFloat(input.value);
    if (!isNaN(valor)) {
      soma += valor;
      qtd++;
    }
  });

  const mediaCell = linha.querySelector('td.media');
  mediaCell.textContent = qtd > 0 ? (soma / qtd).toFixed(2) : '—';
}

// ===============================
// 5 — SALVAR NOTA AUTOMÁTICO (AO ALTERAR INPUT)
// ===============================
tabelaNotas.addEventListener("change", async (e) => {
  if (e.target.tagName !== "INPUT") return;

  const aluno_id = e.target.dataset.aluno;
  const componente_id = e.target.dataset.componente;
  const valor = e.target.value;

  if (!aluno_id || !componente_id) return;

  try {
    const resposta = await apiPut("/notas/registrar", { aluno_id, componente_id, valor });
    console.log("Nota salva:", resposta.message);
  } catch (err) {
    console.error("Erro ao salvar nota:", err);
  }
}); 

document.addEventListener("DOMContentLoaded", () => {
  // Seletores de fallback — tenta vários nomes/ids possíveis
  const logoutTrigger =
    document.getElementById("logoutBtn") ||
    document.querySelector('a[data-logout]') ||
    document.querySelector('a[href="#"][id="logoutBtn"]') ||
    document.querySelector('a.logout-link') ||
    document.querySelector('a:contains("Sair")'); // fallback fraco, pode falhar em alguns navegadores

  const modal = document.getElementById("logoutModal");
  const cancelBtn = document.getElementById("logoutCancel") || document.getElementById("cancelLogout");
  const confirmBtn = document.getElementById("logoutConfirm") || document.getElementById("confirmLogout");

  // Segurança: se modal ou trigger não existem, não crashar
  if (!modal) {
    console.warn("logout.js: modal (#logoutModal) não encontrado no DOM.");
    return;
  }

  // Abre o modal ao clicar no link/botão de logout
  if (logoutTrigger) {
    logoutTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      modal.style.display = "flex"; // mostra o modal
    });
  } else {
    // Se não encontrar o trigger, tenta ligar a todos os links 'Sair' por texto (último recurso)
    document.querySelectorAll("a").forEach(a => {
      if (a.textContent.trim().toLowerCase() === "sair") {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          modal.style.display = "flex";
        });
      }
    });
  }

  // Cancelar fecha o modal
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  } else {
    console.warn("logout.js: botão de cancelar não encontrado (logoutCancel/cancelLogout).");
  }

  // Confirmar faz logout real
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      try {
        localStorage.removeItem("token");
      } catch (err) {
        console.warn("Erro ao remover token do localStorage:", err);
      }
      // opcional: também limpar outros dados de sessão
      // localStorage.removeItem('user');
      modal.style.display = "none";
      window.location.href = "index.html";
    });
  } else {
    console.warn("logout.js: botão de confirmar não encontrado (logoutConfirm/confirmLogout).");
  }

  // Fecha o modal se clicar fora da caixa
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});



// ===============================
// INICIAR
// ===============================
carregarTurmas();
