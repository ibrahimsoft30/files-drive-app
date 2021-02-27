// include modules
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const userRouter  = require('./routs/user');
const fileRouter  = require('./routs/file');
const { config } = require('../project-config/config');
require('./db/connect');
// express app
const app = express();
// paths
const staticDir = path.join(__dirname,'../public');
// middelwares
app.use(express.json());
app.use(express.static(staticDir));
if(config.dev){
    app.use(morgan('short'));
}


//routes
app.use(userRouter);
app.use(fileRouter);

module.exports = app;