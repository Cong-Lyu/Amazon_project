import {products} from './products.js';
import {user, sumCartItems, shipping} from './user.js'

function activateUpdateButton() {   // here only activate the update buttons, not click them. The click event only happen in the eventlistener when the update buttons are clicked.
  const updateButton = document.querySelectorAll(".cart-product-update-button");
  updateButton.forEach((item) => {
    const quantityContainer = document.querySelector(`.${item.dataset.updateProductId.slice(0, 13)}quantity-container`);
    item.addEventListener('click', () => {
      quantityContainer.innerHTML = `    
        <p class="cart-product-quantity a${item.dataset.updateProductId.slice(1, 13)}quantity">
          Quantity: <input class="cart-item-quantity-update a${item.dataset.updateProductId.slice(1, 13)}quantity-number" type="number">
        </p>
        <button class="cart-product-save-button  cart-product-behave" data-save-product-id="a${item.dataset.updateProductId.slice(1, 13)}save">
          Save
        </button>
        <button class="cart-product-delete-button  cart-product-behave" data-delete-product-id="a${item.dataset.updateProductId.slice(1, 13)}delete">
          Delete
        </button>`;  // here, the delete buttons are generated again, which means the former ones and their eventlisteners are both deleted. 
        // item.dataset.updateProductId.slice(1, 13) means take out the product ID saved in the data- attribute and use it in generating the save button, to make it distinct from others.
      
      activateSaveButton();  // here activate the save buttons on checkout page again after clicking the update button.

      activateDeleteButton(); // here activate the delete buttons on checkout page again after clicking the save button.
    })
  })

  
}

function activateSaveButton() { // here only activate the save buttons, not click them. The click event only happen in the eventlistener when the save buttons are clicked.
  console.log(user['cart']); // this helps to compare.
  const saveButton = document.querySelectorAll('.cart-product-save-button');
  saveButton.forEach((item) => {
    const quantityContainer = document.querySelector(`.${item.dataset.saveProductId.slice(0, 13)}quantity-container`);
    item.addEventListener('click', () => { // here tells the save button what to do when it is clicked, but the code below will not be executed unless it is clicked, which means the code inside listener is set up only, ready to be clicked only.
      const quantityNumber = document.querySelector(`.${item.dataset.saveProductId.slice(0, 13)}quantity-number`);
      if(quantityNumber.value === 0) {  //when quantity-number is 0,
        const deleteTargetIndex = user['cart'].findIndex((target) => {   
          return target.productId === item.dataset.saveProductId.slice(1, 13);  //when quantity-number is 0, here use the product ID saved in the data attribute of the save buttons to find out which item in the cart should be removed, and then re-render the checkout page.
        })
        item.addEventListener('click', () => {
          if(deleteTargetIndex === -1) {
            alert('Something is wrong about indexing!');
          }
          else {
            user['cart'].splice(deleteTargetIndex, 1);
            renderCheckoutPage();
          }
        })
      }
      else if(quantityNumber.value === '') {
        alert('Please select a quantity for the item.')
      }
      else {
        quantityContainer.innerHTML = `    
          <p class="cart-product-quantity a${item.dataset.saveProductId.slice(1, 13)}quantity">
            Quantity: ${quantityNumber.value}
          </p>
          <button class="cart-product-update-button  cart-product-behave" data-update-product-id="a${item.dataset.saveProductId.slice(1, 13)}update">
            Update
          </button>
          <button class="cart-product-delete-button  cart-product-behave" data-delete-product-id="a${item.dataset.saveProductId.slice(1, 13)}delete">
            Delete
          </button>`;  // here, the delete buttons are generated again, which means the former ones and their eventlisteners are both deleted.
          // item.dataset.updateProductId.slice(1, 13) means take out the product ID saved in the data- attribute and use it in generating the save button, to make it distinct from others.
        

        const saveTargetIndex = user['cart'].findIndex((target) => {   // here update the modified quantity to the item in the cart.
          return target.productId === item.dataset.saveProductId.slice(1, 13);  // here use the product ID saved in the data attribute of the delete buttons to find out which item in the cart should be removed, and then re-render the checkout page.
        })
        if(saveTargetIndex === -1) {
          alert('Something is wrong about indexing!');
        }
        else {
          user['cart'][saveTargetIndex].productQuantity = quantityNumber.value;
          // renderCheckoutPage(); here do not need to re-render the whole checkout page because we have done it in this function.
        }

        console.log(user['cart']);  // this helps to see if the quantity of the item is modified in the cart.

        activateUpdateButton();  // here activate the save buttons on checkout page again after clicking the update button.

        activateDeleteButton(); // here activate the delete buttons on checkout page again after clicking the save button.
      }
    })
  })
}

