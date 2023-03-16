const jwt = require("jsonwebtoken");

const verifytoken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).send("You don't have permission");
  try {
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.username = decode.username;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).send("Forbidden");
  }
};

module.exports = verifytoken;
