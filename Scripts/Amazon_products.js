const products = [{
  productId : 'sa21dk12ks1o',
  productName : 'Black and Gray Athletic',
  productRating : 45,
  productScore : 87,
  productPriceCents : 1090,
  productImageName : 'athletic-cotton-socks-6-pairs'
},{
  productId : 'sa21sa12ssao',
  productName : 'Intermediate Size Basketball',
  productRating : 40,
  productScore : 127,
  productPriceCents : 2095,
  productImageName : 'intermediate-composite-basketball'
},{
  productId : 'sa2ewwqao',
  productName : 'Adults Plain Cotton T-Shirt - 2 Pack',
  productRating : 45,
  productScore : 56,
  productPriceCents : 799,
  productImageName : 'adults-plain-cotton-tshirt-2-pack-teal'
},{
  productId : 'sadkiuao',
  productName : '2 Slot Toaster - Black',
  productRating : 50,
  productScore : 2197,
  productPriceCents : 1899,
  productImageName : 'black-2-slot-toaster'
},{
  productId : 'sad447475o',
  productName : '6 Piece White Dinner Plate Set',
  productRating : 40,
  productScore : 37,
  productPriceCents : 2067,
  productImageName : '6-piece-white-dinner-plate-set'
},{
  productId : 'sadqw2rerao',
  productName : '6-Piece Nonstick, Carbon Steel Oven',
  productRating : 45,
  productScore : 175,
  productPriceCents : 3499,
  productImageName : '6-piece-non-stick-baking-set'
}];

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