function activateDeleteButton() {  // here is the function to activate the buttons for removing the item from the cart
  const deleteButton = document.querySelectorAll('.cart-product-delete-button');  
  deleteButton.forEach((item) => {
    const deleteTargetIndex = user['cart'].findIndex((target) => {   
      return target.productId === item.dataset.deleteProductId.slice(1, 13);  // here use the product ID saved in the data attribute of the delete buttons to find out which item in the cart should be removed, and then re-render the checkout page.
    })
    item.addEventListener('click', () => {
      if(deleteTargetIndex === -1) {
        alert('Something is wrong about indexing!');
      }
      else {
        user['cart'].splice(deleteTargetIndex, 1);
        renderCheckoutPage();
      }
    })
  })
  console.log(user['cart']);
}


function renderOrderSummary() { // to generate the order summary content part HTML.
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
  const totalBeforeTax = String((Number(sumCartItems()[1]) + Number(shippingPrice)).toFixed(2)); //total with shipping without tax
  const totalWithTax = String(((Number(sumCartItems()[1]) + Number(shippingPrice)) * 0.1).toFixed(2)); // tax
  const totalPrice = String((Number(totalBeforeTax) + Number(totalWithTax)).toFixed(2)); // total with shipping and tax.
  orderSummary.innerHTML = `
    <p class="cart-summary-title">Order Summary</p>
    <div class="cart-summary-item">
      <p class="cart-summary-item-name">Items (${sumCartItems()[0]}):</p>
      <p class="cart-summary-item-price">$${sumCartItems()[1]}</p>
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
      <p class="cart-summary-item-price">$${totalWithTax}</p>
    </div>
    <div class="cart-summary-item cart-summary-total-item">
      <p class="cart-summary-item-name">Order total:</p>
      <p class="cart-summary-item-price">$${totalPrice}</p>
    </div>
    <button class="cart-place-order-button">Place your order</button>`;
}


export function renderCheckoutPage() {
  let cartItemsHTML = `<p class="checkout-prompt">Review your order</p>`;
  const cartItemsContent = document.querySelector('.cart-items-content');
  user['cart'].forEach((item, index) => {
    const targetProduct = products.find(target => target.productId === item.productId);
    cartItemsHTML += `
    <div class="cart-item-container">
      <p class="delivery-date a${item.productId}delivery-date">Delivery date: please select an option below</p>
      <div class="cart-item-info-container">
        <img class="cart-item-img" src="../Images/products-image/${targetProduct.productImageName}.jpg">
        <div class="cart-product-info">
          <p class="cart-product-description">
            ${targetProduct.productName}
          </p>
          <p class="cart-product-price">
            $${String((targetProduct.productPriceCents / 100).toFixed(2))}
          </p>
          <div class="cart-product-quantity-and-buttons a${item.productId}quantity-container">
            <p class="cart-product-quantity ">
              Quantity: ${item.productQuantity}
            </p>
            <button class="cart-product-update-button  cart-product-behave" data-update-product-id="a${item.productId}update">
              Update
            </button>
            <button class="cart-product-delete-button  cart-product-behave" data-delete-product-id="a${item.productId}delete">
              Delete
            </button>
          </div>
        </div>
        
        <div class="cart-products-delivery-description">
          <p class="cart-delivery-prompt">Choose a delivery option</p>
          
          <div class="cart-delivery-options-container">
            <input class="cart-delivery-option-selector" name="a${item.productId}" value="${shipping[2].arrivalDate}" data-shipping-price-cents="${shipping[2].shippingPrice}" type="radio">
            
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
            <input class="cart-delivery-option-selector" name="a${item.productId}" value="${shipping[1].arrivalDate}" data-shipping-price-cents="${shipping[1].shippingPrice}" type="radio">
            
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
            <input class="cart-delivery-option-selector" name="a${item.productId}" value="${shipping[0].arrivalDate}" data-shipping-price-cents="${shipping[0].shippingPrice}" type="radio">
            
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
  })
  //console.log(cartItemsHTML);
  cartItemsContent.innerHTML = cartItemsHTML;


  renderOrderSummary();

  
  const deliveryDateSelector = document.querySelectorAll('.cart-delivery-option-selector'); //here change the delivery date
  deliveryDateSelector.forEach((item, index) => {
    item.addEventListener('click', () => {
      const deliverydate = document.querySelector(`.${item.name}delivery-date`)
      deliverydate.innerText = `Delivery date: ${item.value}`;

      renderOrderSummary();
    })
  });

  activateUpdateButton();  // here activate the update buttons on checkout page.
  activateDeleteButton();  // here activate the delete buttons on checkout page.
}