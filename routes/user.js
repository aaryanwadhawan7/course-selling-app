const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { jwtVerify , auth } = require('../middleware/user');
const {JWT_USER_SECRET} = require('../config');

const userRouter = express.Router();
const { userModel, purchaseModel, courseModel } = require("../db");

userRouter.post("/signup", async (req, res) => {
  try {
    const reqdBody = zod.object({
      username: zod.string().min(5).max(30),
      email: zod.string().toLowerCase().min(10).max(40).email(),
      password: zod.string().min(5).max(40),
      firstName: zod.string().min(3).max(25),
      lastName: zod.string().min(3).max(25),
    });

    // Input validation
    const userParseData = reqdBody.safeParse(req.body);
    if (!userParseData.success) {
      return res.status(422).json({
        message: "Invalid Signup data!",
        error: userParseData.error.errors,
      });
    }

    const username = userParseData.data.username;
    const email = userParseData.data.email;
    const password = userParseData.data.password;
    const firstName = userParseData.data.firstName;
    const lastName = userParseData.data.lastName;

    const hashedPassword = await bcrypt.hash(password, 10);

    // This is a asynchronous task which will create a document.
    await userModel.create({
      username: username,
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });

    res.json({
      message: "Signup succesfully!",
    });
  } catch (error) {
    res.status(422).json({
      message: "Signup failed! Try again.",
      error: error.message,
    });
  }
});


userRouter.post("/login", auth, (req, res) => {
  try {
    const token = jwt.sign(
      {
        username: req.user.username,
      },
      JWT_USER_SECRET
    );
    res.json({
      token: token,
      message: "Login successfully!",
    });
  } catch (error) {
    res.status(401).json({
      message: "Login failed! Try again with valid credentials.",
      error: error.message,
    });
  }
});


userRouter.post("/purchases", jwtVerify, async (req, res) => {
  try {
    const user = userModel.findOne({
      username: req.username,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // this will find all the purchases with a specific userId
    const purchases = purchaseModel.find({
      userId: user._id,
    });

    const courseIds = purchases.map(p => p.courseId);
    const courses = await courseModel.find({
      _id: { $in: courseIds },
    });

    res.json({
      message: "Users purchase retrieved successfully!",
      purchases: courses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch purchases!",
      error: error.message,
    });
  }
});


module.exports = userRouter;
