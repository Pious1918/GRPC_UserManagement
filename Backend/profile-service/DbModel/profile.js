const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    userId:String,
    email : String,
    username:String ,
    password:String,
    mobile : String
})


module.exports = mongoose.model("profile" , profileSchema)