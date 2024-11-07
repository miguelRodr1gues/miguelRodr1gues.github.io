document.querySelectorAll(".color-buttons>button").forEach( button => {
    button.addEventListener("click", () => {
        const color = button.dataset.color;
        document.querySelector(".pinta").style.color = color;
    });
});

// A cor aleatorio no background do texto a cada letra que escrevo
function changeBackgroundColor() {
    const input = document.getElementById("inputHighlight");
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    input.style.backgroundColor = randomColor;
}

// Muda cor de background
function submitColor() {
    const color = document.getElementById("color").value;
    document.body.style.backgroundColor = color;
}

// Contador
let countValue = 0;
function count() {
    countValue++;
    document.getElementById('count').textContent = countValue;
}

// Troca de texto ao passar
const passar = document.querySelector('.passa');

passar.addEventListener('mouseover', () => {
    passar.textContent = "Obrigado por passares!";
});

passar.addEventListener('mouseout', () => {
    passar.textContent = "1. Passa por aqui";
});

document.querySelector('select').onchange = function() {
    document.querySelector('body').style.backgroundColor = this.value;
}

document.querySelector('form').onsubmit = (e) => {
    e.preventDefault();
    
    const nome = document.getElementById("nome").value;
    const idade = document.getElementById("idade").value;

    // Exibir a mensagem
    document.getElementById("mensagem").textContent = `Olá ${nome}, tens ${idade} anos.`;
};

let automaticCounter;
function automaticCounter() {

    automaticCounter++;
    document.getElementById('automaticCounter').textContent = count;
}
setInterval(count, 1000);