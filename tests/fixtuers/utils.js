const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const File = require('../../src/models/file');
const _id = new mongoose.Types.ObjectId();
let user = {
   "_id": _id,
   "username": 'ibrahim salim',
   "password": 'ibrahim21316500',
   "email": 'salim@gmail.com',
   "activationCode": "Eu0mgeTu",
   "tokens":[{
      "token": jwt.sign({_id},process.env.SECRET_KEY)
  }]
};
const _id2 = new mongoose.Types.ObjectId();

const user2 = {
   "_id": _id2,
   "username": 'ibrahim khalid',
   "password": 'ibrahim21316500',
   "email": 'khalid@gmail.com',
   "activationCode": "Eu0mgeTu"
};

const wrongUser = {
   'username': 'ibrahim ahmed',
   'password': 'iasdfasdf'
};

const clearData = async () => {
   await User.deleteMany();
   await File.deleteMany();
   await new User(user).save();
}
module.exports = {
   clearData,
   user,
   wrongUser,
   user2
}