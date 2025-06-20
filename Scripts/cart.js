import {products} from './products.js'
import dayjs from 'https://unpkg.com/dayjs@1.11.13/esm/index.js';

export const shipping = [{
  arrivalDate: dayjs().add(7, 'day').format('ddd, DD MMM YYYY'),
  shippingPrice: 'FREE Shipping'
  }, {
    arrivalDate: dayjs().add(4, 'day').format('ddd, DD MMM YYYY'),
    shippingPrice: '$4.99 - Shipping'
  },{
    arrivalDate: dayjs().add(1, 'day').format('ddd, DD MMM YYYY'),
    shippingPrice: '$9.99 - Shipping'
  }];

export let cart = [{
  productId: 'sa21dk12ks1o',
  productQuantity: 6,
  productDropDate: '2025-06-05'
},{
  productId: 'sa21sa12ssao',
  productQuantity: 2,
  productDropDate: '2025-06-15'
}];

export function sumCartItems() {
  let sumQuantity = 0;
  let sumPriceCents = 0;
  cart.forEach((item) => {
    sumQuantity += item.productQuantity;
    const productIndexInProducts = products.findIndex((target) => {
      return target.productId === item.productId;
    })
    if(productIndexInProducts === -1) {
      alert("There something wrong in the cart items'productId!")
    }
    else {
      sumPriceCents += products[productIndexInProducts].productPriceCents * item.productQuantity;
    }
  })
  const sumPrice = String((sumPriceCents / 100).toFixed(2));
  return [sumQuantity, sumPrice];
}

