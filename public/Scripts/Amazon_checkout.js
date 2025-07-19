import {getLoginStatus, sumCartItems, shipping, findProductInCartTable, postProductToCart} from './user.js'
import {getProducts} from './products.js';
import { deleteItemInCart } from './cart.js';
import { productsTableUrl } from '.products.js';

function activateUpdateButton() {   // here only activate the update buttons, not click them. The click event only happen in the eventlistener when the update buttons are clicked.
  const updateButton = document.querySelectorAll(".cart-product-update-button");

  for(const item of updateButton) {
    item.addEventListener('click', async () => {
      const loginStatus = await getLoginStatus();
      if(loginStatus[0] === true) {
        const productObjectId = item.dataset.updateProductId.slice(1, 37);
        const quantityContainer = document.querySelector(`.a${productObjectId}quantity-container`);
        quantityContainer.innerHTML = `    
          <p class="cart-product-quantity a${productObjectId}quantity">
            Quantity: <input class="cart-item-quantity-update a${productObjectId}quantity-number" type="number">
          </p>
          <button class="cart-product-save-button  cart-product-behave" data-save-product-id="a${productObjectId}save">
            Save
          </button>
          <button class="cart-product-delete-button  cart-product-behave" data-delete-product-id="a${productObjectId}delete">
            Delete
          </button>`;  // here, the delete buttons are generated again, which means the former ones and their eventlisteners are both deleted. 
          // item.dataset.updateProductId.slice(1, 13) means take out the product ID saved in the data- attribute and use it in generating the save button, to make it distinct from others.
        
        activateSaveButton();  // here activate the save buttons on checkout page again after clicking the update button.

        activateDeleteButton(); // here activate the delete buttons on checkout page again after clicking the save button.
      }
      else {
        alert('Your login has expired, please log in again.');
        window.location.href = '../Websites/Amazon_products.html';
      }
    })
  }
}

function activateSaveButton() { // here only activate the save buttons, not click them. The click event only happen in the eventlistener when the save buttons are clicked.
  const saveButton = document.querySelectorAll('.cart-product-save-button');
  for(const item of saveButton) {
    const productObjectId = item.dataset.saveProductId.slice(1, 37);  //the unique product identifier.
    const quantityContainer = document.querySelector(`.a${productObjectId}quantity-container`); //This gets the container which constains quantity, save button, delete button HTML.
    item.addEventListener('click', async () => { // here tells the save button what to do when it is clicked, but the code below will not be executed unless it is clicked, which means the code inside listener is set up only, ready to be clicked only.
      const loginStatus = await getLoginStatus(); //get the latest userToken status.
      const userInfo = loginStatus[1];
      if(loginStatus[0] === true) {
        const quantityNumber = document.querySelector(`.a${productObjectId}quantity-number`).value;
        if(quantityNumber === '0') {  //when quantity-number is 0,
          // ------------below is to delete this item totally from cart table in the backend.----------------
          await deleteItemInCart(userInfo, productObjectId);
          await renderCheckoutPage();
        }
        else if(quantityNumber === '') {
          alert('Please select a quantity for the item.')
        }
        else {
          const itemList = await findProductInCartTable(1, userInfo['userId'], undefined, userInfo['userToken']);//the list of the products in the cart. This returns the objects in cart table!!!, not the products table!!!!
          const targetObjectInCart = itemList.find(target => target.productObjectId === productObjectId);
          // the sentence below traces back to which one the user is modifying. 
          targetObjectInCart.productQuantity = Number(quantityNumber);//change the quantity to the one set by the user.
          await postProductToCart('PUT', targetObjectInCart, userInfo['userToken']); //update the matching item's quantity attribute in the cart table

          await renderCheckoutPage();// re-render the checkout page with the latest records from cart table.
        }
      }
      else {
        alert('Your login has expired, please log in again.');
        window.location.href = '../Websites/Amazon_products.html';
      }
    })
  }
}

