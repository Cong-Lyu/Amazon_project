import {getProducts} from './products.js';
import {getLoginStatus} from './user.js';
import { findProductInCartTable, postProductToCart } from './cart.js';
const productsTableUrl = 'https://api.backendless.com/059E0E6C-3A70-434F-B0EE-230A6650EEAE/3AB37559-1318-4AAE-8B26-856956A63050/data/products';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function postToCartButton(methodType, productQuantity, userInfo, productObjectId, isProductAlreadyInCart) {
  //!!!!This function is for home page 'add-to-cart' buttons only!!!
  const productAmount = document.querySelector('.product-number');
  if(methodType === 0) { //POST
    const productObject = {
      'userObjectId': userInfo['userId'],
      'productObjectId': productObjectId,
      'productQuantity': Number(productQuantity),
    }
    await postProductToCart('POST', productObject, userInfo['userToken']);
    alert('This item has been put into your cart!');
    productAmount.innerText = String(Number(productAmount.innerText) + Number(productQuantity));
  }
  else{  //PUT
    //await sleep(4000);// This is to test if the number I got before in the console.log(isProductAlreadyInCart); from the cart table is the number that has not been changed.
    isProductAlreadyInCart[0]['productQuantity'] += Number(productQuantity);//the updated quantity should be the former quantity plus the new quantity the user selected here.
    await postProductToCart('PUT', isProductAlreadyInCart[0], userInfo['userToken']);
    
    alert('This item in your cart has been updated!');
    productAmount.innerText = String(Number(productAmount.innerText) + Number(productQuantity));
  }
}


async function activateAddToCartButtons() {  //userInfo here keeps the login Info including userName, userToken, userObjectId.
  const addToCartButtons = document.querySelectorAll('.Add-to-Cart');
  for(const item of addToCartButtons){
    const productObjectId = item.dataset.addToCartProductId.slice(1, 2); // get the product object Id out for later use.
    
    item.addEventListener('click', async () => {
      const productQuantity = document.querySelector(`.a${productObjectId}product-quantity-selector`).value;
      const loginStatus = await getLoginStatus(); // to check if the login info is still valid. This should only check when the button is clicked!!! This should be done before any other step below as token is required below.
      if(loginStatus[0] === true) { //token is valid.
        const userInfo = loginStatus[1];
        const isProductAlreadyInCart = await findProductInCartTable(0, userInfo['userId'], productObjectId, userInfo['userToken']);///// //try to find out if the product is already in the cart. If so, it returns a list where contains the record object.
        if(isProductAlreadyInCart.length >= 2) {
          alert('Disasterous error happens!!! Check backend now, there are two or more records match the conditions');
        }
        else if(isProductAlreadyInCart.length === 0) {
          await postToCartButton(0, productQuantity, userInfo, productObjectId, isProductAlreadyInCart);
        }
        else {
          await postToCartButton(1, productQuantity, userInfo, productObjectId, isProductAlreadyInCart);
        }
      }
      else {//user has not logged in yet or the token has expired.
        alert('Please log in first!');
      }
    })
  }
}


async function activateCartAnchor() {
  const cartAnchor = document.querySelector('.cart-anchor');
  const loginStatusCode = await getLoginStatus();
  cartAnchor.addEventListener('click', () => {
    if(loginStatusCode[0] === false) {
      alert('Please log in first.');
    }
    else {
      window.location.href = './Websites/Amazon_checkout.html';
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
        Welcome! ${loginStatusCode[1]['userName']}
      </a>`;;
    return loginStatusCode[1];
  }
  else {
    loginStatus.innerHTML = 
      `<a class="sign-in-anchor" href="./Websites/Amazon_login.html">
        Hello! Sign in here
      </a>`;
    return loginStatusCode[1];
  }
}

async function activateItemQuantity(userInfo) {
  const itemList = await findProductInCartTable(1, userInfo['userId'], undefined, userInfo['userToken']);
  const productAmount = document.querySelector('.product-number');
  let totalQuantity = 0;
  for(const item of itemList) {
    totalQuantity += item.productQuantity;
  }
  productAmount.innerText = String(totalQuantity);
}

export async function renderProductsContent() {
  const userInfo = await renderLoginStatus();//render the loginStatus and get the userInfo for further saving the items the user picks from the home page to the backend.
  // every time we are redirected to this page, it will be renderred again, which means we will get the latest login status of the current user.

  //in the future, the code below may be modified to render based on the userInfo above.
  const products = await getProducts(userInfo);
  let productsContentHTML = ``;
  const productContent = document.querySelector('.products-content');
  products.forEach((item) => {
      productsContentHTML += 
    `<div class="product-container">
      <div class="product-image-container">
        <img class="product-img" src="./Images/products-image/${item.productImageName}.jpg">
      </div>
        <p class="product-descrptions">
        ${item.productName}
      </p>
      <div class="rating-box">
        <img class="rating-img" src="./Images/rate-image/rating-${item.productRating}.jpg">
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

  if(userInfo !== undefined) {
    activateItemQuantity(userInfo);
  }
  
  activateAddToCartButtons();

  activateCartAnchor();
}

