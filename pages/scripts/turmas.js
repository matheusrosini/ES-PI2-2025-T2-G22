<<<<<<< Updated upstream
// turmas.js

lucide.createIcons();

const formTurma = document.getElementById('form-turma');
const tabela = document.getElementById('tabela-turmas').querySelector('tbody');
const selectDisciplina = document.getElementById('select-disciplina');

// Exemplo: disciplinas disponíveis (pode vir da API)
const disciplinas = [
  "Engenharia de Software",
  "Matemática",
  "Banco de Dados",
  "Física"
];

// Preenche select de disciplinas
disciplinas.forEach(d => {
  const option = document.createElement('option');
  option.value = d;
  option.textContent = d;
  selectDisciplina.appendChild(option);
});

// Evento para criar nova turma
formTurma.addEventListener('submit', (e) => {
  e.preventDefault();

  const disciplina = selectDisciplina.value;
  const nomeTurma = document.getElementById('nome-turma').value.trim();
  const periodo = document.getElementById('periodo').value;

  if (!disciplina || !nomeTurma || !periodo) return;

  const novaLinha = document.createElement('tr');
  novaLinha.innerHTML = `
    <td>${disciplina}</td>
    <td>${nomeTurma}</td>
    <td>${periodo}</td>
    <td>
      <button class="edit-btn">Editar</button>
      <button class="delete-btn">Excluir</button>
    </td>
  `;
  tabela.appendChild(novaLinha);

  formTurma.reset();
});

