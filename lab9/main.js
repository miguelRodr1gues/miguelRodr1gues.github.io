if (!localStorage.getItem("produtos-selecionados")) {
    localStorage.setItem("produtos-selecionados", JSON.stringify([]));
}

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
let produtosSelecionados = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
let custoTotal = 0;

function atualizarCustoTotal() {

    custoTotal = produtosSelecionados.reduce((acc, produto) => acc + produto.price, 0);
    custoTotalElemento.textContent = `Custo total: ${custoTotal} €`;
}

function criaProdutoCesto(produto) {

    produtosSelecionados.push(produto);
    localStorage.setItem("produtos-selecionados", JSON.stringify(produtosSelecionados));

    const itemCesto = document.createElement("section");
    itemCesto.classList.add("product-card");
    itemCesto.innerHTML = `
        <h3>${produto.title}</h3>
        <article class="imagem">
            <img src="${produto.image}" alt="${produto.title}" />
        </article>
        <article class="product">
            <p class="price">${produto.price} €</p>
            <button class="remover">- Remover do Cesto</button>
        </article>
    `;

    const removerBtn = itemCesto.querySelector(".remover");
    removerBtn.addEventListener("click", () => removerDoCesto(produto, itemCesto));

    cestoContainer.appendChild(itemCesto);

    atualizarCustoTotal();
}

function removerDoCesto(produto, produtoCesto) {

    const index = produtosSelecionados.indexOf(produto);

    if (index !== -1) {
        produtosSelecionados.splice(index, 1);
        localStorage.setItem("produtos-selecionados", JSON.stringify(produtosSelecionados));
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
            <img src="${produto.image}" alt="${produto.title}" />
        </article>
        <article class="product">
            <p class="price">${produto.price} €</p>
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
    produtos.forEach((produto) => {
        console.log(produto.id);
        const artigoProduto = criarProduto(produto);
        produtosContainer.appendChild(artigoProduto);
    });
}

function atualizarCesto() {
    cestoContainer.innerHTML = "";

    produtosSelecionados.forEach((produto) => {
        criaProdutoCesto(produto);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos(produtos);
    atualizarCesto();
    atualizarCustoTotal();
});
