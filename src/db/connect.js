// incude mongoose modual
const mongoose = require('mongoose');
// connect to db
mongoose.connect(process.env.CONNECIONURL,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex:true
});
