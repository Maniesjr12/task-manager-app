
const mongoose = require('mongoose');
 
const options = {useNewUrlParser: true, useUnifiedTopology: true}

mongoose.connect(process.env.DB_CONNECTION_STRING, options).then(()=>{
    console.log('connection to data base established');
}).catch((e)=>{
    console.log(e);
})
