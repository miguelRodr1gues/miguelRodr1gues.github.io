// Muda a cor do texto ao clicar nos botões
document.querySelectorAll(".color-buttons>button").forEach(button => {
    button.addEventListener("click", () => {
        const color = button.dataset.color;
        document.querySelector(".pinta").style.color = color;
    });
});

// A cor aleatória no background do texto a cada letra que escrevo
function changeBackgroundColor() {
    const input = document.getElementById("inputHighlight");
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    input.style.backgroundColor = randomColor;
}

// Muda a cor de fundo do corpo
function submitColor() {
    const color = document.getElementById("color").value;
    document.body.style.backgroundColor = color;
}

// Contador
if (!localStorage.getItem('counter')) {
    localStorage.setItem('counter', 0);
}

function count() {
    let counter = localStorage.getItem('counter');
    counter++;
    document.getElementById('count').textContent = counter;
    localStorage.setItem('counter', counter);
}

// Guarda o valor do contador
document.getElementById('count').textContent = localStorage.getItem('counter');

// Troca de texto ao passar o mouse
const passar = document.querySelector('.passa');

passar.addEventListener('mouseover', () => {
    passar.textContent = "Obrigado por passares!";
});

passar.addEventListener('mouseout', () => {
    passar.textContent = "1. Passa por aqui";
});

// Muda a cor de fundo com base na seleção de cor
document.querySelector('select').onchange = function() {
    document.querySelector('body').style.backgroundColor = this.value;
}

// Exibe a mensagem com o nome e idade do formulário
document.querySelector('form').onsubmit = (e) => {
    e.preventDefault();
    
    const nome = document.getElementById("nome").value;
    const idade = document.getElementById("idade").value;

    // Exibir a mensagem
    document.getElementById("mensagem").textContent = `Olá ${nome}, tens ${idade} anos.`;
};

// Contador automático
let automaticCounterValue = 0;
function automaticCounter() {
    automaticCounterValue++;
    document.getElementById('automaticCounter').textContent = automaticCounterValue;
}
setInterval(automaticCounter, 1000);
