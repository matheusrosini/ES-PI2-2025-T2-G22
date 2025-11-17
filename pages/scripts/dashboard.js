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



carregarDashboard();
