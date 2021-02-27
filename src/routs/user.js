// include modules
const express = require('express');
const multer = require('multer');
const auth = require('../middlewares/auth');
const userController = require('../controlers/UserController');
// create user router
const userRouter = new express.Router;
const uplode = multer({
    limits:{ fileSize: 1000000},
    fileFilter(req,file,cb){
        const allowedExtentions = ['image/png','image/jpeg','image/jpg']
        if(!allowedExtentions.includes(file.mimetype)){
            cb(new Error(`Please Uplode image in one of this extentions ${allowedExtentions.join()}`), false);
        }
        cb(undefined, true);
    }
});
// routes
userRouter.post('/users/login', userController.login);

userRouter.post('/users/signup',uplode.single('image') , userController.signup);

userRouter.post('/users/verfiy', userController.verifyEmail);

userRouter.post('/users/logout',auth, userController.logout);

userRouter.get('/users/profile/show',auth, userController.showProfile);

userRouter.patch('/users/profile/update', auth, uplode.single('image'), userController.updateProfile);

userRouter.delete('/users', auth, userController.deleteAccount);

// export user router
module.exports = userRouter;
