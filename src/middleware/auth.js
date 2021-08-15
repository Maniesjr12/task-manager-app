const jwt = require('jsonwebtoken');
const User = require('../db/model/user');

const auth = async (req, res, next)=>{
    try{
         const token = req.header('Authorization').replace('Bearer ', '');
         const validToken = jwt.verify(token, process.env.AUTH_TOKEN)
         const user = await User.findOne({_id: validToken._id, 'tokens.token': token })
         if(!user){
             throw new Error()
         }
         req.token = token;
         req.user = user ;
         next()

    }catch(e){
        res.status(401).send('please authenticate')
    }
    
}

module.exports = auth;