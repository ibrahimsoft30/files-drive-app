const uniqolor = require('uniqolor');
const File = require('../models/file');

module.exports = {
    async getFiles (req,res) {
        try {
            let sort = {};
            if(req.query.sortBy){
                if(req.query.order){
                    sort = {[req.query.sortBy]: req.query.order === '-' ? -1 : 1}
                }else{
                    sort = {[req.query.sortBy] : 1};
                }
            }
            await req.user.populate({
                path: 'files',
                options:{
                    limit: req.query.limit || 8,
                    sort,
                    skip: parseInt(req.query.skip) || 0
                }
            }).execPopulate();
            res.send({files: req.user.files});
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    },
    async uplodeFiles(req,res) {
        try {
            if(req.files.length > 0){
                req.files.forEach(async fileItem => {
                    const {color} = uniqolor.random();
                    let shortExtention = fileItem.originalname.split('.');
                    shortExtention = shortExtention[shortExtention.length - 1];
                    const file = new File({
                        filename: fileItem.originalname,
                        extention: fileItem.mimetype,
                        shortextention: shortExtention,
                        owner: req.user._id,
                        content: fileItem.buffer,
                        bgcolor: color
                    });
                    await file.save();
                });
                if(req.files.length > 1){
                   return res.status(201).send({message: 'Files uploded successfully'})   
                }
                res.status(201).send({message: 'File uploded successfully'})
            }else{
                res.status(400).send({message: 'There is no files uploded'});
            }
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    },

    async updateFile(req,res) {
        try {
            if(!req.params.id){
                throw Error('File id not sent');
            }
            const file = await File.findOne({ _id: req.params.id });
            if(!file){
                res.status(404).send({error: 'File not found'});
            }
            const {color} = uniqolor.random();
            let shortExtention = req.file.originalname.split('.');
            shortExtention = shortExtention[shortExtention.length - 1];
            await file.updateOne({
                filename: req.file.originalname,
                extention: req.file.mimetype,
                shortextention: shortExtention,
                content: req.file.buffer,
                bgcolor: color
            });
            res.send({message: 'File updated'});
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    },

    async deleteFile(req,res) {
        try {
            if(!req.params.id){
                throw Error('File id not sent')
            }
            await File.findOneAndDelete({_id: req.params.id});
            res.send({message: 'File deleted'});
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    },

    async downloadFile(req,res){
        try {
            if(!req.params.id){
                throw Error('File id not sent');
            }
            const file = await File.findOne({_id: req.params.id});
            if(!file){
                res.status(404).send({error: 'File Not Found'});
            }
            res.set('Content-Type', file.extention);
            res.status(200).send(file.content);
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    }
}
