// Matheus Henrique Portugal Narducci

(function () {
  // ativar icons lucide se disponível
  if (window.lucide && lucide.createIcons) lucide.createIcons();

  // Dados de exemplo 
  const instituicoes = [
    { id: 1, nome: 'FATEC', disciplinaIds: [1, 2] },
    { id: 2, nome: 'USP', disciplinaIds: [2, 3] },
    { id: 3, nome: 'UNESP', disciplinaIds: [1, 3] }
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

  // Estado local (simulação)
  const notasSalvas = []; // { alunoId, componenteSigla, valor }
  const auditoria = [];   // { timestamp, alunoId, componenteSigla, valorAntigo, valorNovo }

  /* -------------------------
     DOM elements
     ------------------------- */
  const selectInstituicao = document.getElementById('selectInstituicao');
  const selectDisciplina = document.getElementById('selectDisciplina');
  const selectTurma = document.getElementById('selectTurma');
  const btnCarregarAlunos = document.getElementById('btnCarregarAlunos');
  const tableWrapper = document.getElementById('tableWrapper');
  const nenhumaTabela = document.getElementById('nenhumaTabela');
  const formulaMediaInput = document.getElementById('formulaMedia');
  const btnSalvarNotas = document.getElementById('btnSalvarNotas');
  const btnExportCsv = document.getElementById('btnExportCsv');

  // extras container (preexistente no HTML)
  const notasExtras = document.getElementById('notasExtras');

  /* -------------------------
     Inicialização (popula selects)
     ------------------------- */
  function popularInstituicoes() {
    selectInstituicao.innerHTML = '<option value="">Selecione a instituição</option>';
    instituicoes.forEach(i => {
      const opt = document.createElement('option');
      opt.value = i.id;
      opt.textContent = i.nome;
      selectInstituicao.appendChild(opt);
    });
  }
 
  selectInstituicao.addEventListener('change', () => {
    selectDisciplina.innerHTML = '<option value="">Selecione a disciplina</option>';
    selectTurma.innerHTML = '<option value="">Selecione a turma</option>';
    const iid = Number(selectInstituicao.value) || null;
    if (!iid) return;
    const inst = instituicoes.find(x => x.id === iid);
    if (!inst) return;
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
    const disc = disciplinas.find(x => x.id === did);
    if (disc) formulaMediaInput.value = disc.formula_nota || getDefaultFormula(disc.componentes);
    atualizarExtrasUI();
  });
 
  function getDefaultFormula(componentes) {
    if (!componentes || componentes.length === 0) return '';
    const siglas = componentes.map(c => c.sigla);
    return `(${siglas.join(' + ')}) / ${siglas.length}`;
  }

 
  function criarControlesExtras() {
    notasExtras.innerHTML = `
      <button id="btnGerenciarComponentes" class="btn">Gerenciar Componentes</button>
      <select id="modoEdicao" class="select-modo">
        <option value="individual">Editar 1 componente</option>
        <option value="completo">Editar todos</option>
      </select>
      <select id="selectComponenteIndividual" class="select-comp" style="display:none"></select>
      <button id="toggleAuditoria" class="btn">Mostrar Auditoria</button>
      <label style="display:inline-flex;align-items:center;gap:6px;">
        <input id="ativarNotasAjustadas" type="checkbox"> Mostrar notas ajustadas
      </label>
      <button id="btnExportJson" class="btn export">Exportar JSON</button>
    `;

    // liga eventos
    document.getElementById('btnGerenciarComponentes').addEventListener('click', abrirModalComponentes);
    document.getElementById('modoEdicao').addEventListener('change', renderModoEdicaoUI);
    document.getElementById('selectComponenteIndividual').addEventListener('change', () => {
      habilitarSomenteComponente(document.getElementById('selectComponenteIndividual').value);
    });
    document.getElementById('toggleAuditoria').addEventListener('click', togglePainelAuditoria);
    document.getElementById('ativarNotasAjustadas').addEventListener('change', renderTabelaAtual);
    document.getElementById('btnExportJson').addEventListener('click', exportJsonHandler);
  }

  function atualizarExtrasUI() {
    // popula select de componentes (modo individual)
    const sel = document.getElementById('selectComponenteIndividual');
    const modo = document.getElementById('modoEdicao');
    if (!sel || !modo) return;
    const did = Number(selectDisciplina.value) || null;
    if (!did) { sel.style.display = 'none'; return; }
    const disc = disciplinas.find(d => d.id === did);
    sel.innerHTML = '';
    disc.componentes.forEach(c => {
      const o = document.createElement('option');
      o.value = c.sigla; o.textContent = `${c.sigla} — ${c.nome}`;
      sel.appendChild(o);
    });
    if (modo.value === 'individual') sel.style.display = 'inline-block';
    else sel.style.display = 'none';
  }

  /* -------------------------
     Modal: Gerenciar Componentes (usamos markup do HTML: #compModal)
     ------------------------- */
  const compModal = document.getElementById('compModal');
  const compTableBody = document.querySelector('#compTable tbody');
  document.getElementById('closeCompModal').addEventListener('click', () => hideModal(compModal));

  function abrirModalComponentes() {
    const did = Number(selectDisciplina.value) || null;
    if (!did) { alert('Selecione uma disciplina antes de gerenciar componentes.'); return; }
    preencherTabelaComponentes(did);
    showModal(compModal);
  }

  function preencherTabelaComponentes(did) {
    const disc = disciplinas.find(d => d.id === did);
    if (!disc || !compTableBody) return;
    compTableBody.innerHTML = '';
    disc.componentes.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${escapeHtml(c.sigla)}</td><td>${escapeHtml(c.nome)}</td><td>${escapeHtml(c.descricao||'')}</td>
        <td>
          <button class="btn editarComp" data-sigla="${escapeHtml(c.sigla)}">Editar</button>
          <button class="btn excluirComp" data-sigla="${escapeHtml(c.sigla)}">Excluir</button>
        </td>`;
      compTableBody.appendChild(tr);
    });

    // bind ações
    compTableBody.querySelectorAll('.excluirComp').forEach(b => {
      b.onclick = () => {
        const sig = b.getAttribute('data-sigla');
        if (!confirm(`Excluir componente ${sig}? Isto removerá notas associadas.`)) return;
        // remove do array da disciplina e notasSalvas
        const idxD = disciplinas.find(d => d.id === Number(selectDisciplina.value));
        if (!idxD) return;
        idxD.componentes = idxD.componentes.filter(c => c.sigla !== sig);
        for (let i = notasSalvas.length - 1; i >= 0; i--) {
          if (notasSalvas[i].componenteSigla === sig) notasSalvas.splice(i, 1);
        }
        preencherTabelaComponentes(Number(selectDisciplina.value));
        renderTabelaAtual();
        atualizarExtrasUI();
      };
    });

    compTableBody.querySelectorAll('.editarComp').forEach(b => {
      b.onclick = () => {
        const sig = b.getAttribute('data-sigla');
        const disc = disciplinas.find(d => d.id === Number(selectDisciplina.value));
        const comp = disc.componentes.find(c => c.sigla === sig);
        if (!comp) return;
        const novoNome = prompt('Nome do componente:', comp.nome);
        if (novoNome === null) return;
        const novaSigla = prompt('Sigla (alterar pode afetar fórmulas):', comp.sigla);
        if (novaSigla === null) return;
        // checar conflitos
        if (novaSigla !== comp.sigla && disc.componentes.some(c => c.sigla === novaSigla)) {
          alert('Sigla já existe nesta disciplina.');
          return;
        }
        // atualizar notasSalvas (mover sigla antiga para nova)
        notasSalvas.forEach(n => { if (n.componenteSigla === comp.sigla) n.componenteSigla = novaSigla; });
        comp.nome = novoNome; comp.sigla = novaSigla;
        preencherTabelaComponentes(Number(selectDisciplina.value));
        renderTabelaAtual();
        atualizarExtrasUI();
      };
    });
  }

  // adicionar novo componente (botão dentro do modal)
  document.getElementById('btnAddComp').addEventListener('click', () => {
    const nome = document.getElementById('compNome').value.trim();
    const sigla = document.getElementById('compSigla').value.trim();
    const desc = document.getElementById('compDesc').value.trim();
    if (!nome || !sigla) { alert('Nome e sigla são obrigatórios.'); return; }
    const disc = disciplinas.find(d => d.id === Number(selectDisciplina.value));
    if (!disc) return;
    if (disc.componentes.some(c => c.sigla === sigla)) { alert('Sigla já existe na disciplina.'); return; }
    disc.componentes.push({ id: Date.now(), nome, sigla, descricao: desc });
    // limpar inputs
    document.getElementById('compNome').value = '';
    document.getElementById('compSigla').value = '';
    document.getElementById('compDesc').value = '';
    preencherTabelaComponentes(disc.id);
    renderTabelaAtual();
    atualizarExtrasUI();
  });

  function showModal(el) { if (!el) return; el.classList.remove('oculto'); el.setAttribute('aria-hidden','false'); }
  function hideModal(el) { if (!el) return; el.classList.add('oculto'); el.setAttribute('aria-hidden','true'); }

  /* -------------------------
     Renderizar tabela de notas
     - colunas: Aluno | componentes... | Nota Final (não editável) | Nota Final Ajustada (opcional)
     ------------------------- */
  btnCarregarAlunos.addEventListener('click', () => {
    const iid = Number(selectInstituicao.value) || null;
    const did = Number(selectDisciplina.value) || null;
    const tid = Number(selectTurma.value) || null;
    if (!iid || !did || !tid) { alert('Selecione instituição, disciplina e turma antes de carregar.'); return; }
    renderTabela(tid, did);
  });

  function renderTabela(turmaId, disciplinaId) {
    const disc = disciplinas.find(d => d.id === disciplinaId);
    if (!disc) return;
    const alunosDaTurma = alunos.filter(a => a.turmaId === turmaId);
    tableWrapper.innerHTML = '';
    const showAjustada = document.getElementById('ativarNotasAjustadas')?.checked;
    const thComponentes = disc.componentes.map(c => `<th>${escapeHtml(c.sigla)}<br><small>${escapeHtml(c.nome)}</small></th>`).join('');
    const header = `<table id="tabela-notas-dinamica"><thead><tr><th>Aluno</th>${thComponentes}<th>Nota Final</th>${showAjustada ? '<th>Nota Final Ajustada</th>' : ''}</tr></thead><tbody>`;
    const rowsHtml = alunosDaTurma.map(a => {
      const inputs = disc.componentes.map(c => `<td><input data-aluno="${a.id}" data-sigla="${escapeHtml(c.sigla)}" type="number" step="0.01" min="0" max="10"></td>`).join('');
      const ajust = showAjustada ? `<td class="ajustadaCell"><input data-aluno="${a.id}" class="nota-ajustada" type="number" step="0.5" min="0" max="10"></td>` : '';
      return `<tr data-aluno="${a.id}"><td>${escapeHtml(a.nome)}</td>${inputs}<td class="finalCell">—</td>${ajust}</tr>`;
    }).join('');
    tableWrapper.innerHTML = header + rowsHtml + '</tbody></table>';
    nenhumaTabela.style.display = 'none';

    // preencher inputs com valores em notasSalvas
    disc.componentes.forEach(c => {
      document.querySelectorAll(`#tabela-notas-dinamica input[data-sigla="${c.sigla}"]`).forEach(inp => {
        const aid = Number(inp.getAttribute('data-aluno'));
        const rec = notasSalvas.find(n => n.alunoId === aid && n.componenteSigla === c.sigla);
        if (rec) inp.value = rec.valor;
      });
    });

    // listeners
    attachInputListeners();
    document.querySelectorAll('#tabela-notas-dinamica tbody tr').forEach(tr => calcularNotaFinalLinha(tr, disc));

    atualizarExtrasUI();
  }

  function renderTabelaAtual() {
    const turmaId = Number(selectTurma.value) || null;
    const discId = Number(selectDisciplina.value) || null;
    if (!turmaId || !discId) return;
    renderTabela(turmaId, discId);
  }

  /* -------------------------
     Listeners para inputs + cálculo seguro
     ------------------------- */
  function attachInputListeners() {
    const inputs = document.querySelectorAll('#tabela-notas-dinamica tbody input[type="number"][data-sigla]');
    inputs.forEach(inp => {
      inp.oninput = null;
      inp.addEventListener('input', () => {
        const tr = inp.closest('tr');
        const disc = disciplinas.find(d => d.id === Number(selectDisciplina.value));
        // registrar auditoria somente quando valor real mudar (compara com notasSalvas)
        const alunoId = Number(inp.getAttribute('data-aluno'));
        const sigla = inp.getAttribute('data-sigla');
        const novo = inp.value === '' ? null : Number(inp.value);
        const idx = notasSalvas.findIndex(n => n.alunoId === alunoId && n.componenteSigla === sigla);
        const antigo = idx >= 0 ? notasSalvas[idx].valor : null;
        if ((antigo === null && novo !== null) || (antigo !== null && novo !== null && antigo !== novo) || (antigo !== null && novo === null)) {
          // registra auditoria imediata (requisito: sempre que o prof alterar nota)
          auditoria.push({ timestamp: Date.now(), alunoId, componenteSigla: sigla, valorAntigo: antigo, valorNovo: novo });
          renderAuditoria();
        }
        calcularNotaFinalLinha(tr, disc);
      });
    });

    // valida nota ajustada (passo 0.5)
    document.querySelectorAll('#tabela-notas-dinamica input.nota-ajustada').forEach(inp => {
      inp.onchange = null;
      inp.addEventListener('change', () => {
        if (inp.value === '') return;
        const n = Number(inp.value);
        if (Math.abs(n * 2 - Math.round(n * 2)) > 0) {
          alert('Notas ajustadas devem estar em incrementos de 0.5 (ex: 5.0, 5.5).');
          inp.value = '';
        }
      });
    });
  }

  /* -------------------------
     Cálculo seguro da fórmula (valida siglas)
     ------------------------- */
  function calcularNotaFinalLinha(trElement, disciplina) {
    if (!trElement) return;
    const componentes = disciplina ? disciplina.componentes : [];
    const siglas = componentes.map(c => c.sigla);
    const valores = {};
    siglas.forEach(sg => {
      const inp = trElement.querySelector(`input[data-sigla="${sg}"]`);
      const v = inp ? parseFloat(inp.value) : NaN;
      valores[sg] = (!isNaN(v) ? v : null);
    });

    const formulaRaw = (formulaMediaInput.value || '').trim();
    let final = null;

    if (formulaRaw) {
      // extrai palavras / tokens e verifica siglas
      const tokens = (formulaRaw.match(/[A-Za-z_][A-Za-z0-9_]*/g) || []);
      const unknowns = tokens.filter(t => isNaN(Number(t)) && siglas.indexOf(t) === -1);
      if (unknowns.length > 0) {
        trElement.querySelector('.finalCell').textContent = 'ERR';
        return;
      }
      // substitui siglas por valores (0 se null)
      let expr = formulaRaw;
      siglas.forEach(sg => {
        const val = (valores[sg] !== null) ? valores[sg] : 0;
        expr = expr.replace(new RegExp('\\b' + escapeRegExp(sg) + '\\b', 'g'), String(val));
      });
      // permite apenas números e operadores
      if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
        final = '—';
      } else {
        try {
          final = Function('"use strict"; return (' + expr + ')')();
          if (typeof final !== 'number' || !isFinite(final)) final = '—';
          else final = Number(final.toFixed(2));
        } catch (e) {
          final = '—';
        }
      }
    } else {
      // média aritmética simples
      let soma = 0, cnt = 0;
      siglas.forEach(sg => {
        const v = valores[sg];
        if (v !== null) { soma += v; cnt++; }
      });
      final = cnt === 0 ? '—' : Number((soma / cnt).toFixed(2));
    }

    const finalCell = trElement.querySelector('.finalCell');
    finalCell.textContent = (final === '—' ? '—' : (final === 'ERR' ? 'ERR' : Number(final).toFixed(2)));

    // preencher ajustada automaticamente se ativa e campo vazio
    if (document.getElementById('ativarNotasAjustadas')?.checked) {
      const inpAj = trElement.querySelector('input.nota-ajustada');
      if (inpAj && (inpAj.value === '' || inpAj.value === null) && final !== '—' && final !== 'ERR') {
        inpAj.value = roundToHalf(Number(final));
      }
    }
  }

  function roundToHalf(n) { return (Math.round(n * 2) / 2).toFixed(1); }

  /* -------------------------
     Habilitar modo individual / completo
     ------------------------- */
  function renderModoEdicaoUI() {
    const modo = document.getElementById('modoEdicao')?.value || 'individual';
    const sel = document.getElementById('selectComponenteIndividual');
    const did = Number(selectDisciplina.value) || null;
    if (!did) return;
    const disc = disciplinas.find(d => d.id === did);
    sel.innerHTML = '';
    disc.componentes.forEach(c => {
      const o = document.createElement('option'); o.value = c.sigla; o.textContent = `${c.sigla} — ${c.nome}`; sel.appendChild(o);
    });
    if (modo === 'individual') {
      sel.style.display = 'inline-block';
      const sig = sel.value || disc.componentes[0].sigla;
      habilitarSomenteComponente(sig);
    } else {
      sel.style.display = 'none';
      habilitarTodosComponentes();
    }
  }

  function habilitarSomenteComponente(sigla) {
    document.querySelectorAll('#tabela-notas-dinamica input[type="number"][data-sigla]').forEach(inp => {
      inp.disabled = inp.getAttribute('data-sigla') !== sigla;
    });
  }

  function habilitarTodosComponentes() {
    document.querySelectorAll('#tabela-notas-dinamica input[type="number"][data-sigla]').forEach(inp => inp.disabled = false);
  }

  /* -------------------------
     Salvar notas (simulação) — registra auditoria e atualiza notasSalvas
     ------------------------- */
  btnSalvarNotas.addEventListener('click', () => {
    const did = Number(selectDisciplina.value) || null;
    const disc = disciplinas.find(d => d.id === did);
    if (!disc) { alert('Carregue uma disciplina antes de salvar.'); return; }
    const rows = document.querySelectorAll('#tabela-notas-dinamica tbody tr');
    rows.forEach(tr => {
      const alunoId = Number(tr.getAttribute('data-aluno'));
      disc.componentes.forEach(comp => {
        const sigla = comp.sigla;
        const inp = tr.querySelector(`input[data-sigla="${sigla}"]`);
        const val = inp && inp.value !== '' ? Number(inp.value) : null;
        const idx = notasSalvas.findIndex(n => n.alunoId === alunoId && n.componenteSigla === sigla);
        const antigo = idx >= 0 ? notasSalvas[idx].valor : null;
        if (val === null) {
          if (idx >= 0) {
            notasSalvas.splice(idx, 1);
            auditoria.push({ timestamp: Date.now(), alunoId, componenteSigla: sigla, valorAntigo: antigo, valorNovo: null });
          }
        } else {
          if (idx >= 0) {
            if (notasSalvas[idx].valor !== val) auditoria.push({ timestamp: Date.now(), alunoId, componenteSigla: sigla, valorAntigo: antigo, valorNovo: val });
            notasSalvas[idx].valor = val;
          } else {
            notasSalvas.push({ alunoId, componenteSigla: sigla, valor: val });
            auditoria.push({ timestamp: Date.now(), alunoId, componenteSigla: sigla, valorAntigo: null, valorNovo: val });
          }
        }
      });
    });
    renderAuditoria();
    alert('Notas salvas localmente (simulado).');
    // Aqui você chamaria o backend com fetch() para persistir notas e auditoria
  });

  /* -------------------------
     Export CSV (requisito: só exporta se todas notas + nota final preenchidas)
     ------------------------- */
  btnExportCsv.addEventListener('click', () => {
    const did = Number(selectDisciplina.value) || null;
    const disc = disciplinas.find(d => d.id === did);
    if (!disc) { alert('Carregue a disciplina antes de exportar.'); return; }
    const rows = Array.from(document.querySelectorAll('#tabela-notas-dinamica tbody tr'));
    const tudoPreenchido = rows.every(tr => {
      return disc.componentes.every(c => {
        const inp = tr.querySelector(`input[data-sigla="${c.sigla}"]`);
        return inp && inp.value !== '';
      }) && tr.querySelector('.finalCell') && tr.querySelector('.finalCell').textContent !== '—' && tr.querySelector('.finalCell').textContent !== 'ERR';
    });
    if (!tudoPreenchido) { alert('Só é possível exportar quando TODAS as notas e nota final estiverem preenchidas.'); return; }

    const headers = ['Aluno', ...disc.componentes.map(c => c.sigla), 'Nota Final'];
    if (document.getElementById('ativarNotasAjustadas')?.checked) headers.push('Nota Final Ajustada');
    const csvRows = [headers.join(',')];

    rows.forEach(tr => {
      const alunoNome = tr.querySelector('td').textContent.trim();
      const valores = disc.componentes.map(c => {
        const inp = tr.querySelector(`input[data-sigla="${c.sigla}"]`);
        return inp && inp.value !== '' ? inp.value : '';
      });
      const final = tr.querySelector('.finalCell').textContent.trim();
      const parts = [escapeCsv(alunoNome), ...valores.map(escapeCsv), final];
      if (document.getElementById('ativarNotasAjustadas')?.checked) {
        parts.push(escapeCsv(tr.querySelector('input.nota-ajustada')?.value || ''));
      }
      csvRows.push(parts.join(','));
    });

    const turmaNome = (selectTurma.options[selectTurma.selectedIndex]?.textContent || 'turma').replace(/\s+/g,'_');
    downloadTextFile(csvRows.join('\n'), `notas_${Date.now()}_${turmaNome}.csv`, 'text/csv');
  });

  /* -------------------------
     Export JSON
     ------------------------- */
  function exportJsonHandler() {
    const did = Number(selectDisciplina.value) || null;
    const disc = disciplinas.find(d => d.id === did);
    if (!disc) { alert('Carregue a disciplina antes de exportar.'); return; }
    const rows = Array.from(document.querySelectorAll('#tabela-notas-dinamica tbody tr'));
    const tudoPreenchido = rows.every(tr => {
      return disc.componentes.every(c => {
        const inp = tr.querySelector(`input[data-sigla="${c.sigla}"]`);
        return inp && inp.value !== '';
      }) && tr.querySelector('.finalCell') && tr.querySelector('.finalCell').textContent !== '—' && tr.querySelector('.finalCell').textContent !== 'ERR';
    });
    if (!tudoPreenchido) { alert('Só é possível exportar quando TODAS as notas e nota final estiverem preenchidas.'); return; }

    const lista = rows.map(tr => {
      const alunoId = Number(tr.getAttribute('data-aluno'));
      const item = { alunoId, alunoNome: tr.querySelector('td').textContent.trim(), componentes: {}, notaFinal: tr.querySelector('.finalCell').textContent.trim() };
      disc.componentes.forEach(c => {
        const inp = tr.querySelector(`input[data-sigla="${c.sigla}"]`);
        item.componentes[c.sigla] = inp && inp.value !== '' ? Number(inp.value) : null;
      });
      if (document.getElementById('ativarNotasAjustadas')?.checked) {
        const v = tr.querySelector('input.nota-ajustada')?.value;
        item.notaFinalAjustada = v ? Number(v) : null;
      }
      return item;
    });

    const meta = {
      turma: selectTurma.options[selectTurma.selectedIndex]?.textContent || null,
      disciplina: disc.nome,
      dataExport: new Date().toISOString()
    };

    const output = { meta, notas: lista };
    const turmaNome = (selectTurma.options[selectTurma.selectedIndex]?.textContent || 'turma').replace(/\s+/g,'_');
    downloadTextFile(JSON.stringify(output, null, 2), `notas_${Date.now()}_${turmaNome}.json`, 'application/json');
  }

  /* -------------------------
     Auditoria: renderiza painel com logs em ordem decrescente
     ------------------------- */
  function renderAuditoria() {
    const ul = document.getElementById('listaAuditoria');
    if (!ul) return;
    ul.innerHTML = '';
    const sorted = auditoria.slice().sort((a,b) => b.timestamp - a.timestamp);
    sorted.forEach(item => {
      const aluno = alunos.find(a => a.id === item.alunoId);
      const li = document.createElement('li');
      li.textContent = `${new Date(item.timestamp).toLocaleString()} — ${aluno ? aluno.nome : 'Aluno ' + item.alunoId} — ${item.componenteSigla}: ${formatVal(item.valorAntigo)} → ${formatVal(item.valorNovo)}`;
      ul.appendChild(li);
    });
  }

  function togglePainelAuditoria() {
    const painel = document.getElementById('painelAuditoria');
    const btn = document.getElementById('toggleAuditoria') || document.querySelector('#notasExtras #toggleAuditoria');
    if (!painel) return;
    if (painel.classList.contains('oculto')) {
      painel.classList.remove('oculto');
      document.getElementById('toggleAuditoria').textContent = 'Ocultar Auditoria';
    } else {
      painel.classList.add('oculto');
      document.getElementById('toggleAuditoria').textContent = 'Mostrar Auditoria';
    }
  }

  /* -------------------------
     Helpers e utilitários
     ------------------------- */
  function escapeHtml(s) {
    if (s === undefined || s === null) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function escapeCsv(v) {
    if (v === undefined || v === null) return '';
    const s = String(v);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) return '"' + s.replace(/"/g,'""') + '"';
    return s;
  }
  function formatVal(v) { return (v === null || v === undefined) ? '—' : Number(v).toFixed ? Number(v).toFixed(2) : v; }
  function downloadTextFile(text, filename, type = 'text/plain') {
    const blob = new Blob([text], { type: type + ';charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /* -------------------------
     Util: render modo e habilitações após carregar tabela
     ------------------------- */
  function habilitarSomenteComponente(sigla) {
    document.querySelectorAll('#tabela-notas-dinamica input[data-sigla]').forEach(inp => {
      inp.disabled = inp.getAttribute('data-sigla') !== sigla;
    });
  }
  function habilitarTodosComponentes() {
    document.querySelectorAll('#tabela-notas-dinamica input[data-sigla]').forEach(inp => inp.disabled = false);
  }

  /* -------------------------
     Modal helper já definidas: showModal/hideModal (usadas acima)
     ------------------------- */
  // já implementadas: showModal/hideModal via classes .oculto no CSS/HTML

  /* -------------------------
     Inicialização final
     ------------------------- */
  popularInstituicoes();
  criarControlesExtras();

  // recalc quando a fórmula mudar
  formulaMediaInput.addEventListener('input', () => {
    const disc = disciplinas.find(d => d.id === Number(selectDisciplina.value));
    if (!disc) return;
    document.querySelectorAll('#tabela-notas-dinamica tbody tr').forEach(tr => calcularNotaFinalLinha(tr, disc));
  });

  // quando seleção de turma/discip mudar, atualiza controles extras
  selectDisciplina.addEventListener('change', atualizarExtrasUI);
  selectTurma.addEventListener('change', renderTabelaAtual);

  // ocultar modal se clicar fora
  compModal.addEventListener('click', (e) => { if (e.target === compModal) hideModal(compModal); });

})();


