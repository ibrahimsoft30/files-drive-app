class Utils {
    async login (username,password){
        return await this.requests({username,password},'/users/login','POST');
    }
    
    setLocalState ({ username, token, activated }){
        localStorage.setItem('token', JSON.stringify({
            name: username,
            token,
            activated
        }));
    }
    
    getLocalState(){
        return localStorage.getItem('token');
    }
    
    clearLocalState(){
        localStorage.clear();
    }
    
    validateData(fields){
         const emptyFields = fields.filter(field => {
             return field === '';
         });
         return emptyFields.length > 0;
    }
    
    isLogedIn(){
        const user = this.getLocalState('token') != null ? JSON.parse(this.getLocalState('token')) : null;
        if( !user || !user.activated ){
            return false;
        }
        return true;
    }
    
    async signup({ username,password,email,image }){
        const formData = new FormData();
        formData.set('username', username);
        formData.set('password', password);
        formData.set('email', email);
        if(image != null){
            formData.set('image',image);
        }
        return await this.requests(formData,'/users/signup','POST', {'Content-Type': 'multipart/form-data'});
    }
    
    async verfiyEmail(code, name){
        return await this.requests({code, name},'/users/verfiy','POST');
    }
    
    async logout(token){
        return await this.requests({},'/users/logout','POST', {
            'Authorization': `Bearer ${token}`
        });
    }
    
    async showProfile(token){
        return await this.requests({},'/users/profile/show','GET',{
            'Authorization': `Bearer ${token}`
        });
    }
    
    async updateProfile({username,email,password,image, token}){
        const formData = new FormData();
        formData.set('username', username);
        formData.set('email', email);
        if(password != ''){
            formData.set('password', password);
        }
        if(image != null){
            formData.set('image', image);
        }
        return await this.requests(formData, '/users/profile/update','PATCH', {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        });
    }
    
    async removeAccount(token){
        return await this.requests({},'/users', 'DELETE', {
            'Authorization': `Bearer ${token}`
        });
    }
    
    async loadFiles({limit, sortBy: {field, order}, skip = 0}){
        const token = JSON.parse(this.getLocalState())['token'];
        return await this.requests({},`/files?limit=${limit}&sortBy=${field}&order=${order}&skip=${skip}`, 'GET', {
            'Authorization': `Bearer ${token}`
        });
    }
    
    async uplodeFiles(files){
        const formData = new FormData();
        const token = JSON.parse(this.getLocalState())['token'];
        for(let i =0; i < files.length; i++) {
            formData.append("files", files[i]);
        }
        return await this.requests(formData, '/files', 'POST',{
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        });
    }
    async updateFile(file,id){
        const token = JSON.parse(this.getLocalState())['token'];
        const formData = new FormData();
        formData.set('file', file);
        return await this.requests(formData,`/files/${id}`, 'PATCH', {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        });
    }
    async removeFile(id){
        const token = JSON.parse(this.getLocalState())['token'];
        return await this.requests({},`/files/${id}`, 'DELETE', {
            'Authorization': `Bearer ${token}`
        });
    }
    
    async requests(data, route, method, headers = {}){
        try {
            let config = { method, url: route,data};
            if(headers){
                config['headers'] = headers;
            }
            const response = await axios(config);
            return {status: response.status, ...response.data};
        } catch (e) {
            return {status: e.response.status, ...e.response.data};
        }
    } 
}
const utils = new Utils();

export default utils;