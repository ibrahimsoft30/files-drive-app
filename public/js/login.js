// Imports
import utils from './utils.js';
// Elements
const $loginForm = document.querySelector('#login-form');
const $loginAlert = document.querySelector('#login-alert');
// Events
$loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const username = $loginForm.querySelector('#username').value.trim();
    const password = $loginForm.querySelector('#password').value.trim();
    
    if(utils.validateData([username,password])){
        $loginAlert.textContent = 'Please Fill Required Fields';
        $loginAlert.style.display = 'block';
    }
    
    const response = await utils.login(username,password);
    if(response.status == 200){
        utils.setLocalState({
            username: response.user.username,
            token: response.token,
            activated: response.user.activated
        });
        $loginAlert.style.display = 'none';
        location.replace('/index.html');
    }else{
        $loginAlert.textContent = response.error;
        $loginAlert.style.display = 'block';
    }
};