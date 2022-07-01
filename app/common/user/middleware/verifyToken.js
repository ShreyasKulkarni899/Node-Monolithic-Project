const UserSchema = require("../models/userShema.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function verifyToken(req, res, next) {
  const bearerHeader = req.header("authorization");

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    req.token = bearer[1];
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, (err, authData) => {
      err ? res.json({ result: err }) : next();
    });
  }
}

module.exports = verifyToken;
