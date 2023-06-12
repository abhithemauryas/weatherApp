const express=require("express")
const {userRouter}=require("./routers/user.route");
const {weatherRouter}=require('./routers/weather.route')
const {connection}=require("./config/db")
const app=express()
const {logger}=require("./middlewares/logger")

let loggert=(req,res,next)=>{
    logger.log("info",`A ${req.method} request is made on url : ${req.url}`)
    next()
}
app.use(express.json())
// app.use(loggert)
app.use(userRouter);
app.use(weatherRouter);






app.listen(4500,async()=>{

try {
    await connection
    console.log("connected to db");
} catch (error) {
    console.log(error);
}


console.log("listening on port 4500");

})