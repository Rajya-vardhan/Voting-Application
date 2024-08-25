const mongoose=require('mongoose')
const bcrypt = require('bcrypt')

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

userSchema.pre('save',async function(next){
    const person=this;
    if(!person.isModified('password')){
        
        return next();
    }
    try{
        
        const salt=await bcrypt.genSalt(10)
        const hashedpass=await bcrypt.hash(person.password,salt)
        person.password=hashedpass
        next()

    }catch(err){
        console.log(err)
        return next(err)

    }
})

userSchema.methods.comparePass=async function(pass){
    try{
        const ismatch=bcrypt.compare(pass,this.password)
        return ismatch
    }catch(err){
        throw err
    }
}


const User=mongoose.model('User',userSchema);


module.exports=User;