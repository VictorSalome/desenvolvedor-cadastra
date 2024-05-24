import { Product } from "./Product";

const serverUrl = "http://localhost:5000"; // URL do servidor

// Função para converter o valor vindo da API para reais
function convertToReal(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// Funções para abrir e fechar os modais de filtro e ordenação
function openFilterModal() {
  const filterMenu = document.getElementById("filter-menu");
  if (filterMenu) filterMenu.style.display = "flex";
}

function closeFilterModal() {
  const filterMenu = document.getElementById("filter-menu");
  if (filterMenu) filterMenu.style.display = "none";
}

function openOrderModal() {
  const orderMenu = document.getElementById("order-menu");
  if (orderMenu) orderMenu.style.display = "flex";
}

function closeOrderModal() {
  const orderMenu = document.getElementById("order-menu");
  if (orderMenu) orderMenu.style.display = "none";
}

// Função para filtrar os produtos

// Adiciona eventos de clique aos botões para abrir e fechar os modais
document.addEventListener("DOMContentLoaded", () => {
  const toggleFilterButton = document.getElementById("toggle-filter");
  const closeModalButton = document.getElementById("close-filter-modal");
  const toggleOrderButton = document.getElementById("toggle-order");
  const closeOrderModalButton = document.getElementById("close-order-modal");

  if (toggleFilterButton && closeModalButton) {
    toggleFilterButton.addEventListener("click", openFilterModal);
    closeModalButton.addEventListener("click", closeFilterModal);
  }

  if (toggleOrderButton && closeOrderModalButton) {
    toggleOrderButton.addEventListener("click", openOrderModal);
    closeOrderModalButton.addEventListener("click", closeOrderModal);
  }

  // Fecha o modal se o usuário clicar fora do conteúdo
  window.addEventListener("click", (event) => {
    const filterMenu = document.getElementById("filter-menu");
    const orderMenu = document.getElementById("order-menu");

    if (event.target === filterMenu) closeFilterModal();
    if (event.target === orderMenu) closeOrderModal();
  });

  // Acordeões para filtros
  const accordions = [
    { buttonId: "accordion-colors", contentId: "accordion-content-colors" },
    { buttonId: "accordion-sizes", contentId: "accordion-content-sizes" },
    {
      buttonId: "accordion-price-range",
      contentId: "accordion-content-price-range",
    },
  ];

  // Adiciona eventos de clique aos botões de acordeão para alternar a exibição do conteúdo
  accordions.forEach((accordion) => {
    const button = document.getElementById(accordion.buttonId);
    const content = document.getElementById(accordion.contentId);

    if (button && content) {
      button.addEventListener("click", () => {
        content.style.display =
          content.style.display === "block" ? "none" : "block";
      });
    }
  });

  // Chama a função principal para renderizar os produtos
  main();
});

// Função principal para obter os dados da API e renderizar os produtos na tela web
async function main() {
  console.log(serverUrl); // Exibe a URL do servidor no console

  // Função para obter os dados da API
  async function fetchProducts() {
    try {
      const response = await fetch(`${serverUrl}/products`);

      const products = await response.json();
      return products;
    } catch (error) {
      console.error("Erro ao consumir a API:", error);
      throw error;
    }
  }

  // Função para carregar mais produtos
  const loadMoreBtnWeb = document.getElementById("load-more-btn");
  const loadMoreBtnMobile = document.getElementById("load-more-btn-mobile");
  if (loadMoreBtnWeb || loadMoreBtnMobile) {
    let currentLimit = 0;
    const productsContainerWeb = document.getElementById("card-container");
    const productsContainerMobile = document.getElementById(
      "card-container-mobile"
    );
    if (productsContainerWeb || productsContainerMobile) {
      const products = await fetchProducts();
      products
        .slice(currentLimit, currentLimit + 6)
        .forEach((product: Product) => {
          const productCardWeb = document.createElement("div");
          const productCardMobile = document.createElement("div");
          productCardWeb.classList.add("product-item");
          productCardMobile.classList.add("product-item-mobile");
          productCardWeb.innerHTML = `
          <img class="product-image" src="${product.image}" alt="${
            product.name
          }">
          <div class="product-name">${product.name}</div>
          <div class="product-price">${convertToReal(product.price)}</div>
          <div class="product-installment">até ${
            product.parcelamento[0]
          }x de ${convertToReal(product.parcelamento[1])}</div>
          <button class="buy-button">Comprar</button>
        `;
          productCardMobile.innerHTML = `
          <img class="product-image-mobile" src="${product.image}" alt="${
            product.name
          }">
          <div class="product-name-mobile">${product.name}</div>
          <div class="product-price-mobile">${convertToReal(
            product.price
          )}</div>
          <div class="product-installment-mobile">até ${
            product.parcelamento[0]
          }x de R$${convertToReal(product.parcelamento[1])}</div>
          <button class="buy-button-mobile">Comprar</button>
        `;

          productsContainerWeb?.appendChild(productCardWeb);
          productsContainerMobile?.appendChild(productCardMobile);
        });
      currentLimit += 6;
    }

    (loadMoreBtnWeb || loadMoreBtnMobile)?.addEventListener(
      "click",
      async () => {
        const products = await fetchProducts();
        products
          .slice(currentLimit, currentLimit + 3)
          .forEach((product: Product) => {
            const productCardWeb = document.createElement("div");
            const productCardMobile = document.createElement("div");
            productCardWeb.classList.add("product-item");
            productCardMobile.classList.add("product-item-mobile");
            productCardWeb.innerHTML = `
            <img class="product-image" src="${product.image}" alt="${
              product.name
            }">
            <div class="product-name">${product.name}</div>
            <div class="product-price">${convertToReal(product.price)}</div>
            <div class="product-installment">até ${
              product.parcelamento[0]
            }x de ${convertToReal(product.parcelamento[1])}</div>
            <button class="buy-button">Comprar</button>
          `;
            productCardMobile.innerHTML = `
            <img class="product-image-mobile" src="${product.image}" alt="${
              product.name
            }">
            <div class="product-name-mobile">${product.name}</div>
            <div class="product-price-mobile">${convertToReal(
              product.price
            )}</div>
            <div class="product-installment-mobile">até ${
              product.parcelamento[0]
            }x de R$${convertToReal(product.parcelamento[1])}</div>
            <button class="buy-button-mobile">Comprar</button>
          `;

            productsContainerWeb?.appendChild(productCardWeb);
            productsContainerMobile?.appendChild(productCardMobile);
          });
        currentLimit += 3;
      }
    );
  }

  // Função para renderizar os produtos na tela web
  async function renderProductsWeb() {
    const products = await fetchProducts();
    const productsContainer = document.getElementById("card-container");
    if (productsContainer) {
      productsContainer.innerHTML = "";
      let currentLimit = 0;
      while (currentLimit < 6) {
        const displayProducts = products.slice(currentLimit, currentLimit + 3);
        displayProducts.forEach((product: Product) => {
          const productCard = document.createElement("div");
          productCard.classList.add("product-item");
          productCard.innerHTML = `
              <img class="product-image" src="${product.image}" alt="${
            product.name
          }">
              <div class="product-name">${product.name}</div>
              <div class="product-price">${convertToReal(product.price)}</div>
              <div class="product-installment">até ${
                product.parcelamento[0]
              }x de ${convertToReal(product.parcelamento[1])}</div>
              <button class="buy-button" id="buy-button">Comprar</button>
            `;
          productsContainer.appendChild(productCard);
        });
        currentLimit += 3;
      }
    }
  }

  renderProductsWeb();

  // Função para filtrar os produtos de acordo com o checkbox selecionado
  function filterByPrice() {
    const priceOptions = Array.from(
      document.querySelectorAll<HTMLInputElement>("input[name='price']")
    );
    const productsContainerWeb = document.getElementById("card-container");
    if (productsContainerWeb) {
      productsContainerWeb.innerHTML = "";
      const allProducts = fetchProducts();
      const selectedPrices = priceOptions
        .filter((option) => option.checked)
        .map((option) => option.value.split("-"))
        .map(([min, max]) => [parseInt(min), parseInt(max)]);
      const filteredProducts = allProducts.then((products: Product[]) => {
        if (selectedPrices.length === 0) {
          return products.sort((a, b) => a.price - b.price);
        } else {
          return products
            .filter((product) => {
              return selectedPrices.some(([min, max]) => {
                const price = product.price;
                return min === 0 ? price <= max : price >= min && price <= max;
              });
            })
            .sort((a, b) => a.price - b.price);
        }
      });
      filteredProducts.then((filteredProducts) => {
        filteredProducts.forEach((product: Product) => {
          const productCard = document.createElement("div");
          productCard.classList.add("product-item");
          productCard.innerHTML = `
            <img class="product-image" src="${product.image}" alt="${
            product.name
          }">
            <div class="product-name">${product.name}</div>
            <div class="product-price">${convertToReal(product.price)}</div>
            <div class="product-installment">até ${
              product.parcelamento[0]
            }x de ${convertToReal(product.parcelamento[1])}</div>
            <button class="buy-button" id="buy-button">Comprar</button>
          `;
          const buyButton = productCard.querySelector(".buy-button");
          buyButton.addEventListener("click", () => {
            const counter = document.getElementById(
              "counter"
            ) as HTMLSpanElement;
            counter.innerText = (parseInt(counter.innerText) + 1).toString();
          });

          productsContainerWeb.appendChild(productCard);
        });
      });
    }
  }

  // Adicionar evento de escuta para o checkbox
  const priceOptions = Array.from(
    document.querySelectorAll<HTMLInputElement>("input[name='price']")
  );

  priceOptions.forEach((option) => {
    option.addEventListener("change", () => {
      const isChecked = option.checked;
      if (!isChecked) {
        renderProductsWeb();
      } else {
        filterByPrice();
      }
    });
  });
  function filterBySize() {
    const sizeOptions = Array.from(
      document.querySelectorAll<HTMLInputElement>("input[name='size']")
    );
    const productsContainerWeb = document.getElementById("card-container");

    if (productsContainerWeb) {
      productsContainerWeb.innerHTML = "";
      fetchProducts().then((products: Product[]) => {
        const selectedSizes = sizeOptions
          .filter((option) => option.checked)
          .map((option) => option.value);
        const filteredProducts =
          selectedSizes.length === 0
            ? products
            : products
                .filter((product) => {
                  return selectedSizes.some((size) =>
                    product.size?.includes(size)
                  );
                })
                .sort((a, b) => a.price - b.price);
        filteredProducts.forEach((product: Product) => {
          const productCard = document.createElement("div");
          productCard.classList.add("product-item");
          productCard.innerHTML = `
            <img class="product-image" src="${product.image}" alt="${
            product.name
          }">
            <div class="product-name">${product.name}</div>
            <div class="product-price">${convertToReal(product.price)}</div>
            <div class="product-installment">até ${
              product.parcelamento[0]
            }x de ${convertToReal(product.parcelamento[1])}</div>
            <button class="buy-button" id="buy-button">Comprar</button>
          `;

          const buyButton = productCard.querySelector(".buy-button");
          buyButton.addEventListener("click", () => {
            const counter = document.getElementById(
              "counter"
            ) as HTMLSpanElement;
            counter.innerText = (parseInt(counter.innerText) + 1).toString();
          });
          productsContainerWeb.appendChild(productCard);
        });
      });
    }
  }

  // Adicionar evento de escuta para o checkbox
  const sizeOptions = Array.from(
    document.querySelectorAll<HTMLInputElement>("input[name='size']")
  );
  sizeOptions.forEach((option) => {
    option.addEventListener("change", filterBySize);
  });

  function filterByColor() {
    const colorOptions = Array.from(
      document.querySelectorAll<HTMLInputElement>("input[name='color']")
    );
    const productsContainerWeb = document.getElementById("card-container");

    if (productsContainerWeb) {
      productsContainerWeb.innerHTML = "";
      fetchProducts().then((products: Product[]) => {
        const selectedColors = colorOptions
          .filter((option) => option.checked)
          .map((option) => option.value);
        const filteredProducts =
          selectedColors.length === 0
            ? products
            : products
                .filter((product) => {
                  return selectedColors.some((color) =>
                    product.color?.includes(color)
                  );
                })
                .sort((a, b) => a.price - b.price);
        filteredProducts.forEach((product: Product) => {
          const productCard = document.createElement("div");
          productCard.classList.add("product-item");
          productCard.innerHTML = `
          <img class="product-image" src="${product.image}" alt="${
            product.name
          }">
          <div class="product-name">${product.name}</div>
          <div class="product-price">${convertToReal(product.price)}</div>
          <div class="product-installment">até ${
            product.parcelamento[0]
          }x de ${convertToReal(product.parcelamento[1])}</div>
          <button class="buy-button" id="buy-button">Comprar</button>
        `;

          const buyButton = productCard.querySelector(".buy-button");
          buyButton.addEventListener("click", () => {
            const counter = document.getElementById(
              "counter"
            ) as HTMLSpanElement;
            counter.innerText = (parseInt(counter.innerText) + 1).toString();
          });
          productsContainerWeb.appendChild(productCard);
        });
      });
    }
  }

  // Adicionar evento de escuta para o checkbox
  const colorOptions = Array.from(
    document.querySelectorAll<HTMLInputElement>("input[name='color']")
  );
  colorOptions.forEach((option) => {
    option.addEventListener("change", filterByColor);
  });

  // Função para filtrar os produtos de acordo com o dropdown selecionado
  function filterProductsWeb(filter: string) {
    const productsContainer = document.getElementById(
      "card-container"
    ) as HTMLElement;
    productsContainer.innerHTML = "";
    fetchProducts().then((products: Product[]) => {
      switch (filter) {
        case "recent":
          products.sort((a, b) => b.id - a.id);
          break;
        case "lowest":
          products.sort((a, b) => a.price - b.price);
          break;
        case "highest":
          products.sort((a, b) => b.price - a.price);
          break;
      }
      products.forEach((product: Product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-item");
        productCard.innerHTML = `
          <img class="product-image" src="${product.image}" alt="${
          product.name
        }">
          <div class="product-name">${product.name}</div>
          <div class="product-price">${convertToReal(product.price)}</div>
          <div class="product-installment">até ${
            product.parcelamento[0]
          }x de ${convertToReal(product.parcelamento[1])}</div>
          <button class="buy-button" id="buy-button">Comprar</button>
        `;

        const buyButton = productCard.querySelector(".buy-button");
        buyButton.addEventListener("click", () => {
          const counter = document.getElementById("counter") as HTMLSpanElement;
          counter.innerText = (parseInt(counter.innerText) + 1).toString();
        });
        productsContainer.appendChild(productCard);
      });
    });
  }

  document
    .getElementById("dropdown-recent")!
    .addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "A") {
        filterProductsWeb(target.id);
      }
    });

  document.getElementById("order-menu")!.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target.tagName === "BUTTON" && target.hasAttribute("data-order")) {
      filterProductsMobileOrder(target.getAttribute("data-order")!);
    }
  });

  // Seção mobile

  async function filterProductsMobileOrder(filter: string) {
    const productsContainer = document.getElementById(
      "card-container-mobile"
    ) as HTMLElement;
    productsContainer.innerHTML = "";
    fetchProducts().then((products: Product[]) => {
      switch (filter) {
        case "recent":
          products.sort((a, b) => b.id - a.id);
          break;
        case "lowest":
          products.sort((a, b) => a.price - b.price);
          break;
        case "highest":
          products.sort((a, b) => b.price - a.price);
          break;
      }
      products.forEach((product: Product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-item-mobile");
        productCard.innerHTML = `
          <img class="product-image-mobile" src="${product.image}" alt="${
          product.name
        }">
          <div class="product-name-mobile">${product.name}</div>
          <div class="product-price-mobile">${convertToReal(
            product.price
          )}</div>
          <div class="product-installment-mobile">até ${
            product.parcelamento[0]
          }x de R$${convertToReal(product.parcelamento[1])}</div>
          <button class="buy-button-mobile">Comprar</button>
        `;
        const buyButton = productCard.querySelector(".buy-button-mobile");
        buyButton.addEventListener("click", () => {
          const counter = document.getElementById("counter") as HTMLSpanElement;
          counter.innerText = (parseInt(counter.innerText) + 1).toString();
        });

        productsContainer.appendChild(productCard);
      });
    });
    closeOrderModal();
  }

  async function getSelectedColors(): Promise<string[]> {
    console.log("Buscando opções de cores selecionadas...");
    const colorOptions = Array.from(
      document.querySelectorAll<HTMLInputElement>(
        'input[name-mobile="color"]:checked'
      )
    );
    const selectedColors = colorOptions.map((option) => option.value);
    console.log("Cores selecionadas:", selectedColors);
    return selectedColors;
  }

  async function getSelectedSizes(): Promise<string[]> {
    console.log("Buscando opções de tamanhos selecionadas...");
    const sizeOptions = Array.from(
      document.querySelectorAll<HTMLInputElement>(
        'input[name-mobile="size"]:checked'
      )
    );
    const selectedSizes = sizeOptions.map((option) => option.value);
    console.log("Tamanhos selecionados:", selectedSizes);
    return selectedSizes;
  }

  async function getSelectedPriceRanges(): Promise<
    { min: number; max: number | null }[]
  > {
    console.log("Buscando opções de faixas de preço selecionadas...");
    const priceOptions = Array.from(
      document.querySelectorAll<HTMLInputElement>(
        'input[name-mobile="price"]:checked'
      )
    );
    const selectedRanges = priceOptions.map((option) => {
      const [min, max] = option.value.split("-").map(Number);
      return { min, max: isNaN(max) ? null : max };
    });
    console.log("Faixas de preço selecionadas:", selectedRanges);
    return selectedRanges;
  }

  async function filterProductsMobile() {
    try {
      console.log("Iniciando filtro de produtos...");
      const [selectedColors, selectedSizes, selectedRanges] = await Promise.all(
        [getSelectedColors(), getSelectedSizes(), getSelectedPriceRanges()]
      );

      const products = await fetchProducts();
      console.log("Produtos carregados:", products);

      const filteredProducts = products
        .filter((product: Product) => {
          const colorMatch =
            selectedColors.length === 0 ||
            selectedColors.some((color) => product.color.includes(color));
          const sizeMatch =
            selectedSizes.length === 0 ||
            selectedSizes.some((size) => product.size.includes(size));
          const priceMatch =
            selectedRanges.length === 0 ||
            selectedRanges.some(({ min, max }) => {
              return max
                ? product.price >= min && product.price <= max
                : product.price >= min;
            });
          return colorMatch && sizeMatch && priceMatch;
        })
        .sort((a: Product, b: Product) => a.price - b.price);

      console.log("Produtos filtrados:", filteredProducts);

      const productsContainer = document.getElementById(
        "card-container-mobile"
      ) as HTMLElement;
      productsContainer.innerHTML = "";

      filteredProducts.forEach((product: Product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-item-mobile");
        productCard.innerHTML = `
                <img class="product-image-mobile" src="${product.image}" alt="${
          product.name
        }">
                <div class="product-name-mobile">${product.name}</div>
                <div class="product-price-mobile">${convertToReal(
                  product.price
                )}</div>
                <div class="product-installment-mobile">até ${
                  product.parcelamento[0]
                }x de R$${convertToReal(product.parcelamento[1])}</div>
                <button class="buy-button-mobile" onclick="closeOrderModal()">Comprar</button>
            `;

        const buyButton = productCard.querySelector(".buy-button-mobile");
        buyButton.addEventListener("click", () => {
          const counter = document.getElementById("counter") as HTMLSpanElement;
          counter.innerText = (parseInt(counter.innerText) + 1).toString();
        });
        productsContainer.appendChild(productCard);
      });

      console.log("Produtos exibidos com sucesso!");
    } catch (error) {
      console.error("Erro ao filtrar produtos:", error);
    }
  }

  document.getElementById("apply-button")?.addEventListener("click", () => {
    console.log("Aplicando filtros");
    filterProductsMobile();
    closeFilterModal();
  });
  function clearFilters() {
    const checkboxes = document.querySelectorAll(
      '.color-option input[type="checkbox"], .size-option input[type="checkbox"], .price-option input[type="checkbox"]'
    );
    checkboxes.forEach(
      (checkbox) => ((checkbox as HTMLInputElement).checked = false)
    );
  }

  document
    .getElementById("clean-button")
    ?.addEventListener("click", clearFilters);

  let currentLimit = 6; // número de produtos exibidos na tela inicial

  async function renderProductsMobile() {
    const products = await fetchProducts();
    const productsContainer = document.getElementById("card-container-mobile");
    if (productsContainer) {
      productsContainer.innerHTML = "";
      products.slice(0, currentLimit).forEach((product: Product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-item-mobile");
        productCard.innerHTML = `
            <img class="product-image-mobile" src="${product.image}" alt="${
          product.name
        }">
            <div class="product-name-mobile">${product.name}</div>
            <div class="product-price-mobile">${convertToReal(
              product.price
            )}</div>
            <div class="product-installment-mobile">até ${
              product.parcelamento[0]
            }x de R$${convertToReal(product.parcelamento[1])}</div>
            <button class="buy-button-mobile" >Comprar</button>
          `;

        const buyButton = productCard.querySelector(".buy-button-mobile");
        buyButton.addEventListener("click", () => {
          const counter = document.getElementById("counter") as HTMLSpanElement;
          counter.innerText = (parseInt(counter.innerText) + 1).toString();
        });
        productsContainer.appendChild(productCard);
      });

      const loadMoreBtnMobile = document.getElementById("load-more-btn-mobile");
      if (loadMoreBtnMobile) {
        loadMoreBtnMobile.addEventListener("click", () => {
          currentLimit += 3; // adiciona mais 3 produtos à tela
          renderProductsMobile();
        });
      }
    }
  }

  renderProductsMobile();
}
1;
