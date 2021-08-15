const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const Task = require('../model/task')

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    age:{
        type: Number,
        default: 0,
        validate(value){
            if( value < 0){
                throw new Error('age can not be less than 0')
            }
        }

    },
    email:{
        type : String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('invalid Email ')
            }
        }
    },
    password:{

        type: String,
        trim: true,
        required: true,
        minLength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password cannot contain the word password')
            }
        }

    },

    tokens: [{
        token: {
            type: String,
            require: true
        }   
    }],
    avatar:{
        type: Buffer
    }
}, {timestamps: true })

// creating a virtual task field 
UserSchema.virtual('tasks', {
    ref:'Task',
    localField: '_id',
    foreignField: 'owner'
})

// generating auth token
UserSchema.methods.generateAuthTokens = async function(){
    const user = this ;
    const token = jwt.sign({_id: user._id.toString() }, process.env.AUTH_TOKEN)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token;
}

// hiding user tokens and password
UserSchema.methods.toJSON = function (){
    const user = this;
    const publicProfile = user.toObject();
    
    delete publicProfile.tokens;
    delete publicProfile.password;
    
    return publicProfile;
}
// find user details for log in 
UserSchema.statics.findByCredentials = async (email, password)=>{
    const user = await User.findOne({email});
    if(!user){
        throw new Error('Unable to log in')
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch){
        throw new Error('Unable to log in ')
    }
    return user 
}

// hashing user passowrd
UserSchema.pre('save', async function (next){
    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }

    next()
})
// deleting all user task
UserSchema. pre('remove', async function (next){
    const user = this;
    await Task.deleteMany({owner: user._id })
    next()
})


const User = mongoose.model('User', UserSchema);
module.exports = User;