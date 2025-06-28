import {products} from './products.js'
import dayjs from 'https://unpkg.com/dayjs@1.11.13/esm/index.js';
const userTokenVarifyUrl = 'https://supplekick-us.backendless.app/api/users/isvalidusertoken';
const accnountSample = {
  'amazonCurrentUser': {
    'userName': '',
    'userToken': '',
    'lastLoginTimeStamp': ''
  },
  'amazonUsersHistory': [
    {
    'userName': '',
    'userToken': '',
    'lastLoginTimeStamp': ''
    },
    {
    'userName': '',
    'userToken': '',
    'lastLoginTimeStamp': ''
    }
  ]
}

export function findUserIndex(userName) {
  const userLoginHistory = JSON.parse(localStorage.getItem('amazonUsersHistory'));
  const index = 0;
  for(const user of userLoginHistory) {
    if(user.userName === userName) {
      return index;
    }
    else {
      index ++;
    }
  }
  return -1;
}

export let user = {
  'userName': '',
  'userLoginUrl': 'https://supplekick-us.backendless.app/api/users/login',
  'cart': [{
    productId: 'sa21dk12ks1o',
    productQuantity: 6,
    productDropDate: '2025-06-05'
  },{
    productId: 'sa21sa12ssao',
    productQuantity: 2,
    productDropDate: '2025-06-15'
  }],
  'token': undefined
}


export async function getLoginStatus() {
  if(localStorage.getItem('amazonCurrentUser') === null) {
    localStorage.setItem('amazonCurrentUser', JSON.stringify({}));
  }
  if(localStorage.getItem('amazonUsersHistory') === null){
    localStorage.setItem('amazonUsersHistory', JSON.stringify([]));
  }
  const currentUserInfo = JSON.parse(localStorage.getItem('amazonCurrentUser')); //search for token from users' local storage.
  if(Object.keys(currentUserInfo).length === 0) { //first time to use Amazon or never log in before.
    console.log('There is nothing in the Amazon current User attribute.');
    return [false, undefined];
  }
  else{
    const varification = await fetch(`${userTokenVarifyUrl}/${currentUserInfo.userToken}`, {
      method: 'GET',
    })
    const varificationCode = await varification.json();
    //console.log(varificationCode); to check the response type.
    if(varificationCode === true){
      return [true, currentUserInfo.userName];
    }
    else {   //the token has expired.
      return [false, undefined];
    }
  }
}


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


