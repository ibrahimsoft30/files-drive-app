// load express app
const app = require('./app');
// lestien on Env Port Our 3000
const PORT = process.env.PORT;
app.listen(PORT,()=> console.log(`running on port ${PORT}`));