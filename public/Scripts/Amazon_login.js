import {findUserIndex} from './user.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.13/esm/index.js';

const loginUrl = 'https://supplekick-us.backendless.app/api/users/login';

async function loginAttempt(email, password) {
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

export function renderLoginPage() {
  const loginButton = document.querySelector('.login-button');
  loginButton.addEventListener('click', () => {
    const emailInput = document.querySelector('.email-input').value;
    const passwordInput = document.querySelector('.password-input').value;
    console.log(emailInput, passwordInput);
    loginAttempt(emailInput, passwordInput);
  })
}
