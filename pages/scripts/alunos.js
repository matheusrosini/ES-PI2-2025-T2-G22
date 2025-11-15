// Seleciona o formulário de cadastro e a tabela
const formCadastro = document.getElementById('form-cadastro');
const tabela = document.getElementById('tabela-alunos').querySelector('tbody');

// Adiciona evento de envio do formulário de cadastro
formCadastro.addEventListener('submit', (e) => {
  e.preventDefault();
  const matricula = document.getElementById('matricula').value;
  const nome = document.getElementById('nome').value;

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

// Função para excluir aluno ao clicar em "Excluir"
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    e.target.closest('tr').remove();
  }
});

// Importação de arquivos CSV ou JSON
const formImportar = document.getElementById('form-importar');

formImportar.addEventListener('submit', (e) => {
  e.preventDefault();
  const arquivo = document.getElementById('arquivo').files[0];

  if (!arquivo) {
    alert('Selecione um arquivo para importar!');
    return;
  }

  const leitor = new FileReader();

  if (arquivo.name.endsWith('.csv')) {
    leitor.onload = function(event) {
      const linhas = event.target.result.split('\n');
      linhas.forEach(linha => {
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
    };
    leitor.readAsText(arquivo);
  }

  if (arquivo.name.endsWith('.json')) {
    leitor.onload = function(event) {
      const alunos = JSON.parse(event.target.result);
      alunos.forEach(a => {
        const matricula = a.matricula || a.id || a.codigo || a.RA;
        const nome = a.nome || a.fullName || a.completeName || a.name;

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
    };
    leitor.readAsText(arquivo);
  }

  formImportar.reset();
});
