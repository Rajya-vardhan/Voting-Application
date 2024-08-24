const mongoose=require('mongoose')
// const bcrypt = require('bcrypt')

const userSchema=new mongoose.Schema(
    {
        name:{type:String,required:true},
        age:{type:Number,required:true},
        email:{type:String},
        mobile:{type:String},
        address:{type:String,required:true},
        adhaarCardNumber:{type:String,required:true,unique:true}, //aadhar must be unique
        password:{type:String,required:true},
        role:{type:String,enum:['voter','admin'],default:'voter'},
        isVoted:{type:Boolean,default:false} // when user created he must have not voted before and used to create logic of voting only once
        
    }
)


const User=mongoose.model('User',userSchema);


module.exports=User;