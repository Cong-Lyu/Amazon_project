import {products} from './products.js'
import dayjs from 'https://unpkg.com/dayjs@1.11.13/esm/index.js';
const userTokenVarifyUrl = 'https://supplekick-us.backendless.app/api/users/isvalidusertoken';

let cartUrl = 'https://api.backendless.com/059E0E6C-3A70-434F-B0EE-230A6650EEAE/3AB37559-1318-4AAE-8B26-856956A63050/data/cart'; //we should put the Id of that specific record which match the conditions we set before in the findProductInCartTable() at the end of this URL if we wanna update.

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

export async function findProductInCartTable(userId, productId, userToken) {
  const condition = encodeURIComponent(`userObjectId = '${userId}' AND productObjectId = '${productId}'`);
  const response = await fetch(`${cartUrl}?where=${condition}`, {
    method: 'GET',
    headers: {
      'user-token': userToken
    }
  });
  const result = await response.json(); //if there is no matching, it returns an empty list [].
  return result;
}

export async function postProductToCart(fetchMethod, productObject, userToken) {
  let updateUrl;
  if(fetchMethod === 'POST') {
    updateUrl = cartUrl;
  }
  else if(fetchMethod === 'PUT') {
    updateUrl = `${cartUrl}/${productObject.objectId}`;
  }
  else {
    return 'Something wrong with the input fetch method!!!';
  }
  const response = await fetch(updateUrl, {
    method: fetchMethod,
    headers: {
      'user-token': userToken
    },
    body: JSON.stringify(productObject)
  });
  const result = await response.json(); //if there is no matching, it returns an empty list [].
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

export async function loginWithoutLocal(loginUrl, email, password) {
  const response = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      'login': email,
      'password': password
    })
  })
  const result = response.json();
  return result;
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
      return [true, currentUserInfo];
    }
    else {   //the token has expired.
      console.log('The token expired! -- from user.js');
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


