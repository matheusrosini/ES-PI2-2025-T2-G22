//Feito por Matheus Henrique Portugal Narducci

// Seleciona o formulário de cadastro e a tabela
const formCadastro = document.getElementById('form-cadastro');
const tabela = document.getElementById('tabela-alunos').querySelector('tbody');

// 🟢 Delegação de eventos: excluir aluno
tabela.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    e.target.closest('tr').remove();
  }
});

// 🟢 Adiciona aluno manualmente
formCadastro.addEventListener('submit', (e) => {
  e.preventDefault();

  const matricula = document.getElementById('matricula').value.trim();
  const nome = document.getElementById('nome').value.trim();

  if (!matricula || !nome) {
    alert("Preencha todos os campos!");
    return;
  }

  const novaLinha = document.createElement('tr');
  novaLinha.innerHTML = `
    <td>${matricula}</td>
    <td>${nome}</td>
    <td class="actions">
      <button class="edit-btn">Editar</button>
      <button class="delete-btn">Excluir</button>
    </td>
  `;
  tabela.appendChild(novaLinha);
  formCadastro.reset();
});

// 🟢 Importação de CSV e JSON
const formImportar = document.getElementById('form-importar');

formImportar.addEventListener('submit', (e) => {
  e.preventDefault();
  const arquivo = document.getElementById('arquivo').files[0];

  if (!arquivo) {
    alert('Selecione um arquivo para importar!');
    return;
  }

  const leitor = new FileReader();

  leitor.onload = function(event) {
    const dados = event.target.result;

    // ---------------- CSV ----------------
    if (arquivo.name.endsWith('.csv')) {
      const linhas = dados.split('\n');

      linhas.forEach(linha => {
        if (!linha.trim()) return; // ignora linha vazia

        const [matricula, nome] = linha.split(',');

        if (matricula && nome) {
          const novaLinha = document.createElement('tr');
          novaLinha.innerHTML = `
            <td>${matricula.trim()}</td>
            <td>${nome.trim()}</td>
            <td class="actions">
              <button class="edit-btn">Editar</button>
              <button class="delete-btn">Excluir</button>
            </td>
          `;
          tabela.appendChild(novaLinha);
        }
      });
    }

    // ---------------- JSON ----------------
    if (arquivo.name.endsWith('.json')) {
      let alunos;

      try {
        alunos = JSON.parse(dados);
      } catch (e) {
        alert("Arquivo JSON inválido!");
        return;
      }

      alunos.forEach(a => {
        // Fallbacks para diferentes formatos de JSON
        const matricula =
          a.matricula || a.id || a.codigo || a.RA || null;

        const nome =
          a.nome || a.fullName || a.completeName || a.name || null;

        if (matricula && nome) {
          const novaLinha = document.createElement('tr');
          novaLinha.innerHTML = `
            <td>${matricula}</td>
            <td>${nome}</td>
            <td class="actions">
              <button class="edit-btn">Editar</button>
              <button class="delete-btn">Excluir</button>
            </td>
          `;
          tabela.appendChild(novaLinha);
        }
      });
    }
  };

  leitor.readAsText(arquivo);
  formImportar.reset();
});
