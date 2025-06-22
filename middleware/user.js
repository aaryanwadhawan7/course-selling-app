const bcrypt = require('bcrypt');
const {userModel} = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_USER_SECRET }  = require('../config');

async function auth(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const user = await userModel.findOne({
      username: username,
    });

    if (user) {
      const isPasswordVerified = await bcrypt.compare(password, user.password);
      if (isPasswordVerified) {
        // valid password -> account verified
        req.user = user;
        next();
      } else {
        res.json({
          message: "Invalid Password!",
        });
      }
    } else {
      res.json({
        message: "Invalid username!",
      });
    }
  } catch (error) {
    res.status(401).json({
      message: "Invalid credentials!",
      error: error.message,
    });
  }
}


// this middleware will give use the username with which our token is encoded
function jwtVerify(req, res, next) {
  const token = req.headers.token; // taking token from req headers
  const tokenDecoded = jwt.verify(token, JWT_USER_SECRET); // verifying token via the JWT_SECRET
  if (!tokenDecoded) {
    res.status(401).json({
      message: "Unauthorized access!",
    });
  }

  // token decoded successfully
  try {
    req.username = tokenDecoded.username;
    next();
  } catch (error) {
    res.json({
      message: "Token invalid or expired!",
    });
  }
}

module.exports = {
    auth,
    jwtVerify
}