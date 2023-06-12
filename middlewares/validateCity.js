const validateCity = (req, res, next) => {
    const { city } = req.params;
    const regex = /^[A-Za-z ]+$/;
    if (!regex.test(city)) {
      return res.status(400).json({ error: 'Invalid city name' });
    }
    next();
  };
  
  module.exports = { validateCity };
  