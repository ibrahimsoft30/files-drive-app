// Imports
import utils from './utils.js';
//Elements
const $logout = document.querySelector('#logout');
const $profile = document.querySelector('#profile');
const $content = document.querySelector('.content');
const $removeAccount = document.querySelector('#remove-account');
const $uplodeForm = document.querySelector('#uplode-form');
const $profileFrom = document.querySelector('#profile-form');
const $limit = $uplodeForm.querySelector('#limit');
const $sortBy = $uplodeForm.querySelector('#sortBy');
const $prev = document.querySelector('#prev');
const $next = document.querySelector('#next');
const $close = document.querySelectorAll('.close');
const $updateFileForm = document.querySelector('#update-file-form');
// templates 
const fileTemplate = document.querySelector('#file-template').innerHTML;
// Events
window.onload = () => {
    if(!utils.isLogedIn()) {
        location.replace('login.html');
    }
    loadAllFiles();
};
window.onstorage = () => {
    if(!utils.isLogedIn()) {
        location.replace('login.html');
    }
};
$logout.onclick = async (e) => {
    e.preventDefault();
    const token = JSON.parse(utils.getLocalState())['token'];
    const response = await utils.logout(token);
    if(response.status == 200){
        utils.clearLocalState();
        location.replace('login.html');
    }else{
        swal("Opps!", response.error , "error");
    }
}
$profile.onclick = async (e) => {
    e.preventDefault();
    const token = JSON.parse(utils.getLocalState())['token'];
    const response = await utils.showProfile(token);
    if(response.status == 200){
        document.querySelector('.modal.profile').style.display = 'block';
        document.querySelector('.modal.profile img').src = `data:${response.image[0].extention};base64,${response.image[0].image}`
        document.querySelector('#profile-email').value = response.email
        document.querySelector('#profile-username').value = response.username
    }else{
        swal("Opps!", response.error , "error");
    }
}
$removeAccount.onclick = async (e) => {
    e.preventDefault();
    const token = JSON.parse(utils.getLocalState())['token'];
    const response = await utils.removeAccount(token);
    if(response.status == 200){
        utils.clearLocalState();
        swal("GoodBy!", response.message , "success").then(_ => {
            location.replace('signup.html');
        });
    }   
}
$uplodeForm.onsubmit = async (e) => {
    e.preventDefault();
    const files = $uplodeForm.querySelector('#files').files;
    if(files.length > 0){
        const response = await utils.uplodeFiles(files);
        if(response.status == 201){
            swal("Good News!", response.message , "success");
            $uplodeForm.querySelector('#files').value = '';
            loadAllFiles();
        }else{
            swal("Opps!", response.message , "error");
        }
    }else{
        swal("Error!", 'Please select file', "error");
    }

}

$limit.onchange =  () =>  loadAllFiles();
$sortBy.onchange =  () =>  loadAllFiles();
$next.onclick = (e) => {
    if($next.className.indexOf('disabled') == -1){
        if($prev.dataset.page == "0"){
            $prev.classList.remove('disabled');
        }
         const nextPage = parseInt($prev.dataset.page) + parseInt($limit.value);
         $prev.dataset.page = nextPage;
         console.log($prev.dataset.page);
         loadAllFiles();
    }
}

$prev.onclick = (e) => {
    if(parseInt($prev.dataset.page) > 0) {
        $next.classList.remove('disabled');
        const prevPage = parseInt($prev.dataset.page) - parseInt($limit.value);
        if(prevPage == 0){
            $prev.classList.add('disabled');
        }
        $prev.dataset.page = prevPage;
        console.log($prev.dataset.page);
        loadAllFiles();
    }
}

$close.forEach(element => {
    element.onclick = () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        document.querySelector('#update-file-form').dataset['file'] = '';
    }
});

$updateFileForm.onsubmit = async (e) => {
    e.preventDefault();
    const file = $updateFileForm.querySelector('input').files[0];
    const id = $updateFileForm.dataset.file;
    if(file){
        const response = await utils.updateFile(file, id);
        if(response.status == 200){
            swal("Good News!", response.message , "success");
            $uplodeForm.querySelector('#files').value = '';
            loadAllFiles();
        }else{
            swal("Opps!", response.message , "error");
        }
    }else{
        swal("Opps!", 'file is required' , "error");
    }
}
$profileFrom.onsubmit  = async (e) => {
    e.preventDefault();
    const email = e.target.querySelector('#profile-email').value.trim();
    const password = e.target.querySelector('#profile-password').value.trim();
    const username = e.target.querySelector('#profile-username').value.trim();
    const image = e.target.querySelector('#profile-image').files[0] || null;
    if(utils.validateData([email,username])){
        return swal("Opps!", response.error , "error");
    }
    const token = JSON.parse(utils.getLocalState())['token'];
    const response = await utils.updateProfile({username,email,password,image,token});
    if(response.status == 200){
        $profile.click()
    }else{
        swal("Opps!", response.error , "error");
    }
}
// load user files
const loadAllFiles = async () => {
    const limit = $limit.value;
    const field = $sortBy.value.substr(1, $sortBy.value.length);
    const order = $sortBy.value.substr(0, 1);
    const skip = $prev.dataset.page;
    const response = await utils.loadFiles({limit,sortBy: {field, order}, skip});
    if(response.status == 200){
        if(response.files.length > 0){
            let conentsHtml = '';
            response.files.forEach(file => {
                const html = Mustache.render(fileTemplate,{
                    background: file.bgcolor,
                    extention: file.shortextention,
                    name: file.filename.length > 20 ? `${file.filename.substr(0, 20)}...` : file.filename,
                    id: file._id
                });

                conentsHtml+= html;
            });
            if(response.files.length < parseInt($limit.value)){
                $next.classList.add('disabled');
            }else{
                $next.classList.remove('disabled');
            }
            $content.innerHTML = `<div class="files-container">${conentsHtml}</div>`;
            $content.querySelectorAll('i.edit').forEach(element => element.addEventListener('click', fileControlsHandler));
            $content.querySelectorAll('i.delete').forEach(element => element.addEventListener('click', fileControlsHandler));
            $content.querySelectorAll('i.download').forEach(element => element.addEventListener('click', fileControlsHandler));
        }else{
            $content.innerHTML = `
            <div class="files-container" style="justify-content: center">
            <img src="img/no data.png" style="height:180px;"></div>`;
            $next.classList.add('disabled');
        }
    }else{
        swal("Opps!", response.error , "error");
    }
}    
// templates events handlers

const fileControlsHandler = async (e) => {
    if(e.target.className.indexOf('edit') != -1){
        document.querySelector('#update-file-form').dataset['file'] = e.target.dataset.id;
        document.querySelector('.modal').style.display = 'block';
    }else if(e.target.className.indexOf('delete') != -1 ){
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: [
              'No, cancel it!',
              'Yes, I am sure!'
            ],
            dangerMode: true,
          }).then( async function(isConfirm) {
            if (isConfirm) {
                const response = await utils.removeFile(e.target.dataset.id);
                if(response.status == 200){
                    swal("Good News!", response.message , "success");
                    loadAllFiles();
                }else{
                    swal("Opps!", response.error , "error");
                }
            } 
          });
    }else if(e.target.className.indexOf('download') != -1 ){
        location.href = '/files/'+e.target.dataset.id;
    }
}






