const express = require('express');
require('./db/mongoose')
const taskRoutes = require('../src/routes/task');
const userRouter = require('../src/routes/userRoute');
const { findById } = require('./db/model/user');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter)
app.use(taskRoutes)





app.listen(port, ()=>{
    console.log('app running on ' + port );
})
