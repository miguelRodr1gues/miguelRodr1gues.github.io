
// Caso não existir nada na chave 'produtos-selecionados', da set a chave produtos-selecionados vazios
function criaLocalStorage() {
    if (!localStorage.getItem('produtos-selecionados')) {
        localStorage.setItem('produtos-selecionados', JSON.stringify([]));
    }
}

// Limpa o storage cada quando o utilizador compra
function limparStorage() {
    localStorage.setItem('produtos-selecionados', JSON.stringify([]));
}

// Desliza até a ancora que o utilizador carregou
document.querySelectorAll('.ancora').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth',
            });
        }
    });
});

const produtosContainer = document.getElementById("produtos");
const cestoContainer = document.getElementById("cesto");
const custoTotalElemento = document.getElementById("custo-total");
let produtosSelecionados = [];
let custoTotal = 0;

// Atualiza o custo total cada vez que o utilizador mete um produto no cesto ou quando da refresh
function atualizarCustoTotal() {

    custoTotal = produtosSelecionados.reduce((acc, produto) => acc + produto.price, 0);
    custoTotalElemento.textContent = `Custo total: ${custoTotal.toFixed(2)} €`;
}

// Cria o produto no cesto com base no produto carregado
function criaProdutoCesto(produto) {

    
    produtosSelecionados.push(produto);

    localStorage.setItem('produtos-selecionados', JSON.stringify(produtosSelecionados));

    const itemCesto = document.createElement("section");
    itemCesto.classList.add("product-card");
    itemCesto.innerHTML = `
        <h3>${produto.title}</h3>
        <article class="imagem">
            <img src="${produto.image}" alt="${produto.title}">
        </article>
        <article class="product">
            <p class="price">${produto.price.toFixed(2)} €</p>
            <button class="remover">- Remover do Cesto</button>
        </article>
    `;

    const removerBtn = itemCesto.querySelector(".remover");
    removerBtn.addEventListener("click", () => removerDoCesto(produto, itemCesto));

    cestoContainer.append(itemCesto);
    atualizarCustoTotal();
}

// Remove o produto do cesto quando carrego no botao remover
function removerDoCesto(produto, produtoCesto) {

    const index = produtosSelecionados.findIndex(p => p.id === produto.id);

    if (index !== -1) {
        produtosSelecionados.splice(index, 1);
        localStorage.setItem('produtos-selecionados', JSON.stringify(produtosSelecionados));
    }

    produtoCesto.remove();
    atualizarCustoTotal();
}

let produtosTodos = [];

// Cria a seccao produto para meter no body
function criarProduto(produto) {
    
    const productCard = document.createElement("section");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
        <h3>${produto.title}</h3>
        <article class="imagem">
            <img src="${produto.image}" alt="${produto.title}">
        </article>
        <article class="product">
            <p class="price">${produto.price.toFixed(2)} €</p>
            <p class="descricao">${produto.description}</p>
            <p class="rating">Rating: ${produto.rating.rate} ⭐ (${produto.rating.count} avaliações)</p>
            <button>+ Adicionar ao Cesto</button>
        </article>
    `;

    const button = productCard.querySelector("button");
    button.addEventListener("click", () => criaProdutoCesto(produto));

    return productCard;
}

// Carrega todos os produtos de forma a aparecer
function carregarProdutos(produtos) {
    produtosContainer.innerHTML = '';
    produtos.forEach((produto) => {
        const artigoProduto = criarProduto(produto);
        produtosContainer.append(artigoProduto);
    });
}

// Atualiza o cesto quando dou refresh no site ou quando compro algum produto
function atualizaCesto() {
    
    const produtosCesto = JSON.parse(localStorage.getItem('produtos-selecionados'));
    produtosCesto.forEach((produto) => {
        criaProdutoCesto(produto);
    });
}

let produtos = [];

// da get aos produtos
fetch('https://deisishop.pythonanywhere.com/products/')
    .then(response => response.json())
    .then(data => {
        produtos = data;
        carregarProdutos(data);
        atualizaCesto();
        criaLocalStorage();
    })
    .catch(error => console.error('Erro:', error));

// da get as categorias
fetch('https://deisishop.pythonanywhere.com/categories/')
    .then(response => response.json())
    .then(data => opcoesFiltro(data))
    .catch(error => console.error('Erro:', error));

let filtro = 'todas';
let ordem = 'preco';
let pesquisa = '';


// Filtra por categorias, ordena por preco, filtra por palavra
function filtrar() {
    let produtosFiltrados = produtos;

    if (filtro !== 'todas') {
        produtosFiltrados = produtosFiltrados.filter(produto => produto.category === filtro);
    }

    if (ordem === 'preco-decrescente') {
        produtosFiltrados.sort((a, b) => b.rating.rate - a.rating.rate);
    } else if (ordem === 'preco-crescente') {
        produtosFiltrados.sort((a, b) => a.rating.rate - b.rating.rate);
    }

    if (pesquisa) {
        produtosFiltrados = produtosFiltrados.filter(produto =>
            produto.title.toLowerCase().includes(pesquisa.toLowerCase()) || produto.description.toLowerCase().includes(pesquisa.toLowerCase())
        );
    }

    carregarProdutos(produtosFiltrados);
}



document.querySelector('#filtrar').addEventListener('change', (event) => {
    filtro = event.target.value;
    filtrar();
});

// Caso haja mudança na ordem filtra
document.querySelector('#ordenar').addEventListener('change', (event) => {
    ordem = event.target.value;
    filtrar();
});

// Caso haja mudança na pesquisa filtra
document.querySelector('#pesquisar').addEventListener('input', (event) => {
    pesquisa = event.target.value;
    filtrar();
});

// Adiciona os varios filtros
function opcoesFiltro(opcoes) {
    const filtros = document.querySelector('#filtrar');
    opcoes.forEach(opcao => {
        filtros.innerHTML += `<option value="${opcao}">${opcao}</option>`;
    });
}

// Quando o utilizador compra dá a o custo total com descontos eventuais e referencia
document.querySelector('.comprar').addEventListener('click', () => {
    fetch('https://deisishop.pythonanywhere.com/buy/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(compra()),
    })
        .then(response => response.json()
        .then(data => {
            document.querySelector('.dados').innerHTML = `
                <p class="valor-final">Valor final a pagar (com eventuais descontos): ${data.totalCost} €</p>
                <p>Referência de pagamento: ${data.reference}</p>
                <p>Morada: ${data.address}</p>
            `;
        })
        .catch(error => console.error('Erro ao processar a requisição:', error)));
});

// funcao é executada quando o utilizador carrega em comprar
function compra() {

    const products = produtosSelecionados.map(produto => produto.id);
    const student = document.querySelector('#checkbox-estudante').checked;
    const coupon = document.querySelector('#input-cupao').value;
    const address = document.querySelector('#input-morada').value;

    limparStorage();
    atualizaCesto();

    return { products, student, coupon , address };
}

const adicionarAll = document.querySelector('#adicionar-todos');
adicionarAll.addEventListener("click", () => adicionarTodos());

function adicionarTodos(produtos) {

    produtos.forEach((produto) => {
        criaProdutoCesto(produto);
    });
}


const menosInfo = document.querySelector.querySelector("#menosInfo");
menosInfo.addEventListener("click", () => menosInfoProdutos());

function menosInfoProdutos() {


}
