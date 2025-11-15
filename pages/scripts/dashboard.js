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
