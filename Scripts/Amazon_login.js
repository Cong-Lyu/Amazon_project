import {user} from './user.js';

async function loginAttempt(email, password) {
  const accountContainer = document.querySelector('.account-details-container');
  const login = await fetch(user['userLoginUrl'], {
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
    user['token'] = result['user-token'];
  })
  .catch(err => console.log(err))

  if(user['token'] === undefined) {
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
  }
  else {
    window.location.href = "./Amazon_products.html";
  }
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
