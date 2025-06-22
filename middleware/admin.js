// email { type : String, unique : true }, password, firstName, secondName

const { adminModel } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_SECRET } = require("../config");
const { jwtVerify } = require("./user");

async function authAdmin(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const admin = await adminModel.findOne({
      email: email,
    });

    // check password
    const isPasswordVerified = bcrypt.compare(password, admin.password);
    if (admin) {
      if (isPasswordVerified) {
        req.admin = admin;
        next();
      }
    } else {
      res.json({
        message: "Admin data didn't exist!",
      });
    }
  } catch (error) {
    res.status(401).json({
      message: "Invalid credentials!",
      error: error.message,
    });
  }
}

function verifyJWTAdmin(req, res, next) {
  // user.admin = admin;

  try {
    const token = req.headers.token;
    const isTokenVerified = jwt.verify(token, JWT_ADMIN_SECRET);

    // console.log(isTokenVerified);
    // Output Object looks like this : { email: 'admin@gmail.com', iat: 1750312042 }

    if (!isTokenVerified) {
      res.status(401).json({
        message: "Unauthorized access!",
      });
    } else {
      // valid token
      req.email = isTokenVerified.email;
      next();
    }
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized access!",
      error: error.message,
    });
  }
}

module.exports = {
  authAdmin,
  verifyJWTAdmin,
};
