function criaLocalStorage() {
    if (!localStorage.getItem('produtos-selecionados')) {
        localStorage.setItem('produtos-selecionados', JSON.stringify([]));
    }
}

function limparStorage() {
    localStorage.setItem('produtos-selecionados', JSON.stringify([]));
}

let produtosSelecionados = [];
let custoTotal = 0;

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

function atualizarCustoTotal() {
    custoTotal = produtosSelecionados.reduce((acc, produto) => acc + produto.price, 0);
    custoTotalElemento.textContent = `Custo total: ${custoTotal.toFixed(2)} €`;
}

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

    cestoContainer.appendChild(itemCesto);
    atualizarCustoTotal();
}

function removerDoCesto(produto, produtoCesto) {
    const index = produtosSelecionados.findIndex(p => p.id === produto.id);

    if (index !== -1) {
        produtosSelecionados.splice(index, 1);
        localStorage.setItem('produtos-selecionados', JSON.stringify(produtosSelecionados));
    }

    produtoCesto.remove();
    atualizarCustoTotal();
}

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

function carregarProdutos(produtos) {
    produtosContainer.innerHTML = '';
    produtos.forEach((produto) => {
        const artigoProduto = criarProduto(produto);
        produtosContainer.appendChild(artigoProduto);
    });
}

function atualizaCesto() {
    produtosCarrinho = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];
    produtosCarrinho.forEach((produto) => {
        criaProdutoCesto(produto);
    });
}

let produtos = [];

fetch('https://deisishop.pythonanywhere.com/products/')
    .then(response => response.json())
    .then(data => {
        produtos = data;
        carregarProdutos(data);
        atualizaCesto();
        criaLocalStorage();
    })
    .catch(error => console.error('Erro:', error));

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
        produtosFiltrados.sort((a, b) => b.price - a.price);
    } else if (ordem === 'preco-crescente') {
        produtosFiltrados.sort((a, b) => a.price - b.price);
    }

    if (pesquisa) {
        produtosFiltrados = produtosFiltrados.filter(produto =>
            produto.title.toLowerCase().includes(pesquisa.toLowerCase())
        );
    }

    carregarProdutos(produtosFiltrados);
}

document.querySelector('#filtrar').addEventListener('change', (event) => {
    filtro = event.target.value;
    filtrar();
});

document.querySelector('#ordenar').addEventListener('change', (event) => {
    ordem = event.target.value;
    filtrar();
});

document.querySelector('#pesquisar').addEventListener('input', (event) => {
    pesquisa = event.target.value;
    filtrar();
});

function opcoesFiltro(opcoes) {
    const filtros = document.querySelector('#filtrar');
    opcoes.forEach(opcao => {
        filtros.innerHTML += `<option value="${opcao}">${opcao}</option>`;
    });
}

document.querySelector('.comprar').addEventListener('click', () => {
    fetch('https://deisishop.pythonanywhere.com/buy/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(compra()),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            document.querySelector('.dados').innerHTML = `
                <p>Valor final a pagar (com eventuais descontos): ${data.totalCost} €</p>
                <p>Referência de pagamento: ${data.reference}</p>
            `;
        })
        .catch(error => console.error('Erro ao processar a requisição:', error));
});

function compra() {
    const products = produtosSelecionados.map(produto => produto.id);
    const student = document.querySelector('#estudante').checked;
    const coupon = document.querySelector('#cupao').value;

    limparStorage();
    produtosSelecionados = [];
    atualizaCesto();

    return { products, student, coupon };
}
