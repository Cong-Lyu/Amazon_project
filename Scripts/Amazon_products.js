import {getProducts} from './products.js';
import {getLoginStatus, user} from './user.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.13/esm/index.js';

const productsTableUrl = 'https://api.backendless.com/059E0E6C-3A70-434F-B0EE-230A6650EEAE/3AB37559-1318-4AAE-8B26-856956A63050/data/products';

function activateAddToCartButtons() {
  const productAmount = document.querySelector('.product-number');
  const addToCartButtons = document.querySelectorAll('.Add-to-Cart');

  addToCartButtons.forEach((item) => {
    const productQuantitySelector = document.querySelector(`.${item.dataset.addToCartProductId.slice(0, 13)}product-quantity-selector`);
    const productIndexInProducts = user['cart'].findIndex((target) => {
      return target.objectId === item.dataset.addToCartProductId.slice(1, 13);
    }) 
    item.addEventListener('click', () => {
      if(productIndexInProducts === -1) {
        user['cart'].push({
          productId: item.dataset.addToCartProductId.slice(1, 13),
          productQuantity: Number(productQuantitySelector.value),
          productDropDate: dayjs().format('ddd, DD MMM YYYY')
        })
        productAmount.innerText = String(Number(productAmount.innerText) + Number(productQuantitySelector.value));
      }
      else {
        user['cart'][productIndexInProducts].productQuantity += Number(productQuantitySelector.value);
        productAmount.innerText = String(Number(productAmount.innerText) + Number(productQuantitySelector.value));
      }
    })
  })
}


function activateCartAnchor(userInfo) {
  const cartAnchor = document.querySelector('.cart-anchor');
  cartAnchor.addEventListener('click', () => {
    if(userInfo[0] === false) {
      alert('Please log in first.');
    }
    else {
      window.location.href = './Amazon_checkout.html';
    }
  })
}


async function renderLoginStatus() {
  const loginStatus = document.querySelector('.login-status-container');
  //const loginJudgment = document.querySelector('.sign-in-anchor');
  const loginStatusCode = await getLoginStatus(); // every time we are redirected to this page, it will be renderred again, which means we will get the latest login status of the current user.
  if(loginStatusCode[0] === true) {
    loginStatus.innerHTML =
      `<a class="sign-in-anchor" href="https://google.com">
        Welcome! ${loginStatusCode[1]}
      </a>`;;
    return loginStatusCode;
  }
  else {
    console.log('The token expired! -- from Amazon_products.js');
    loginStatus.innerHTML = 
      `<a class="sign-in-anchor" href="./Amazon_login.html">
        Hello! Sign in here
      </a>`;
    return loginStatusCode;
  }
}


export async function renderProductsContent() {
  const userInfo = await renderLoginStatus();//render the loginStatus and get the userInfo for further saving the items the user picks from the home page to the backend.
  // every time we are redirected to this page, it will be renderred again, which means we will get the latest login status of the current user.

  //in the future, the code below will be modified to render based on the userInfo above.
  const products = await getProducts(productsTableUrl);
  console.log(products);
  let productsContentHTML = ``;
  const productContent = document.querySelector('.products-content');
  products.forEach((item) => {
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
      <select class="number-selector a${item.objectId}product-quantity-selector">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
      </select>
      <p class="add-to-cart-prompt">

      </p>
      <button class="Add-to-Cart" data-add-to-cart-product-id="a${item.objectId}add-to-button">
        Add to Cart
      </button>
    </div>`;
  })

  productContent.innerHTML = productsContentHTML;

  activateAddToCartButtons();

  activateCartAnchor(userInfo);
}

