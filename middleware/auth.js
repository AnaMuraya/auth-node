const jwt = require("jsonwebtoken");

const config = process.env;

const verifyUserToken = async (req, res, next) => {
  //get token
  const token = req.header("x-access-token") || req.body.token || req.query.token;
  //check if token exists
  !token && res.status(403).send("Access denied. No token provided.");

  try {
    //verify token
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    //set user to req.user
    req.user = decoded;
  } catch (err) {
    res.status(401).send("Invalid token.");
  }
  //move to next middleware
  next();
};

module.exports = verifyUserToken;
