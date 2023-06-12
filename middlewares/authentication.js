const jwt = require('jsonwebtoken');
const User=require("../models/userModel")

const { redisClient } = require('../server/redis');
const authMiddleware = async(req, res, next) => {
  try {
    const token = req.headers.authorization;
      console.log(token)
    const decodedToken = jwt.verify(token, "masai");
    
    const { userId } = decodedToken;

  
    const user = await User.findById(userId);
    if (!user) {
       res.json({ message: 'Unauthorized' });
    }
    if (!decodedToken)
    return res
      .status(403)
      .send({ msg: "authentication failed, please login again" });

  const isTokenBlacklisted = await redisClient.get(decodedToken.userId);

  if (isTokenBlacklisted){

    return res.status(403).send({ msg: "token logout , Please login again" });
  }
  
    req.body.userId = decodedToken.userId;
    req.user = user;
    next();
  } catch (error) {
   res.json({ message: 'Unauthorized',err:error.message});
  }
};

module.exports = {authMiddleware};