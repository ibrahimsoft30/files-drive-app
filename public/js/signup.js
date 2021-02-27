// imports
import utils from './utils.js';
// Elements
const $signupForm = document.querySelector('#signup-form');
// Eventes
$signupForm.onsubmit = async (e) => {
    e.preventDefault();
    const email     = $signupForm.querySelector('#signup-email').value.trim();
    const username  = $signupForm.querySelector('#signup-username').value.trim();
    const password  = $signupForm.querySelector('#signup-password').value.trim();
    const image  = $signupForm.querySelector('#signup-image').files[0] || null;
    const $signupAlert = $signupForm.querySelector('#signup-alert');
    if(utils.validateData([email,username,password])){
        $signupAlert.textContent = 'Please Fill Required Fields';
        return $signupAlert.style.display = 'block';
    }
    const response = await utils.signup({email,username,password,image});
    if(response.status == 201){
        utils.setLocalState({
            username: response.user.username,
            token: response.token,
            activated: response.user.activated
        });
        location.replace('/activate.html');
    }else{
        $signupAlert.textContent = response.error;
        $signupAlert.style.display = 'block';
    }
};