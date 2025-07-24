import {findUserIndex, loginAttempt} from './user.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.13/esm/index.js';

const loginUrl = 'https://supplekick-us.backendless.app/api/users/login';

export function renderLoginPage() {
  const loginButton = document.querySelector('.login-button');
  loginButton.addEventListener('click', () => {
    const emailInput = document.querySelector('.email-input').value;
    const passwordInput = document.querySelector('.password-input').value;
    console.log(emailInput, passwordInput);
    loginAttempt(emailInput, passwordInput);
  })
}
