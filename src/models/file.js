const mongoose = require('mongoose');
const filesSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
        trim: true
    },
    extention: {
        type: String,
        required: true,
        trim: true
    },
    shortextention:{
        type: String,
        required: true,
        trim: true
    },
    content:{
        type: Buffer
    },
    bgcolor:{
        type: String,
    },
    owner:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    }, 
},{
    timestamps: true
});

filesSchema.methods.toJSON = function(){
    const file = this;
    const fileObject = file.toObject();
    delete fileObject.owner;
    return fileObject;
}

filesSchema.index({createdAt: 1, updatedAt: 1});
const File = mongoose.model('File', filesSchema);

module.exports = File;