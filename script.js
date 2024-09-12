let servicoSelecionado = "";
let precoSelecionado = "";

function changeScreen(button) {
    const tela1 = document.getElementById('tela-1');
    const tela2 = document.getElementById('tela-2');

    if (tela1.classList.contains('active')) {
        tela1.classList.remove('active');
        tela2.classList.add('active');

        servicoSelecionado = button.getAttribute('data-servico');
        precoSelecionado = button.getAttribute('data-preco');
    } else {
        tela2.classList.remove('active');
        tela1.classList.add('active');
    }
}

const horariosAgendados = [
    '2024-09-12T09:00',
    '2024-09-12T10:00',
    '2024-09-12T15:20'
];

function gerarHorariosDisponiveis(dataSelecionada) {
    const horarios = [];
    
    let inicioManha = new Date(`${dataSelecionada}T09:00`);
    let fimManha = new Date(`${dataSelecionada}T12:00`);
    
    let inicioTarde = new Date(`${dataSelecionada}T14:00`);
    let fimTarde = new Date(`${dataSelecionada}T19:30`);
    
    let atual = new Date(inicioManha);
    while (atual <= fimManha) {
        horarios.push(new Date(atual));
        atual.setMinutes(atual.getMinutes() + 40); 
    }

    atual = new Date(inicioTarde);
    while (atual <= fimTarde) {
        horarios.push(new Date(atual));
        atual.setMinutes(atual.getMinutes() + 40);
    }

    return horarios;
}

function formatarHorario(date) {
    return date.toTimeString().slice(0, 5);
}

function preencherHorariosDisponiveis(data) {
    const horarios = gerarHorariosDisponiveis(data);
    const botoesHorarios = document.querySelectorAll('.horarios button');
    
    botoesHorarios.forEach((botao) => {
        const horario = botao.textContent;
        const dataHora = `${data}T${horario}`;
        if (horariosAgendados.includes(dataHora)) {
            botao.disabled = true;
            botao.classList.add('agendado');
        } else {
            botao.disabled = false;
            botao.classList.remove('agendado');
        }
    });
}

document.getElementById('data').addEventListener('change', (event) => {
    const data = event.target.value;
    if (data) {
        preencherHorariosDisponiveis(data);
    }
});

function horarioJaAgendado(data, horario) {
    const dataHora = `${data}T${horario}`;
    return horariosAgendados.includes(dataHora);
}

function setHorario(horarioSelecionado) {
    document.getElementById('horario').value = horarioSelecionado;

    const botoesHorarios = document.querySelectorAll('.horarios button');
    botoesHorarios.forEach((botao) => {
        botao.classList.remove('selected');
    });

    const botaoSelecionado = Array.from(botoesHorarios).find(
        (botao) => botao.textContent === horarioSelecionado
    );
    if (botaoSelecionado) {
        botaoSelecionado.classList.add('selected');
    }
}

function formatarData(data) {
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function mostrarModal(mensagem) {
    const modal = document.getElementById('modal');
    const mensagemElemento = document.getElementById('modal-message');
    mensagemElemento.textContent = mensagem;
    modal.style.display = 'block';
}

function fecharModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

window.addEventListener('click', (event) => {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        fecharModal();
    }
});

function confirmarAgendamento() {
    const nome = document.getElementById('nome').value; 
    const telefone = document.getElementById('telefone').value;
    const data = document.getElementById('data').value;
    const horario = document.getElementById('horario').value;

    if (nome && telefone && data && horario) {
        if (horarioJaAgendado(data, horario)) {
            mostrarModal('Este horário já está agendado. Por favor, escolha outro horário.');
        } else {
            const dataFormatada = formatarData(data);
            const numeroWhatsApp = '5599991330396';
            const mensagem = `Olá, meu nome é ${nome}. Gostaria de agendar um ${servicoSelecionado} (${precoSelecionado}) para o dia ${dataFormatada} às ${horario}. Meu telefone é ${telefone}.`;

            const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
            window.open(url, '_blank');

            const dataHora = `${data}T${horario}`;
            horariosAgendados.push(dataHora);
            atualizarInterfaceHorarios(data);
        }
    } else {
        mostrarModal('Por favor, preencha todos os campos!');
    }
}

function atualizarInterfaceHorarios(data) {
    preencherHorariosDisponiveis(data);
}

window.addEventListener('load', () => {
    document.getElementById('modal').style.display = 'none';
});
