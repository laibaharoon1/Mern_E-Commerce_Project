/* our first step whenever we start working on backend logic */
/* first we have to create an specify the model */
const mongoose = require('mongoose')
/* After creating a model, what r the things we need */
const UserSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        default : 'user'
    }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;