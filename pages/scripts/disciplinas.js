import { apiGet, apiPost, apiPut, apiDelete } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const formDisciplina = document.getElementById('form-disciplina');
    const tbody = document.querySelector('.list-disciplina table tbody');

    async function carregarDisciplinas() {
        try {
            const disciplinas = await apiGet('/disciplinas');
            tbody.innerHTML = disciplinas.map(d => `
                <tr data-id="${d.id}">
                    <td>${d.nome}</td>
                    <td>${d.sigla}</td>
                    <td>${d.codigo || '-'}</td>
                    <td>${d.periodo || '-'}</td>
                    <td>
                        <button class="edit">Editar</button>
                        <button class="delete">Excluir</button>
                    </td>
                </tr>
            `).join('');
            adicionarEventos();
        } catch (error) {
            console.error('Erro ao carregar disciplinas:', error);
        }
    }

    function adicionarEventos() {
        document.querySelectorAll('.edit').forEach(btn => btn.replaceWith(btn.cloneNode(true)));
        document.querySelectorAll('.delete').forEach(btn => btn.replaceWith(btn.cloneNode(true)));

        document.querySelectorAll('.edit').forEach(btn => {
            btn.addEventListener('click', async e => {
                const tr = e.target.closest('tr');
                const id = tr.dataset.id;
                const nomeAtual = tr.children[0].textContent;
                const siglaAtual = tr.children[1].textContent;
                const codigoAtual = tr.children[2].textContent;
                const periodoAtual = tr.children[3].textContent;

                const novoNome = prompt('Nome:', nomeAtual);
                const novaSigla = prompt('Sigla:', siglaAtual);
                const novoCodigo = prompt('Código:', codigoAtual);
                const novoPeriodo = prompt('Período:', periodoAtual);

                if (novoNome && novaSigla) {
                    try {
                        await apiPut(`/disciplinas/${id}`, { nome: novoNome, sigla: novaSigla, codigo: novoCodigo, periodo: novoPeriodo });
                        alert('Disciplina atualizada!');
                        carregarDisciplinas();
                    } catch (error) {
                        console.error('Erro ao atualizar disciplina:', error);
                        alert('Erro ao atualizar disciplina.');
                    }
                }
            });
        });

        document.querySelectorAll('.delete').forEach(btn => {
            btn.addEventListener('click', async e => {
                const tr = e.target.closest('tr');
                const id = tr.dataset.id;

                if (confirm('Deseja realmente excluir esta disciplina?')) {
                    try {
                        await apiDelete(`/disciplinas/${id}`);
                        alert('Disciplina removida!');
                        carregarDisciplinas();
                    } catch (error) {
                        console.error('Erro ao excluir disciplina:', error);
                        alert('Erro ao excluir disciplina.');
                    }
                }
            });
        });
    }

    if (formDisciplina) {
        formDisciplina.addEventListener('submit', async e => {
            e.preventDefault();
            const nome = formDisciplina.elements["nome"].value.trim();
            const sigla = formDisciplina.elements["sigla"].value.trim();
            const codigo = formDisciplina.elements["codigo"].value.trim();
            const periodo = formDisciplina.elements["periodo"].value.trim();

            if (!nome || !sigla) return alert('Nome e sigla são obrigatórios');

            try {
                await apiPost('/disciplinas', { nome, sigla, codigo, periodo });
                alert('Disciplina cadastrada!');
                formDisciplina.reset();
                carregarDisciplinas();
            } catch (error) {
                console.error('Erro ao cadastrar disciplina:', error);
                alert('Erro ao cadastrar disciplina.');
            }
        });
    }

    carregarDisciplinas();
});
