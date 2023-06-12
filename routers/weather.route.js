const {Router}=require("express");
const weatherRouter=Router();
const { redisClient } = require('../server/redis');
const {validateCity}=require('../middlewares/validateCity')
const {logger}=require("../middlewares/logger")
const axios=require("axios")
const{WeatherModel}=require("../models/weatherModel")

weatherRouter.get('/weather/:city',validateCity,async(req,res)=>{
  try {

    const { city } = req.params;
    console.log(city);
    const weatherData = await getAsync(city);
    if (weatherData) {
      console.log('Weather data found in cache');
      return res.send(JSON.parse(weatherData));
    }
    const apiKey ='daa4847145bf3931ce00ecdaeee80b6a';
    const url = `http://api.openweathermap.org/geo/1.0/zip?zip=E14,GB&appid=${apiKey}`;
    const response = await axios.get(url);
    const weather = response.data;
    await redisClient.set(city, 1800, JSON.stringify(weather));
    res.send(weather);
  } catch (error) {
   res.send(error)
  }
}) 


module.exports = { weatherRouter };
