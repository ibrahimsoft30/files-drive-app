// include modules
const express = require('express');
const multer = require('multer');
const auth = require('../middlewares/auth');
const fileController = require('../controlers/FileController');
// create files router
const fileRouter = new express.Router;
const fileUplode = multer();
// routes
fileRouter.get('/files',auth, fileController.getFiles);

fileRouter.post('/files', auth, fileUplode.array('files'), fileController.uplodeFiles, (error, req, res, next) => {
    res.status(400).send({error: error.message});
});

fileRouter.patch('/files/:id',auth,fileUplode.single('file'), fileController.updateFile, (error, req, res, next) => {
    res.status(400).send({error: error.message});
});

fileRouter.delete('/files/:id', auth, fileController.deleteFile);

fileRouter.get('/files/:id', fileController.downloadFile);
// export file router
module.exports = fileRouter;