// Função para excluir turma
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    e.target.closest('tr').remove();
  }
});
=======
    // Matheus Henrique Portugal Narducci
    
    let turmas = []; // { id, nome, codigoTurma, turno, disciplina, alunos: [ {id,nome,matricula,nascimento} ] }
    let editingTurmaId = null;
    let editingAluno = null; // {turmaId, alunoId}
    let confirmCallback = null;

    const tabelaTurmasBody = document.querySelector('#tabela-turmas tbody');
    const semTurmasMsg = document.getElementById('semTurmasMsg');

    /* ====== Caixas que aparecem ====== */
    function uid(prefix='id') {
      return prefix + '_' + Math.random().toString(36).slice(2,9);
    }
    function showAlert(message) {
      document.getElementById('alertMessage').textContent = message;
      document.getElementById('alertBox').style.display = 'flex';
      document.body.style.pointerEvents = 'none';
      document.getElementById('alertBox').style.pointerEvents = 'auto';
    }
    document.getElementById('closeAlertBtn').addEventListener('click', () => {
      document.getElementById('alertBox').style.display = 'none';
      document.body.style.pointerEvents = 'auto';
    });

    const listaContainer = document.getElementById("lista-container");
    const btnFiltro = document.getElementById("btnAplicarFiltro");

    btnFiltro.addEventListener("click", () => {
      const inst = document.getElementById("selectInstituicao").value;
      const curso = document.getElementById("selectCurso").value;
      const disc = document.getElementById("selectDisciplina").value;

      if (!inst || !curso || !disc) {
        showAlert("Selecione instituição, curso e disciplina antes de continuar.");
        return;
      }

    // Agora sim libera a lista
      listaContainer.style.display = "block";
  });

    /* Turmas */
    function renderTurmas() {
      tabelaTurmasBody.innerHTML = '';
      if (turmas.length === 0) {
        semTurmasMsg.style.display = 'block';
      } else {
        semTurmasMsg.style.display = 'none';
      }

      for (const t of turmas) {
        const tr = document.createElement('tr');

        tr.innerHTML = `
          <td>${escapeHtml(t.nome)}</td>
          <td>${escapeHtml(t.codigoTurma)}</td>
          <td>${escapeHtml(t.turno)}</td>
          <td>${escapeHtml(t.disciplina)}</td>
          <td></td>
        `;

        const actionsTd = tr.querySelector('td:last-child');
        const detailsBtn = createBtn('Detalhes','small');
        detailsBtn.addEventListener('click', () => openDetalhes(t.id));
        const editBtn = createBtn('Editar','small');
        editBtn.classList.add('secondary');
        editBtn.addEventListener('click', () => openEditTurma(t.id));
        const delBtn = createBtn('Excluir','small');
        delBtn.classList.add('danger');
        delBtn.addEventListener('click', () => confirmAction(`Excluir turma "${t.nome}"?`, () => deleteTurma(t.id)));

        const div = document.createElement('div');
        div.className = 'actions';
        div.appendChild(detailsBtn);
        div.appendChild(editBtn);
        div.appendChild(delBtn);
        actionsTd.appendChild(div);

        tabelaTurmasBody.appendChild(tr);
      }
    }

    function createBtn(text, size='') {
      const b = document.createElement('button');
      b.textContent = text;
      b.className = 'btn';
      if (size === 'small') b.classList.add('small');
      return b;
    }

    function escapeHtml(s) {
      if (s === undefined || s === null) return '';
      return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    }

    /* Modal de cadastro/edição de turma */
    const modalTurma = document.getElementById('modalTurma');
    const novaTurmaBtn = document.getElementById('novaTurmaBtn');
    const closeModalTurma = document.getElementById('closeModalTurma');
    const cancelarTurmaBtn = document.getElementById('cancelarTurmaBtn');
    const salvarTurmaBtn = document.getElementById('salvarTurmaBtn');

    novaTurmaBtn.addEventListener('click', () => {
      editingTurmaId = null;
      document.getElementById('modalTurmaTitle').textContent = 'Cadastrar Turma';
      openModal(modalTurma);
      limparCamposTurma();
    });

    closeModalTurma.addEventListener('click', () => closeModal(modalTurma));
    cancelarTurmaBtn.addEventListener('click', () => closeModal(modalTurma));

    function openEditTurma(id) {
      const t = turmas.find(x => x.id === id);
      if (!t) return showAlert('Turma não encontrada.');
      editingTurmaId = id;
      document.getElementById('modalTurmaTitle').textContent = 'Editar Turma';
      document.getElementById('nomeTurma').value = t.nome;
      document.getElementById('codigoTurma').value = t.codigoTurma;
      document.getElementById('turnoTurma').value = t.turno;
      document.getElementById('disciplinaTurma').value = t.disciplina;
      openModal(modalTurma);
    }

    function limparCamposTurma() {
      document.getElementById('nomeTurma').value = '';
      document.getElementById('codigoTurma').value = '';
      document.getElementById('turnoTurma').value = 'Manhã';
      document.getElementById('disciplinaTurma').value = '';
    }

    salvarTurmaBtn.addEventListener('click', () => {
      const nome = document.getElementById('nomeTurma').value.trim();
      const codigoTurma = document.getElementById('codigoTurma').value.trim();
      const turno = document.getElementById('turnoTurma').value;
      const disciplina = document.getElementById('disciplinaTurma').value.trim();

      if (!nome || !codigoTurma || !turno || !disciplina) {
        showAlert('⚠️ Preencha todos os campos da turma.');
        return;
      }

      if (editingTurmaId) {
        const t = turmas.find(x => x.id === editingTurmaId);
        Object.assign(t, { nome, codigoTurma, turno, disciplina });
        showAlert('Turma atualizada.');
      } else {
        turmas.push({
          id: uid('turma'),
          nome, codigoTurma, turno, disciplina,
          alunos: []
        });
        showAlert('Turma cadastrada.');
      }
      closeModal(modalTurma);
      renderTurmas();
    });

    function deleteTurma(id) {
      turmas = turmas.filter(t => t.id !== id);
      renderTurmas();
      closeModal(document.getElementById('modalConfirm'));
    }

    /* Detalhes de alunos */
    const modalDetalhes = document.getElementById('modalDetalhes');
    const detalhesTitle = document.getElementById('detalhesTitle');
    const closeDetalhes = document.getElementById('closeDetalhes');
    const tabelaAlunosModal = document.querySelector('#tabela-alunos-modal tbody');
    const importCsvModalBtn = document.getElementById('importCsvModalBtn');
    const csvInputModal = document.getElementById('csvInputModal');
    const addAlunoBtn = document.getElementById('addAlunoBtn');
    const addAlunoForm = document.getElementById('addAlunoForm');
    const salvarAlunoBtn = document.getElementById('salvarAlunoBtn');
    const cancelAddAlunoBtn = document.getElementById('cancelAddAlunoBtn');
    const turmaCapacityInfo = document.getElementById('turmaCapacityInfo');

    closeDetalhes.addEventListener('click', () => closeModal(modalDetalhes));

    function openDetalhes(turmaId) {
      editingTurmaId = turmaId;
      const t = turmas.find(x => x.id === turmaId);
      if (!t) return showAlert('Turma não encontrada.');
      detalhesTitle.textContent = `Alunos - ${t.nome}`;
      
      renderAlunosModal(t);
      closeAddAlunoForm();
      openModal(modalDetalhes);
    }

    function renderAlunosModal(turma) {
      tabelaAlunosModal.innerHTML = '';
      if (!turma.alunos || turma.alunos.length === 0) {
        tabelaAlunosModal.innerHTML = '<tr><td colspan="4" class="muted">Nenhum aluno. Importe via CSV ou adicione manualmente.</td></tr>';
        
        return;
      }

      turma.alunos.forEach(al => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${escapeHtml(al.nome)}</td>
          <td>${escapeHtml(al.matricula)}</td>
          <td>${escapeHtml(al.nascimento)}</td>
          <td></td>
        `;
        const tdActions = tr.querySelector('td:last-child');
        const editBtn = createBtn('Editar','small');
        editBtn.classList.add('secondary');
        editBtn.addEventListener('click', () => openEditAluno(turma.id, al.id));
        const delBtn = createBtn('Excluir','small');
        delBtn.classList.add('danger');
        delBtn.addEventListener('click', () => confirmAction(`Excluir aluno "${al.nome}"?`, () => deleteAluno(turma.id, al.id)));

        const d = document.createElement('div');
        d.className = 'actions';
        d.appendChild(editBtn);
        d.appendChild(delBtn);
        tdActions.appendChild(d);

        tabelaAlunosModal.appendChild(tr);
      });

      
    }

    importCsvModalBtn.addEventListener('click', () => csvInputModal.click());

    csvInputModal.addEventListener('change', (ev) => {
      const file = ev.target.files[0];
      if (!file) return showAlert('Nenhum arquivo selecionado.');
      const reader = new FileReader();
      reader.onload = e => {
        const raw = e.target.result;
        const lines = raw.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length < 1) return showAlert('CSV inválido.');
        
        const turma = turmas.find(t => t.id === editingTurmaId);
        if (!turma) return showAlert('Turma não encontrada.');
        let added = 0;
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim());
          if (!cols[0]) continue;
          turma.alunos.push({ id: uid('al'), nome: cols[0] || '', matricula: cols[1] || '', nascimento: cols[2] || '' });
          added++;
        }
        renderAlunosModal(turma);
        showAlert(`${added} aluno(s) importado(s).`);
        csvInputModal.value = '';
      };
      reader.readAsText(file);
    });

    /* Para adicionar alunos manuamente, sem precisar importar sempre */
    addAlunoBtn.addEventListener('click', openAddAlunoForm);
    function openAddAlunoForm() {
      addAlunoForm.style.display = 'block';
    }
    function closeAddAlunoForm() {
      addAlunoForm.style.display = 'none';
      document.getElementById('alunoNome').value = '';
      document.getElementById('alunoMatricula').value = '';
      document.getElementById('alunoNascimento').value = '';
    }
    cancelAddAlunoBtn.addEventListener('click', () => closeAddAlunoForm());

    salvarAlunoBtn.addEventListener('click', () => {
      const nome = document.getElementById('alunoNome').value.trim();
      const matricula = document.getElementById('alunoMatricula').value.trim();
      const nascimento = document.getElementById('alunoNascimento').value;
      if (!nome || !matricula || !nascimento) return showAlert('Preencha todos os campos do aluno.');
      const turma = turmas.find(t => t.id === editingTurmaId);
      if (!turma) return showAlert('Turma não encontrada.');
      turma.alunos.push({ id: uid('al'), nome, matricula, nascimento });
      renderAlunosModal(turma);
      closeAddAlunoForm();
      showAlert('Aluno adicionado.');
    });

    /* Para editar aluno */
    const modalEditarAluno = document.getElementById('modalEditarAluno');
    document.getElementById('closeEditarAluno').addEventListener('click', () => closeModal(modalEditarAluno));
    document.getElementById('cancelEditAluno').addEventListener('click', () => closeModal(modalEditarAluno));
    document.getElementById('salvarEdicaoAluno').addEventListener('click', () => {
      const nome = document.getElementById('editNome').value.trim();
      const matricula = document.getElementById('editMatricula').value.trim();
      const nascimento = document.getElementById('editNascimento').value;
      if (!nome || !matricula || !nascimento) return showAlert('Preencha todos os campos.');
      const turma = turmas.find(t => t.id === editingAluno.turmaId);
      if (!turma) return showAlert('Turma não encontrada.');
      const al = turma.alunos.find(a => a.id === editingAluno.alunoId);
      if (!al) return showAlert('Aluno não encontrado.');
      Object.assign(al, { nome, matricula, nascimento });
      renderAlunosModal(turma);
      closeModal(modalEditarAluno);
      showAlert('Aluno atualizado.');
    });

    function openEditAluno(turmaId, alunoId) {
      editingAluno = { turmaId, alunoId };
      const turma = turmas.find(t => t.id === turmaId);
      const al = turma.alunos.find(a => a.id === alunoId);
      document.getElementById('editNome').value = al.nome;
      document.getElementById('editMatricula').value = al.matricula;
      document.getElementById('editNascimento').value = al.nascimento;
      openModal(modalEditarAluno);
    }

    function deleteAluno(turmaId, alunoId) {
      const turma = turmas.find(t => t.id === turmaId);
      turma.alunos = turma.alunos.filter(a => a.id !== alunoId);
      renderAlunosModal(turma);
      closeModal(document.getElementById('modalConfirm'));
    }

    /* Modal de confirmação  */
    const modalConfirm = document.getElementById('modalConfirm');
    const confirmTitle = document.getElementById('confirmTitle');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmOk = document.getElementById('confirmOk');
    const confirmCancel = document.getElementById('confirmCancel');

    function confirmAction(message, callback) {
      confirmTitle.textContent = 'Confirmação';
      confirmMessage.textContent = message;
      confirmCallback = callback;
      openModal(modalConfirm);
    }
    confirmOk.addEventListener('click', () => {
      if (typeof confirmCallback === 'function') confirmCallback();
      confirmCallback = null;
    });
    confirmCancel.addEventListener('click', () => {
      confirmCallback = null;
      closeModal(modalConfirm);
    });

    /* Abrir/fechar modal */
    function openModal(el) {
      el.classList.add('open');
      el.style.display = 'flex';
      document.body.style.pointerEvents = 'none';
      el.style.pointerEvents = 'auto';
    }
    function closeModal(el) {
      el.classList.remove('open');
      el.style.display = 'none';
      document.body.style.pointerEvents = 'auto';
    }

    // fechar modais clicando fora
    window.addEventListener('click', (ev) => {
      document.querySelectorAll('.modal.open').forEach(mod => {
        if (ev.target === mod) closeModal(mod);
      });
    });

    /* ====== Inicialização: exemplo de dados ====== */
    turmas.push({
      id: uid('turma'),
      nome: 'Engenharia de Software - Turma 1',
      codigoTurma: '102',
      turno: 'Noite',
      disciplina: 'Estruturas de Dados',
      alunos: [
        { id: uid('al'), nome: 'Ana Clara', matricula: '2025001', nascimento: '2005-03-21' },
        { id: uid('al'), nome: 'Bruno Silva', matricula: '2025002', nascimento: '2004-11-02' }
      ]
    });

    renderTurmas();

    // ativa lucide icons depois que DOM carrega
    window.addEventListener('load', () => {
      if (window.lucide && lucide.createIcons) lucide.createIcons();
    });
>>>>>>> Stashed changes
