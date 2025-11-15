// notas.js
lucide.createIcons();

// Referências aos elementos
const tabela = document.getElementById('tabela-notas').querySelector('tbody');
const btnCarregar = document.getElementById('btn-carregar');
const btnSalvar = document.getElementById('btn-salvar');
const btnExportar = document.getElementById('btn-exportar');
const selectDisciplina = document.getElementById('select-disciplina');
const selectTurma = document.getElementById('select-turma');

// Simulação de alunos por disciplina/turma
const alunosExemplo = {
  'PI2-Turma1': [
    { nome: 'Aluno 1' },
    { nome: 'Aluno 2' },
    { nome: 'Aluno 3' },
  ],
  'PI2-Turma2': [
    { nome: 'Aluno A' },
    { nome: 'Aluno B' },
  ]
};

// Função para calcular média de uma linha
function calcularMedia(linha) {
  const notas = linha.querySelectorAll('input[type="number"]');
  let soma = 0;
  let quantidade = 0;

  notas.forEach(input => {
    const valor = parseFloat(input.value);
    if (!isNaN(valor)) {
      soma += valor;
      quantidade++;
    }
  });

  const mediaCell = linha.querySelector('td:last-child');
  mediaCell.textContent = quantidade > 0 ? (soma / quantidade).toFixed(2) : '—';
}

// Recalcular médias quando digitar
function adicionarEventosInputs() {
  const inputs = tabela.querySelectorAll('input[type="number"]');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const linha = input.closest('tr');
      calcularMedia(linha);
    });
  });
}

// Carregar alunos ao clicar no botão
btnCarregar.addEventListener('click', () => {
  const disciplina = selectDisciplina.value;
  const turma = selectTurma.value;

  if (!disciplina || !turma) {
    alert('Selecione disciplina e turma.');
    return;
  }

  const chave = `${disciplina}-${turma}`;
  const alunos = alunosExemplo[chave] || [];

  tabela.innerHTML = ''; // limpa tabela

  alunos.forEach(aluno => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${aluno.nome}</td>
      <td><input type="number" step="0.01" min="0" max="10"></td>
      <td><input type="number" step="0.01" min="0" max="10"></td>
      <td><input type="number" step="0.01" min="0" max="10"></td>
      <td>—</td>
    `;
    tabela.appendChild(tr);
  });

  adicionarEventosInputs();
});

// Salvar notas no localStorage
btnSalvar.addEventListener('click', () => {
  const notas = [];
  tabela.querySelectorAll('tr').forEach(tr => {
    const aluno = tr.children[0].textContent;
    const p1 = parseFloat(tr.children[1].querySelector('input').value) || 0;
    const p2 = parseFloat(tr.children[2].querySelector('input').value) || 0;
    const p3 = parseFloat(tr.children[3].querySelector('input').value) || 0;
    const media = tr.children[4].textContent;
    notas.push({ aluno, P1: p1, P2: p2, P3: p3, media });
  });

  localStorage.setItem('notas', JSON.stringify(notas));
  alert('Notas salvas com sucesso!');
});

// Exportar CSV
btnExportar.addEventListener('click', () => {
  let csv = 'Aluno,P1,P2,P3,Média\n';
  tabela.querySelectorAll('tr').forEach(tr => {
    const aluno = tr.children[0].textContent;
    const p1 = tr.children[1].querySelector('input').value || 0;
    const p2 = tr.children[2].querySelector('input').value || 0;
    const p3 = tr.children[3].querySelector('input').value || 0;
    const media = tr.children[4].textContent || 0;
    csv += `${aluno},${p1},${p2},${p3},${media}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'notas.csv';
  a.click();
  URL.revokeObjectURL(url);
});
