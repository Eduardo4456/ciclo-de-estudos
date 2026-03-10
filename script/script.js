let materias = [];
let editandoIndex = null;

const niveisTexto = {
    "1": "Péssimo",
    "2": "Ruim",
    "3": "Mediano",
    "4": "Bom",
    "5": "Ótimo"
};

function adicionarMateria() {
    const nome = document.getElementById('nome-materia').value.trim();
    const nivel = document.querySelector('input[name="nivel"]:checked').value;

    if (!nome) {
        alert("Por favor, digite o nome da matéria.");
        return;
    }

    if (editandoIndex !== null) {
        // Atualizar existente
        materias[editandoIndex] = { nome, nivel };
        editandoIndex = null;
        document.getElementById('btn-add').innerText = "Adicionar Matéria";
    } else {
        // Adicionar nova
        materias.push({ nome, nivel });
    }

    document.getElementById('nome-materia').value = "";
    renderizarMaterias();
}

function renderizarMaterias() {
    const lista = document.getElementById('lista-materias');
    const section = document.getElementById('section-lista');

    lista.innerHTML = "";
    section.style.display = materias.length > 0 ? "block" : "none";

    materias.forEach((m, index) => {
        const li = document.createElement('li');
        li.className = "item-materia";
        li.innerHTML = `
            <div class="materia-info">
                <b>${m.nome}</b> — Nível: ${niveisTexto[m.nivel]}
            </div>
            <div class="materia-actions">
                <button class="btn-sm btn-edit" onclick="editarMateria(${index})">Editar</button>
                <button class="btn-sm btn-del" onclick="removerMateria(${index})">Excluir</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

function removerMateria(index) {
    materias.splice(index, 1);
    renderizarMaterias();
}

function editarMateria(index) {
    const m = materias[index];
    document.getElementById('nome-materia').value = m.nome;
    document.querySelector(`input[name="nivel"][value="${m.nivel}"]`).checked = true;
    editandoIndex = index;
    document.getElementById('btn-add').innerText = "Salvar Alteração";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function gerarCiclo() {
    const horasDia = parseFloat(document.getElementById('horas').value);
    const diasSemana = parseInt(document.getElementById('quantidade_dias').value);

    if (isNaN(horasDia) || materias.length === 0) {
        alert("Preencha as horas diárias e adicione ao menos uma matéria.");
        return;
    }

    const totalHorasSemana = horasDia * diasSemana;

    // Lógica de Peso: Quanto menor o nível (1 ou 2), mais peso a matéria ganha (precisa estudar mais).
    // Nível 1 (Péssimo) = Peso 5 | Nível 5 (Ótimo) = Peso 1
    let somaPesos = 0;
    const materiasComPeso = materias.map(m => {
    const peso = 6 - parseInt(m.nivel); // Inverte: 1 vira 5, 5 vira 1
    somaPesos += peso;
    return { ...m, peso };
});

const cicloUl = document.getElementById('ciclo');
cicloUl.innerHTML = "";
document.getElementById('resultado-ciclo').style.display = "block";

materiasComPeso.forEach(m => {
    // Cálculo proporcional
    const horasMateria = (m.peso / somaPesos) * totalHorasSemana;
    const horasFormatadas = horasMateria.toFixed(1);

    const li = document.createElement('li');
    li.className = "ciclo-item";
    li.innerHTML = `
        <span>${m.nome}</span>
        <span><b>${horasFormatadas}h</b> /semana</span>
    `;
    cicloUl.appendChild(li);
});

window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function criarPDF() {
    const element = document.getElementById('container');
    const opt = {
        margin: 10,
        filename: 'meu-ciclo-de-estudos.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Esconder botões temporariamente para o PDF ficar limpo
    const botoes = document.querySelectorAll('.btn, .btn-sm');
    botoes.forEach(b => b.style.visibility = 'hidden');

    html2pdf().set(opt).from(element).save().then(() => {
        botoes.forEach(b => b.style.visibility = 'visible');
    });
}