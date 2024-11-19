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

// Seleciona o container onde os produtos serão exibidos
const produtosContainer = document.getElementById("produtos");

// Itera sobre os produtos e cria as seções
produtos.forEach((produto) => {
    // Cria a estrutura HTML para cada produto
    const productCard = `
        <section class="product-card">
            <h3>${produto.title}</h3>

            <section class="imagem">
                <img src="${produto.image}" alt="${produto.title}" />
            </section>

            <section class="product">
                <p class="price">Custo total: ${produto.price.toFixed(2)} €</p>
                <p class="descricao">${produto.description}</p>
                <p class="rating">Rating: ${produto.rating.rate} ⭐ (${produto.rating.count} avaliações)</p>
                <button>+ Adicionar ao Cesto</button>
            </section>
        </section>
    `;

    // Insere a estrutura no container de produtos
    produtosContainer.innerHTML += productCard;
});



