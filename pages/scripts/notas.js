<<<<<<< Updated upstream
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
=======
// Matheus Henrique Portugal Narducci
(function () {
  // ativar ícones lucide
  if (window.lucide && lucide.createIcons) lucide.createIcons();


  const instituicoes = [
    { id: 1, nome: 'FATEC', disciplinaIds: [1,2] },
    { id: 2, nome: 'USP', disciplinaIds: [2,3] },
    { id: 3, nome: 'UNESP', disciplinaIds: [1,3] }
  ];

  const disciplinas = [
    { id: 1, nome: 'Estruturas de Dados', formula_nota: '(P1 + P2 + P3) / 3', componentes: [
      { id: 1, nome: 'Prova 1', sigla: 'P1' },
      { id: 2, nome: 'Prova 2', sigla: 'P2' },
      { id: 3, nome: 'Prova 3', sigla: 'P3' }
    ]},
    { id: 2, nome: 'Banco de Dados', formula_nota: '(P1*0.4 + TRAB*0.6)', componentes: [
      { id: 4, nome: 'Prova 1', sigla: 'P1' },
      { id: 5, nome: 'Trabalho', sigla: 'TRAB' }
    ]},
    { id: 3, nome: 'POO', formula_nota: '', componentes: [
      { id: 6, nome: 'P1', sigla: 'P1' },
      { id: 7, nome: 'P2', sigla: 'P2' },
      { id: 8, nome: 'T1', sigla: 'T1' }
    ]}
  ];

  const turmas = [
    { id: 101, nome: 'Turma A - 2025', disciplinaId: 1, instituicaoId: 1 },
    { id: 102, nome: 'Turma B - 2025', disciplinaId: 1, instituicaoId: 3 },
    { id: 201, nome: 'Turma BD - 2025', disciplinaId: 2, instituicaoId: 1 },
    { id: 301, nome: 'Turma POO - 2025', disciplinaId: 3, instituicaoId: 2 }
  ];

  const alunos = [
    { id: 1001, nome: 'Ana Clara', matricula: '2025001', turmaId: 101 },
    { id: 1002, nome: 'Bruno Silva', matricula: '2025002', turmaId: 101 },
    { id: 1003, nome: 'Carlos Souza', matricula: '2025003', turmaId: 102 },
    { id: 2001, nome: 'Daniela Lima', matricula: '2025101', turmaId: 201 },
    { id: 3001, nome: 'Eduardo Ramos', matricula: '2025201', turmaId: 301 }
  ];

  // Estado local (simula persistência)
  // estrutura: { alunoId, componenteSigla, valor }
  const notasSalvas = [];

  // Dom 
  const selectInstituicao = document.getElementById('selectInstituicao');
  const selectDisciplina = document.getElementById('selectDisciplina');
  const selectTurma = document.getElementById('selectTurma');
  const btnCarregarAlunos = document.getElementById('btnCarregarAlunos');
  const tableWrapper = document.getElementById('tableWrapper');
  const nenhumaTabela = document.getElementById('nenhumaTabela');
  const formulaMediaInput = document.getElementById('formulaMedia');
  const btnSalvarNotas = document.getElementById('btnSalvarNotas');
  const btnExportCsv = document.getElementById('btnExportCsv');

  
  function popularInstituicoes() {
    instituicoes.forEach(inst => {
      const opt = document.createElement('option');
      opt.value = inst.id;
      opt.textContent = inst.nome;
      selectInstituicao.appendChild(opt);
    });
  }

  // ao mudar instituição: popular disciplinas possíveis (filtrar por disciplinaIds)
  selectInstituicao.addEventListener('change', () => {
    selectDisciplina.innerHTML = '<option value="">Selecione a disciplina</option>';
    selectTurma.innerHTML = '<option value="">Selecione a turma</option>';
    const iid = Number(selectInstituicao.value) || null;
    if (!iid) return;
    const inst = instituicoes.find(x => x.id === iid);
    if (!inst) return;
    // popula disciplinas que pertencem à instituição (via disciplinaIds)
    inst.disciplinaIds.forEach(did => {
      const d = disciplinas.find(x => x.id === did);
      if (d) {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = d.nome;
        selectDisciplina.appendChild(opt);
      }
    });
  });

  // ao mudar disciplina: popular turmas que têm essa disciplina e a instituição selecionada
  selectDisciplina.addEventListener('change', () => {
    selectTurma.innerHTML = '<option value="">Selecione a turma</option>';
    const did = Number(selectDisciplina.value) || null;
    const iid = Number(selectInstituicao.value) || null;
    if (!did || !iid) return;
    turmas
      .filter(t => t.disciplinaId === did && t.instituicaoId === iid)
      .forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = t.nome;
        selectTurma.appendChild(opt);
      });
    // configurar fórmula ao mudar disciplina
    const disc = disciplinas.find(x => x.id === did);
    if (disc) formulaMediaInput.value = disc.formula_nota || getDefaultFormula(disc.componentes);
  });

  // fórmula padrão (média aritmética) se disciplina não tiver
  function getDefaultFormula(componentes) {
    if (!componentes || componentes.length === 0) return '';
    const siglas = componentes.map(c => c.sigla);
    return `(${siglas.join(' + ')}) / ${siglas.length}`;
  }

 // carregar alunos e montar tabela dinâmica
  btnCarregarAlunos.addEventListener('click', () => {
    const instituicaoId = Number(selectInstituicao.value) || null;
    const disciplinaId = Number(selectDisciplina.value) || null;
    const turmaId = Number(selectTurma.value) || null;
    if (!instituicaoId || !disciplinaId || !turmaId) {
      alert('Selecione instituição, disciplina e turma antes de carregar.');
      return;
    }

    const disciplina = disciplinas.find(d => d.id === disciplinaId);
    const alunosDaTurma = alunos.filter(a => a.turmaId === turmaId);
    if (!disciplina) return;

    // limpar wrapper
    tableWrapper.innerHTML = '';

    // montar tabela
    const table = document.createElement('table');
    table.id = 'tabela-notas-dinamica';
    table.innerHTML = `
      <thead>
        <tr>
          <th>Aluno</th>
          ${disciplina.componentes.map(c => `<th>${escapeHtml(c.sigla)}<br><small style="font-weight:400">${escapeHtml(c.nome)}</small></th>`).join('')}
          <th>Média</th>
        </tr>
      </thead>
      <tbody>
        ${alunosDaTurma.map(a => {
          const inputs = disciplina.componentes.map(c => `<td><input data-aluno="${a.id}" data-sigla="${escapeHtml(c.sigla)}" type="number" step="0.01" min="0" max="10" /></td>`).join('');
          return `<tr data-aluno="${a.id}"><td>${escapeHtml(a.nome)}</td>${inputs}<td class="mediaCell">—</td></tr>`;
        }).join('')}
      </tbody>
    `;
    tableWrapper.appendChild(table);
    nenhumaTabela.style.display = 'none';

    // garantir que fórmula esteja configurada (disciplina > input)
    formulaMediaInput.value = disciplina.formula_nota || getDefaultFormula(disciplina.componentes);

    // anexar listeners aos inputs e calcular médias iniciais   
    attachInputListeners();
    document.querySelectorAll('#tabela-notas-dinamica tbody tr').forEach(tr => calcularMediaLinha(tr, disciplina));
  });

  // Anexa listeners aos inputs de nota
  function attachInputListeners() {
    const inputs = document.querySelectorAll('#tabela-notas-dinamica tbody input[type="number"]');
    inputs.forEach(inp => {
      inp.addEventListener('input', () => {
        const tr = inp.closest('tr');
        const disciplina = disciplinas.find(d => d.id === Number(selectDisciplina.value));
        calcularMediaLinha(tr, disciplina);
      });
    });
  }

  // Calcula média de uma linha (um aluno) usando fórmula (do input)
  function calcularMediaLinha(trElement, disciplina) {
    if (!trElement) return;
    const alunoId = Number(trElement.getAttribute('data-aluno'));
    const componentes = disciplina ? disciplina.componentes : [];
    const siglas = componentes.map(c => c.sigla);

    // coletar valores por sigla
    const valores = {};
    siglas.forEach(sg => {
      const inp = trElement.querySelector(`input[data-sigla="${sg}"]`);
      const v = inp ? parseFloat(inp.value) : NaN;
      valores[sg] = (!isNaN(v) ? v : null);
    });

    // usar fórmula do input (editor local) se preenchida, senão média aritmética
    const formulaRaw = (formulaMediaInput.value || '').trim();

    let media = null;
    if (formulaRaw) {
      // substitui siglas por valores (0 quando null)
      let expr = formulaRaw;
      siglas.forEach(sg => {
        const val = (valores[sg] !== null) ? valores[sg] : 0;
        expr = expr.replace(new RegExp('\\b' + escapeRegExp(sg) + '\\b', 'g'), String(val));
      });

      // segurança: só permite números e operadores básicos
      if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
        media = '—';
      } else {
        try {
          
          media = Function('"use strict"; return (' + expr + ')')();
          if (typeof media !== 'number' || !isFinite(media)) media = '—';
          else media = Number(media.toFixed(2));
        } catch (e) {
          media = '—';
        }
      }
    } else {
      // média aritmética simples
      let soma = 0;
      let cnt = 0;
      siglas.forEach(sg => {
        const v = valores[sg];
        if (v !== null) { soma += v; cnt++; }
      });
      if (cnt === 0) media = '—';
      else media = Number((soma / cnt).toFixed(2));
    }

    const mediaCell = trElement.querySelector('.mediaCell');
    mediaCell.textContent = (media === '—' ? '—' : (media.toFixed ? media.toFixed(2) : media));
  }

  // salvar notas localmente ou exportar CSV
  btnSalvarNotas.addEventListener('click', () => {
    const disciplina = disciplinas.find(d => d.id === Number(selectDisciplina.value));
    if (!disciplina) { alert('Carregue uma disciplina antes de salvar.'); return; }
    const rows = document.querySelectorAll('#tabela-notas-dinamica tbody tr');
    rows.forEach(tr => {
      const alunoId = Number(tr.getAttribute('data-aluno'));
      disciplina.componentes.forEach(comp => {
        const sigla = comp.sigla;
        const inp = tr.querySelector(`input[data-sigla="${sigla}"]`);
        const val = inp && inp.value !== '' ? Number(inp.value) : null;
        const existingIndex = notasSalvas.findIndex(n => n.alunoId === alunoId && n.componenteSigla === sigla);
        if (val === null) {
          if (existingIndex >= 0) notasSalvas.splice(existingIndex, 1);
        } else {
          if (existingIndex >= 0) notasSalvas[existingIndex].valor = val;
          else notasSalvas.push({ alunoId, componenteSigla: sigla, valor: val });
        }
      });
    });
    alert('Notas salvas localmente (simulado).');
    // você pode enviar `notasSalvas` para o backend via fetch quando tiver API
  });

  // export CSV dinâmico
  btnExportCsv.addEventListener('click', () => {
    const disciplina = disciplinas.find(d => d.id === Number(selectDisciplina.value));
    if (!disciplina) { alert('Carregue uma disciplina antes de exportar.'); return; }
    const rows = Array.from(document.querySelectorAll('#tabela-notas-dinamica tbody tr'));
    const headers = ['Aluno', ...disciplina.componentes.map(c => c.sigla), 'Média'];
    const csvRows = [headers.join(',')];

    rows.forEach(tr => {
      const alunoNome = tr.querySelector('td').textContent.trim();
      const valores = disciplina.componentes.map(c => {
        const inp = tr.querySelector(`input[data-sigla="${c.sigla}"]`);
        return inp && inp.value !== '' ? inp.value : '';
      });
      const media = tr.querySelector('.mediaCell').textContent.trim();
      csvRows.push([escapeCsv(alunoNome), ...valores.map(escapeCsv), media].join(','));
    });

    const csvContent = csvRows.join('\n');
    downloadTextFile(csvContent, `notas_export_${Date.now()}.csv`);
  });

  
  function escapeHtml(s) {
    if (s === undefined || s === null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function escapeCsv(v) {
    if (v === undefined || v === null) return '';
    const s = String(v);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  function downloadTextFile(text, filename) {
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // inicialização: popular instituições
  popularInstituicoes();

  // recalcula todas se fórmula for alterada manualmente
  formulaMediaInput.addEventListener('input', () => {
    const disciplina = disciplinas.find(d => d.id === Number(selectDisciplina.value));
    if (!disciplina) return;
    document.querySelectorAll('#tabela-notas-dinamica tbody tr').forEach(tr => calcularMediaLinha(tr, disciplina));
  });

  // antes de fechar (poderíamos checar notasSalvas vs inputs)
  window.addEventListener('beforeunload', (e) => {
    // nenhum bloqueio ativo por enquanto
  });

})();
>>>>>>> Stashed changes
