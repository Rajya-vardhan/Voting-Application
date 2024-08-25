const mongoose=require('mongoose')
// const bcrypt = require('bcrypt')
//when you have default you dont need req field
const candidateSchema=new mongoose.Schema(
    {
        name:{type:String,required:true},
        party:{type:String,required:true},
        age:{type:Number,required:true},
        // votes is an array of objects 
        votes:[
            {
                user:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'User',
                    required:true
                },
                votedAt:{
                    type:Date,
                    default:Date.now()
                }
            }
        ],
        voteCount:{type:Number,default:0} //when a candidate is added his vote count must be 0
        
        
    }
)


const Candidate=mongoose.model('Candidate',candidateSchema);


module.exports=Candidate;