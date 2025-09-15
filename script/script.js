let materias = [];//lista de materias 

function adicionarMateria() {
  const nome = document.getElementById("nome-materia").value.trim();
  const nivel = document.querySelector('input[name="nivel"]:checked')?.value || "";

  if (nome !== "") {
        materias.push({ nome: nome, nivel: nivel });

        // adiciona na lista visível
        const li = document.createElement("li");
        li.textContent = `${nome} - ${nivel}`;
        document.getElementById("lista-materias").appendChild(li);

        // limpa o input
        document.getElementById("nome-materia").value = "";
  }
}


function montarCiclo(materias, horasPorDia, dias) {
    const pesos = {
        "pessimo": 5,
        "ruim": 4,
        "mediano": 3,
        "bom": 2,
        "otimo": 1
    };

    const totalHoras = horasPorDia * dias;
    const totalPesos = materias.reduce((soma, m) => soma + (pesos[m.nivel] || 1), 0);

    return materias.map(m => {
        const peso = pesos[m.nivel] || 1;
        const horasMateria = Math.round((peso / totalPesos) * totalHoras);

        return {
            nome: m.nome,
            nivel: m.nivel,
            horas: horasMateria
        };
    });
}

function coletarMaterias() {
    const horas = parseInt(document.getElementById("horas").value) || 0;
    const dias = parseInt(document.getElementById("quantidade_dias").value) || 0;

    if (materias.length === 0) {
        alert("Adicione pelo menos uma matéria!");
        return;
    }

    if (horas === 0 || dias === 0) {
        alert("Preencha as horas por dia e os dias corretamente!");
        return;
    }

    document.getElementById("ciclo").innerHTML = "";

    const ciclo = montarCiclo(materias, horas, dias);
    console.log("Resultado do Ciclo:", ciclo);

    ciclo.forEach(m => {
        const li = document.createElement("li");
        li.textContent = `${m.nome} (${m.nivel}) → ${m.horas}h`;
        document.getElementById("ciclo").appendChild(li);
    });
}

function criarPDF() {
    const conteudo = document.querySelector("#ciclo")

    if (!conteudo) {
        alert("Gere o ciclo antes de criar o PDF!");
        return;
    }

    const opicoes = {
        margin: [10, 10, 10, 10],
        filename: "ciclo.pdf",
        html2canvas: {scale: 2},
        jsPDF: {unit: "mm", format: "a4", orientation: "portrait"}
    }

    html2pdf().set(opicoes).from(conteudo).save()
}