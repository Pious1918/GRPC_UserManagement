const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    email :String,
    username:String ,
    password:String,
    mobile:String
})


module.exports = mongoose.model("newUser" , userSchema)