const combates = [];

module.exports = (req, res, next) => {
  req.combates = combates;
  next();
};
