import {products} from './products.js'

let productsContentHTML = ``;
const productContent = document.querySelector('.products-content');
products.forEach((item, index) => {
    productsContentHTML += 
  `<div class="product-container">
    <div class="product-image-container">
      <img class="product-img" src="../Images/products-image/${item.productImageName}.jpg">
    </div>
      <p class="product-descrptions">
      ${item.productName}
    </p>
    <div class="rating-box">
      <img class="rating-img" src="../Images/rate-image/rating-${item.productRating}.jpg">
      <p class="scores">
        ${item.productScore}
      </p>
    </div>
    <p class="price">
      $${String((item.productPriceCents / 100).toFixed(2))}
    </p>
    <select class="number-selector">
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
      <option>6</option>
      <option>7</option>
      <option>8</option>
      <option>9</option>
    </select>
    <p class="add-to-cart-prompt">

    </p>
    <button class="Add-to-Cart" data-product-id="${item.productId}">
      Add to Cart
    </button>
  </div>`;
})

productContent.innerHTML = productsContentHTML;
const productAmount = document.querySelector('.product-number');
const addToCartButtons = document.querySelectorAll('.Add-to-Cart');

addToCartButtons.forEach((item) => {
  item.addEventListener('click', () => {
    productAmount.innerText = String(Number(productAmount.innerText) + 1);
  })
})