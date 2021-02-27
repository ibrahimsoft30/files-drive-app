// imports
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const File = require('./file');
// user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(email){
            if(!validator.isEmail(email)){
                throw Error('Unvalid Email');
            }
        }
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }],
    activated:{
        type: Boolean,
        default: false
    },
    activationCode:{
        type: String
    },
    image:[{
        image:{
            type: Buffer
        },
        extention:{
            type: String
        }
    }],
    
});

userSchema.virtual('files', {
    ref: 'File',
    localField: '_id',
    foreignField: 'owner'
});

// find user by his creadintionls
userSchema.statics.findByCredintals = async (username,password) => {
    const user = await User.findOne({username});
    if(!user) throw new Error('Your creditionls is wrong');
    const isEqule = await bcrypt.compare(password, user.password);
    if(!isEqule){
        throw new Error('Your credintionls is wrongx')
    }
    return user;
}

// restrict returned user data
userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.tokens;
    delete userObject._id;
    delete userObject.password;
    delete userObject.activationCode;
    if(userObject.image.length > 0){
        delete userObject.image[0]._id;
    }
    return userObject;
}

// create user Auth Token
userSchema.methods.createToken = async function(){
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
    user.tokens.push({token});
    await user.save();
    return token;
}
// encrypt password before save
userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

// remove all files for removed user

userSchema.pre('remove', async function(next) {
    const user = this;
    await File.deleteMany({owner: user._id});
    next();
});

// user model
const User = mongoose.model('User',userSchema);

module.exports = User;