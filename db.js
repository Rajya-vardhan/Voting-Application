const mongoose=require('mongoose')
require('dotenv').config()
const mongoURL=process.env.MongoDBLocalUrl
// const mongoURL=process.env.MongoDBOnlineUrl
// console.log(mongoURL)


mongoose.connect(mongoURL,{
    'useNewUrlParser':true,
    'useUnifiedTopology':true

})

const db=mongoose.connection;

db.on('error',(err)=>{
    console.error('Error in connecting to database: ',err)
});

db.on('connected',()=>{
    console.log('connected to database')
});

db.on('disconnected',()=>{
    console.log('disconnected to database')
});


module.exports=db;