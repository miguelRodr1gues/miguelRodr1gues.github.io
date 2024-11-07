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
    let color = document.getElementById("color").value;

    if(color === "nigga"){
        color = "black";
    }
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
