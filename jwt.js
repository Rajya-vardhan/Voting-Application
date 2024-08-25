const jwt=require('jsonwebtoken');
require('dotenv').config;

const jwtAuthMiddleware=(req,res,next)=>{
    // when no token is provided then it might not read split properly
    const authorization=req.headers.authorization
    if(!authorization){
        return res.status(401).json({message:'No token provided'})
    }
    const token=req.headers.authorization.split(' ')[1];
    // if(!token){
    //     return res.status(401).json({message:'No token provided'});
    // }

    try{
    const data=jwt.verify(token,process.env.JWT_SECRET);
    req.user=data
    next()
    }catch(err){
        console.log(err)
        return res.status(500).json({message:'Failed to authenticate token'});
    }
}

const genToken=(userData)=>{
    return jwt.sign({userData},process.env.JWT_SECRET);
}

module.exports={jwtAuthMiddleware,genToken}