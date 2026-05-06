"use strict";

const productsWrapper = document.querySelector(".products"),
  controlsBtn = productsWrapper.querySelectorAll(".products__controls"),
  products = productsWrapper.querySelectorAll(".products__item");

let state = {
  products: [],
  cart: {},
  totalOrderPrice: 0,
};

let cartCounter = 1;

function loadData() {
  return fetch("data.json")
    .then((response) => response.json())
    .then((data) => (state.products = data))
    .catch((error) => console.log(error));
}

function createProductItems() {
  productsWrapper.innerHTML = ``;
  state.products.forEach((product, i) => {
    const item = document.createElement("li");

    item.classList.add("products__item");
    item.dataset.id = i;

    item.innerHTML = `
         <div class="products__preview">
         <img src="${product.image.desktop}" alt="${product.name}" class="products__img">
         <button class="products__add">
          <img src="/assets/images/icon-add-to-cart.svg" class="products__cart">
            Add to Cart
         </button>
            <div class="products__controls hide">
          <button  class="products__btn products__btn-decrement"><img src="/assets/images/icon-decrement-quantity.svg" alt=""></button>

          <p class="products__selected-quantity">1</p>

           <button class="products__btn products__btn-increment"><img src="/assets/images/icon-increment-quantity.svg" alt="" ></button>
         </div>
      </div>
       <div class="products__info">
          <p class="products__category">${product.category}</p>
          <p class="products__name">${product.name}</p>

          <p class="products__price">$${product.price}</p>
         </div>
        `;

    productsWrapper.append(item);
  });
}

function updateProductUI(parrentSelector, id) {
  const item = parrentSelector.querySelector(".products__controls");
  item.remove();
  const parrent = parrentSelector.querySelector(".products__preview");
  const controlItem = document.createElement("div");
  controlItem.classList.add("products__controls");
  controlItem.classList.add("products__controls-active");
  controlItem.innerHTML = `
    <button  class="products__btn products__btn-decrement"><img src="/assets/images/icon-decrement-quantity.svg" alt=""></button>

        <p class="products__selected-quantity">${state.cart[id].count}</p>

    <button class="products__btn products__btn-increment"><img src="/assets/images/icon-increment-quantity.svg" alt="" ></button>
    `;
  parrent.append(controlItem);
}

const cartEmpty = document.querySelector(".cart__empty"),
  cart = document.querySelector(".cart"),
  cartWrapper = document.querySelector(".purchase__wrapper"),
  totalCounter = document.querySelector(".cart__title span"),
  cartPrice = document.querySelector(".cart__total-price");

function renderCart() {
  cartWrapper.innerHTML = "";
  totalCounter.innerHTML = "";
  totalCounter.innerHTML = `(${Object.keys(state.cart).length})`;

  const cartItems = Object.values(state.cart);

  cartItems.forEach((item, i) => {
    const cartItem = document.createElement("div");

    cartItem.classList.add("purchase__item");
    cartItem.dataset.id = Object.keys(state.cart)[i];
    cartItem.innerHTML = `
     <h4 class="purchase__name">${item.name}</h4>
            <div class="purchase__item-info">
              <div class="purchase__item-quantity">${item.count}x</div>
              <div class="purchase__item-price">$${item.price}</div>
              <div class="purchase__item-total">$${item.totalPrice}</div>
            </div>

            <button class="purchase__remove">
              <img
                src="/assets/images/icon-remove-item.svg"
                alt="remove"
                class="purchase__remove-img"
              />
            </button>
    `;
    cartWrapper.append(cartItem);
  });

  if (Object.keys(state.cart).length == 0) {
    state.totalOrderPrice = 0;
    cartEmpty.classList.remove("hide");
    cart.classList.add("hide");
  }
  cartPrice.innerHTML = `$${state.totalOrderPrice}`;
  console.log(state.totalOrderPrice);
}

function renderOrderCart() {}

productsWrapper.addEventListener("click", (e) => {
  const target = e.target;
  const addBtn = target.closest(".products__add");
  const productItem = target.closest(".products__item");
  if (!productItem) return;

  const addBtnEl = productItem.querySelector(".products__add");
  const activeImg = productItem.querySelector(".products__img");
  const controlsBtn = productItem.querySelector(".products__controls");
  const decrementBtn = target.closest(".products__btn-decrement");
  const incrementBtn = target.closest(".products__btn-increment");
  const id = productItem.dataset.id;

  if (addBtn) {
    const cartName = productItem.querySelector(".products__name").textContent;
    const cartCount = productItem.querySelector(".products__selected-quantity");

    const cartTotalPrice = +cartCount.textContent * state.products[id].price;
    addBtn.classList.add("hide");
    controlsBtn.classList.remove("hide");
    cartEmpty.classList.add("hide");
    cart.classList.remove("hide");
    activeImg.classList.add("products__selected-img");

    state.cart[id] = {
      name: cartName,
      count: +cartCount.textContent,
      price: state.products[id].price,
      totalPrice: cartTotalPrice,
    };
    state.totalOrderPrice += state.cart[id].totalPrice;

    updateProductUI(productItem, id);
    renderCart();
  }
  let count = state.cart[id]?.count || 0;

  if (decrementBtn) {
    // count--;
    if (count > 1) {
      count--;
      state.cart[id].count = count;
      state.cart[id].totalPrice = state.cart[id].price * state.cart[id].count;
      state.totalOrderPrice -= state.cart[id].price;
      renderCart();
      updateProductUI(productItem, id);
    } else {
      state.totalOrderPrice -= state.cart[id].price;
      delete state.cart[id];
      controlsBtn.classList.add("hide");
      addBtnEl.classList.remove("hide");
      activeImg.classList.remove("products__selected-img");
      renderCart();
    }
    // count = 1;
  }

  if (incrementBtn) {
    count++;
    state.cart[id].count = count;
    state.cart[id].totalPrice = state.cart[id].price * state.cart[id].count;
    state.totalOrderPrice += state.cart[id].price;
    updateProductUI(productItem, id);
    renderCart();
  }

  console.log(state.cart);
});

cartWrapper.addEventListener("click", (e) => {
  const target = e.target;
  const removeBtn = target.closest(".purchase__remove");
  if (!removeBtn) return;

  const removeTarget = removeBtn.closest(".purchase__item");
  if (!removeTarget) return;

  const id = removeTarget.dataset.id;
  if (!id) return;

  const productItem = document.querySelector(
    `.products__item[data-id="${id}"]`,
  );

  const activeImg = productItem.querySelector(".products__img");
  const addBtn = productItem.querySelector(".products__add");
  const controlBtn = productItem.querySelector(".products__controls");

  if (removeBtn) {
    activeImg.classList.remove("products__selected-img");
    delete state.cart[id];
    addBtn.classList.remove("hide");
    controlBtn.classList.add("hide");
    renderCart();
  }
});

async function init() {
  await loadData();
  createProductItems();
}

init();
