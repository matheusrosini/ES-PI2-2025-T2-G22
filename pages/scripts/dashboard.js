const API_URL = "https://es-pi2-2025-t2-g22-production-b5bc.up.railway.app/api";

// ======================
// TESTE API
// ======================
async function testarAPI() {
  try {
    const resposta = await fetch(`${API_URL}/usuarios`);
    console.log("STATUS DA API:", resposta.status);
  } catch (erro) {
    console.error("Erro ao conectar:", erro);
  }
}
testarAPI();

// ======================
// FORMULÁRIO DE INSTITUIÇÃO
// ======================
document.getElementById("form-instituicao").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Pegando pela ordem EXATA do seu HTML
  const nome = e.target[0].value;
  const curso = e.target[1].value;

  const data = { nome, curso };

  const resposta = await fetch(`${API_URL}/instituicoes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  alert(resposta.ok ? "Instituição cadastrada!" : "Erro ao cadastrar.");
});

// ======================
// FORMULÁRIO DE DISCIPLINA
// ======================
document.getElementById("form-disciplina").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = e.target[0].value;
  const sigla = e.target[1].value;
  const codigo = e.target[2].value;
  const periodo = e.target[3].value;

  const data = { nome, sigla, codigo, periodo };

  const resposta = await fetch(`${API_URL}/disciplinas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  alert(resposta.ok ? "Disciplina cadastrada!" : "Erro ao cadastrar.");
});

lucide.createIcons();

    const deleteButtons = document.querySelectorAll('.delete');
    const modal = document.getElementById('modal');
    const fecharModal = document.getElementById('fechar-modal');

    deleteButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        modal.style.display = 'flex';
      });
    });

    fecharModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });

    // Acordeão
    const sectionHeaders = document.querySelectorAll('.section-header');

    sectionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const section = header.parentElement;
        const isOpen = section.classList.contains('open');
        
        document.querySelectorAll('.form-section').forEach(sec => {
          sec.classList.remove('open');
          sec.querySelector('.section-header').classList.remove('active');
        });
        
        if (!isOpen) {
          section.classList.add('open');
          header.classList.add('active');
        }
      });
    });