const mongoose=require("mongoose")
const weatherschema=mongoose.Schema({
    userId:{type:mongoose.Types.ObjectId,required:true},
    weatherCity:[{type:String,required:true}]
})
const WeatherModel=mongoose.model("cities",weatherschema)
module.exports={WeatherModel}