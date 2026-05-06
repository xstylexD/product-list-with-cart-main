"use strict"

const productsWrapper = document.querySelector('.products'),
      
      controlsBtn = productsWrapper.querySelectorAll('.products__controls'),
      products = productsWrapper.querySelectorAll('.products__item');

let state = {
    products: [],
    cart: {
        product: {
            count: 1,
            name: '',
            price: 5,
            totalPrice: 5
        }
    },
};

let cartCounter = 1;

function loadData() {
    return fetch('data.json')
        .then(response => response.json())
        .then(data => state.products = data)
        .catch(error => console.log(error));
}

function createProductItems() {
    productsWrapper.innerHTML = ``;
    state.products.forEach((product, i) => {

        const item = document.createElement('li');

        item.classList.add('products__item');
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
    })
}

function updateProductUI(parrentSelector, id) {
    const item = parrentSelector.querySelector('.products__controls');
    item.remove();
    const parrent = parrentSelector.querySelector('.products__preview');
    const controlItem = document.createElement('div');
    controlItem.classList.add('products__controls');
    controlItem.classList.add('products__controls-active');
    controlItem.innerHTML = `
    <button  class="products__btn products__btn-decrement"><img src="/assets/images/icon-decrement-quantity.svg" alt=""></button>

        <p class="products__selected-quantity">${state.cart[id].count}</p>

    <button class="products__btn products__btn-increment"><img src="/assets/images/icon-increment-quantity.svg" alt="" ></button>
    `
    parrent.append(controlItem);

}

productsWrapper.addEventListener('click', (e) => {
    const target = e.target;
    const addBtn = target.closest('.products__add');
    
    const decrementBtn = target.closest('.products__btn-decrement'),
          incrementBtn = target.closest('.products__btn-increment');
    // if(!addBtn) return;

    const productItem = addBtn.closest('.products__item');

    const controlsBtn = productItem.querySelector('.products__controls');

    addBtn.classList.add('hide');
    controlsBtn.classList.remove('hide');

    const cartName = productItem.querySelector('.products__name').textContent;
    const cartCount = productItem.querySelector('.products__selected-quantity');

    const id = productItem.dataset.id;

    const cartTotalPrice = +cartCount * state.products[id].price;
    
    state.cart[id] = {
        name: cartName,
        count: cartCount.textContent,
        price: state.products[id].price,
        totalPrice: cartTotalPrice
    }
     let count = 1;


          if(decrementBtn) {
            if(count < 1) {
                count = 1;
            } else {
                count--;
                updateProductUI(productItem, id);
            }
            console.log(decrementBtn);
          }

          if(incrementBtn) {
            count++;
            updateProductUI(productItem, id);
            console.log(incrementBtn);

          }

    console.log(state.cart);
    console.log(incrementBtn, decrementBtn);
})



async function init() {
    await loadData();
   createProductItems();
}

init();