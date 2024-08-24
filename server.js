const express=require('express');
const app=express();
const bodyParser=require('body-parser')  //body -parser is a middle ware used for parsing the data in the body t0 obj that we send and stores it in req.body
app.use(bodyParser.json())
require('dotenv').config()


// logging middle-ware 
const logReq=(req,res,next)=>{
    console.log('[ ', new Date().toLocaleString(),' ] ' , ' req node to:', ' [ ', req.originalUrl,' ] ')
    next()
}







const PORT=process.env.PORT || 3000;
app.listen(3000,()=>console.log('server is live ! '))
