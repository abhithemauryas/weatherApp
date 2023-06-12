const express=require("express")
const userRouter=express.Router()
const bcrypt=require('bcrypt');
const User=require("../models/userModel")
const jwt=require("jsonwebtoken")

const { redisClient } = require('../server/redis');
const {authMiddleware}=require("../middlewares/authentication")

userRouter.post("/signup",async(req,res)=>{
    const {name,email,password}=req.body
    try {
        const userexit=await User.findOne({email})
        if(userexit){
            res.send("user already exists")
        }
        const hash=bcrypt.hashSync(password,8)
        const user =new User({name,email,password:hash})
        await user.save()
        res.send({user})
    } catch (error) {
        console.log(error);
        res.send("something went wrong")
    }
})

userRouter.post("/login", async(req,res)=>{
    const {email,password}=req.body
    try {
        const user=await User.findOne({email})
        if(!user){
            res.send("invalid email")
        }
        const passmatch=await bcrypt.compareSync(password,user.password)
        if(!passmatch){
            res.send("invalid passwort")
        }
        const token=jwt.sign({userId:user._id},"masai",{
            expiresIn:180
            
        })
        const refrestoken=jwt.sign({userId:user._id},"school",{
            expiresIn:'7d'
            
        })
        res.send({token,refrestoken})
      
    } catch (error) {
        console.log(error);
        res.send("something went wrong")
    }
})
userRouter.get("/newtoken",(req,res)=>{
    const refres_token=req.headers.authorization.split(" ")[1]
    if(!refres_token){
        res.send("please log in first")
    }
    jwt.verify(refres_token,"school",(err,decoded)=>{
        if(err){
            res.send("please login again")
        }else{
            const token=jwt.sign({userId:decoded.userId},"masai",{
                expiresIn:120
                
            }) 
            res.send({token})
        }

    })
    
})
userRouter.get("/logout", authMiddleware ,async(req,res)=>{
    try{
    const token=req?.headers?.authorization;

   
    if(!token) return res.sendStatus(403);
  

    
    
    await redisClient.set(req.body.userId,token,{EX:600});

   

    res.send("logout successful")
    }
    catch(err){
       
    console.log(err)
    res.send({msg:"somethis wrong in logout",err:err.message})
    }
})


module.exports={userRouter}