function activateDeleteButton() {  // here is the function to activate the buttons for removing the item from the cart
  const deleteButton = document.querySelectorAll('.cart-product-delete-button'); 
  for(const item of deleteButton) {
    item.addEventListener('click', async () => {
      const loginStatus = await getLoginStatus(); //get the latest userToken status.
      const userInfo = loginStatus[1];
      if(loginStatus[0] === true) {
        const productObjectId = item.dataset.deleteProductId.slice(1, 37);  //the unique product identifier.
        await deleteItemInCart(userInfo, productObjectId);
        await renderCheckoutPage();
      }
      else {
        alert('Your login has expired, please log in again.');
        window.location.href = '../Websites/Amazon_products.html';
      }
    })
  }
}

async function renderOrderSummary(userInfo, itemList) { // to generate the order summary content part HTML.
  const orderSummary = document.querySelector('.cart-summary-content');
  const shippingSelection = document.querySelectorAll('input[type = "radio"]:checked');
  let shippingPrice = ``;  // This is gonna be displaced in the shipping line of the OrderSummary content to show shipping price.
  if(shippingSelection.length === 0) {
    shippingPrice = '0.00';
  }
  else {
    let shippingPriceCents = 0;
    shippingSelection.forEach((item) => {
      if(item.dataset.shippingPriceCents.slice(0, 4) === 'FREE') {
        console.log('A free shipping is selected.');
        shippingPriceCents += 0;
      }
      else {
        shippingPriceCents += Number(item.dataset.shippingPriceCents.slice(1, 5)) * 100;
      }
    })
    shippingPrice = String((shippingPriceCents / 100).toFixed(2));
  }
  const total = await sumCartItems(userInfo, itemList);  //total[0] for total quantity; total[1] for totalPrice 
  const priceNumber = Number(total[1]) + Number(shippingPrice);  //total[1] + shippingTotal
  const totalBeforeTax = String(priceNumber.toFixed(2));
  const totalTax = String((priceNumber * 0.1).toFixed(2));
  const totalPrice = String((Number(totalBeforeTax) + Number(totalTax)).toFixed(2)); // total with shipping and tax.

  orderSummary.innerHTML = `
    <p class="cart-summary-title">Order Summary</p>
    <div class="cart-summary-item">
      <p class="cart-summary-item-name">Items (${total[0]}):</p>
      <p class="cart-summary-item-price">$${total[1]}</p>
    </div>
    <div class="cart-summary-item">
      <p class="cart-summary-item-name">Shipping & handling:</p>
      <p class="cart-summary-item-price">$${shippingPrice}</p>
    </div>
    <div class="cart-summary-item">
      <p class="cart-summary-item-name">Total before tax:</p>
      <p class="cart-summary-item-price">$${totalBeforeTax}</p>
    </div>
    <div class="cart-summary-item cart-summary-last-item">
      <p class="cart-summary-item-name">Estimated tax (10%):</p>
      <p class="cart-summary-item-price">$${totalTax}</p>
    </div>
    <div class="cart-summary-item cart-summary-total-item">
      <p class="cart-summary-item-name">Order total:</p>
      <p class="cart-summary-item-price">$${totalPrice}</p>
    </div>
    <button class="cart-place-order-button">Place your order</button>`;
}

async function renderLoginStatus() {
  const loginStatusCode = await getLoginStatus();// every time we are redirected to this page, it will be renderred again, which means we will get the latest login status of the current user.
  if(loginStatusCode[0] === true) {
    const loginStatus = document.querySelector('.welcome-anchor');
    loginStatus.innerText = `Welcome! ${loginStatusCode[1]['userName']}`;
    return loginStatusCode[1];
  }
  else {
    alert('Login first!');
    window.location.href = '../Websites/Amazon_products.html';
  }
}

