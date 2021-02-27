// imports
import utils from './utils.js';
// Elements
const $verificationForm = document.querySelector('#verification-form');
const $activationAlert  = document.querySelector('#activation-alert');
// Eventes
$verificationForm.onsubmit = async (e) => {
    e.preventDefault();
    const code = $verificationForm.querySelector('input').value.trim();
    const {name} = JSON.parse(utils.getLocalState());
    const response = await utils.verfiyEmail(code , name);
    if(response.status == 200){
        location.replace('/login.html');
    }else{
        $activationAlert.textContent = response.error;
        $activationAlert.style.display = 'block';
    }
};