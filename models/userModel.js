const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const userschema=mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      }
    });
    
  
    
    const User = mongoose.model('Users', userschema);
    
    module.exports = User;