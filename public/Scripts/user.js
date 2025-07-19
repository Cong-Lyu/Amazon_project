import dayjs from 'https://unpkg.com/dayjs@1.11.13/esm/index.js';
const userTokenVarifyUrl = 'https://supplekick-us.backendless.app/api/users/isvalidusertoken';
export const userLoginUrl = 'https://supplekick-us.backendless.app/api/users/login';

const accnountSample = {
  'amazonCurrentUser': {
    'userName': '',
    'userToken': '',
    'lastLoginTimeStamp': '',
    'userId': '' //user's unique objectId.
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

let cartSample = [{
  productId: 'sa21dk12ks1o',
  productQuantity: 6,
  productDropDate: '2025-06-05'
},{
  productId: 'sa21sa12ssao',
  productQuantity: 2,
  productDropDate: '2025-06-15'
}];

export async function loginAttempt(email, password) {
  const accountContainer = document.querySelector('.account-details-container');
  const login = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      'login': email,
      'password': password
    })
  })
  .then(response => {
    if(!response.ok){
      throw 'wrong';
    }
    else {
      return response.json();
    }
  })
  .then(result => {
    //below to update the currentUserInfo in the localStorage when the login move succeeds.
    const currentUser = {
      'userName': email,
      'userToken': result['user-token'],
      'lastLoginTimeStamp': String(dayjs().valueOf()),
      'userId': result['objectId'] // user unique identifier
    }
    localStorage.setItem('amazonCurrentUser', JSON.stringify(currentUser));
    
    //below is to check if this account is saved in local history.
    const tryfindUserInLocal = findUserIndex(email);
    const userLoginHistory = JSON.parse(localStorage.getItem('amazonUsersHistory')); //get the account history list
    if(tryfindUserInLocal === -1) {
      userLoginHistory.push(currentUser);
      localStorage.setItem('amazonUsersHistory', JSON.stringify(userLoginHistory));
    }
    
    //below is to go back to the Amazon products home page.
    window.location.href = "../index.html";
  })
  .catch(err => {
    accountContainer.innerHTML = `
      <input class="email-password-wrong-style email-re-input" type="text" placeholder="E-mail">
      <input class="email-password-wrong-style password-re-input" type="text" placeholder="Password">
      <div class="warning-container">
        <img class="warning-logo" src="../Images/icon-image/amazon-warning-icon.JPG">
        <p class="warning-text">Invalid email or password!</p>
      </div>
      <button class="login-button re-login-button">
        Log in
      </button>`;
    const loginButton = document.querySelector('.re-login-button');
    loginButton.addEventListener('click', () => {
      const emailReInput = document.querySelector('.email-re-input').value;
      const passwordReInput = document.querySelector('.password-re-input').value;
      loginAttempt(emailReInput, passwordReInput);
    })
  })
}