async function renderItemContent(userInfo, itemList) {
  const products = await getProducts(userInfo);
  let cartItemsHTML = `<p class="checkout-prompt">Review your order</p>`;
  const cartItemsContent = document.querySelector('.cart-items-content');

  for(const item of itemList) { //here access each item in the cart
    const targetProduct = products.find(target => target.objectId === item.productObjectId);
    //here uses 
    cartItemsHTML += `
    <div class="cart-item-container">
      <p class="delivery-date a${item.productObjectId}delivery-date">Delivery date: please select an option below</p>
      <div class="cart-item-info-container">
        <img class="cart-item-img" src="../Images/products-image/${targetProduct.productImageName}.jpg">
        <div class="cart-product-info">
          <p class="cart-product-description">
            ${targetProduct.productName}
          </p>
          <p class="cart-product-price">
            $${String((targetProduct.productPriceCents / 100).toFixed(2))}
          </p>
          <div class="cart-product-quantity-and-buttons a${item.productObjectId}quantity-container">
            <p class="cart-product-quantity ">
              Quantity: ${item.productQuantity}
            </p>
            <button class="cart-product-update-button  cart-product-behave" data-update-product-id="a${item.productObjectId}update">
              Update
            </button>
            <button class="cart-product-delete-button  cart-product-behave" data-delete-product-id="a${item.productObjectId}delete">
              Delete
            </button>
          </div>
        </div>
        
        <div class="cart-products-delivery-description">
          <p class="cart-delivery-prompt">Choose a delivery option</p>
          
          <div class="cart-delivery-options-container">
            <input class="cart-delivery-option-selector" name="a${item.productObjectId}" value="${shipping[2].arrivalDate}" data-shipping-price-cents="${shipping[2].shippingPrice}" type="radio">
            
            <div class="cart-deliver-arrival-date">
              <p class="cart-delivery-date">
                ${shipping[2].arrivalDate}
              </p>
              
              <p class="cart-delivery-shipping-description">
                ${shipping[2].shippingPrice}
              </p>
            </div>
          </div>

          <div class="cart-delivery-options-container">
            <input class="cart-delivery-option-selector" name="a${item.productObjectId}" value="${shipping[1].arrivalDate}" data-shipping-price-cents="${shipping[1].shippingPrice}" type="radio">
            
            <div class="cart-deliver-arrival-date">
              <p class="cart-delivery-date">
                ${shipping[1].arrivalDate}
              </p>
              
              <p class="cart-delivery-shipping-description">
                ${shipping[1].shippingPrice}
              </p>
            </div>
          </div>

          <div class="cart-delivery-options-container">
            <input class="cart-delivery-option-selector" name="a${item.productObjectId}" value="${shipping[0].arrivalDate}" data-shipping-price-cents="${shipping[0].shippingPrice}" type="radio">
            
            <div class="cart-deliver-arrival-date">
              <p class="cart-delivery-date">
                ${shipping[0].arrivalDate}
              </p>
              
              <p class="cart-delivery-shipping-description">
                ${shipping[0].shippingPrice}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>`
  }

  //console.log(cartItemsHTML);
  cartItemsContent.innerHTML = cartItemsHTML;
}

function activateOptionSelector(itemList) {
  const deliveryDateSelector = document.querySelectorAll('.cart-delivery-option-selector'); //here changes the delivery date
  for(const item of deliveryDateSelector) {
    item.addEventListener('click', async () => {
      const loginStatus = await getLoginStatus();
      if(loginStatus[0] === true) {
        const userInfo = loginStatus[1];
        const deliverydate = document.querySelector(`.${item.name}delivery-date`)
        deliverydate.innerText = `Delivery date: ${item.value}`;
        await renderOrderSummary(userInfo, itemList); //re-render the order summary content to put on the shipping selection.
      }
      else {
        alert('Please log in first!');
        window.location.href = '../Websites/Amazon_products.html';
      }
    })
  }
}

function renderQuantityTitleInHeader(itemList) {
  console.log(itemList);
  const quantityTitle = document.querySelector('.items-anchor');
  let quantityInCart = 0;
  for(const item of itemList) {
    quantityInCart += item.productQuantity;
  }
  quantityTitle.innerText = `${quantityInCart} items`;
}

export async function renderCheckoutPage() {
  
  const userInfo = await renderLoginStatus(); //render the loginStatus and get the userInfo for further searching for user's cart items saved in the backend.
  
  // every time we are redirected to this page, it will be renderred again, which means we will get the latest login status of the current user.

  //in the future, the code below will be modified to render based on the userInfo above got from the backend.
  const itemList = await findProductInCartTable(1, userInfo['userId'], undefined, userInfo['userToken']);
  renderQuantityTitleInHeader(itemList);
  
  await renderItemContent(userInfo, itemList);

  await renderOrderSummary(userInfo, itemList);

  activateOptionSelector(itemList);

  activateUpdateButton();  // here activate the update buttons on checkout page.
  activateDeleteButton();  // here activate the delete buttons on checkout page.
}

