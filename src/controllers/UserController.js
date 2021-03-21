const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const randomString = require('random-string');
const User = require('../models/user');
const sendVerificationEmail = require('../utils/sendEmail');

module.exports =  {
    async login(req,res) {
        try {
            const user = await User.findByCredintals(req.body.username,req.body.password);
            const token = await user.createToken();
            res.send({user,token});
        } catch (e) {
            res.status(404).send({error: e.message});
        }
        
    },

    async signup(req,res) {
        try{
            const _id = new mongoose.Types.ObjectId();
            const token = jwt.sign({ _id }, process.env.SECRET_KEY);
            const activationCode = randomString({
                numeric: true,
                letters: true
            });
            let data = {
                ...req.body,
                tokens:[{token}],
                activationCode
            }
            if(req.file){
                data['image'] = [{ image: req.file.buffer,extention: req.file.mimetype}];
            }
            const user = new User(data);
            await user.save();
            sendVerificationEmail(req.body.email, req.body.username, activationCode);
            res.status(201).send({user, token}); 
        }catch(e){
            res.status(400).send({error: e.message});
        }
    },

    async verifyEmail(req,res) {
        try {
            const user = await User.findOne({ username: req.body.name, activationCode: req.body.code });
            if(!user) throw Error('The code is error');
            user.activated = true;
            await user.save();
            res.send({message: 'Activated'});
        } catch (e) {
            res.status(404).send({error: e.message});
        }
    },

    async logout(req,res) {
        try {
            req.user.tokens = req.user.tokens.filter(token => {
                return token.token != req.token; 
            });
            await req.user.save();
            res.send({message: 'logedout successfully'});
        } catch (e) {
            res.status(500).send({error: e.message});
        }
    },

    async showProfile(req,res) {
        try {
            res.send(req.user);
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    },

    async updateProfile(req,res) {
        try {
            req.user.username = req.body.username;
            req.user.email = req.body.email;
            if(Object.keys(req.body).includes('password')){
                req.user.password = req.body.password;
            }
            if(Object.keys(req).includes('file')){
                req.user.image[0].image = req.file.buffer;
                req.user.image[0].extention = req.file.mimetype;
            }
            await req.user.save();
            res.send({message: 'Profile updated'});
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    },

    async deleteAccount(req,res) {
        try {
            await req.user.remove();
            res.send({message: 'Account Deleted'});
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    }
}
