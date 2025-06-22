const express = require("express");
const zod = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminRouter = express.Router();
const { adminModel, courseModel } = require("../db");
const { authAdmin, verifyJWTAdmin } = require("../middleware/admin");
const { JWT_ADMIN_SECRET } = require("../config");

adminRouter.post("/signup", async (req, res) => {
  const reqdBody = zod.object({
    email: zod.string().toLowerCase().min(5).max(40).email(),
    password: zod.string().min(5).max(40),
    firstName: zod.string().min(3).max(25),
    lastName: zod.string().min(3).max(25),
  });

  try {
    const adminParsedData = reqdBody.safeParse(req.body);

    const email = adminParsedData.data.email;
    const password = adminParsedData.data.password; // not hashed password
    const firstName = adminParsedData.data.firstName;
    const lastName = adminParsedData.data.lastName;

    const hashedPassword = await bcrypt.hash(password, 10);

    await adminModel.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });

    res.json({
      message: "Signup successfully!",
    });
  } catch (error) {
    res.status(422).json({
      message: "Signup failed! Try again.",
      error: error.message,
    });
  }
});

adminRouter.post("/login", authAdmin, (req, res) => {
  try {
    const token = jwt.sign(
      {
        email: req.admin.email,
      },
      JWT_ADMIN_SECRET
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

adminRouter.post("/course", verifyJWTAdmin, async (req, res) => {
  // req.email = req.isTokenVerified.email
  // this will give us the payload which is being use to sign jwt

  const admin = await adminModel.findOne({ email: req.email });

  if (!admin) {
    res.status(422).json({
      message: "Unauthorized access!",
    });
  }

  try {
    const creatorId = admin._id;
    const { title, description, price, imageUrl } = req.body;

    await courseModel.create({
      title: title,
      description: description,
      price: price,
      imageUrl: imageUrl,
      creatorId: creatorId,
    });

    res.json({
      message: "Course data added successfully",
    });
  } catch (error) {
    res.status(422).json({
      message: "Can't add course data! Please try again.",
    });
  }
});

adminRouter.put("/editCourse", verifyJWTAdmin, async (req, res) => {
  // admin can only update that course which belongs to him/her
  // req.email = req.isTokenVerified.email

  const admin = await adminModel.findOne({
    email: req.email,
  });

  const creatorId = admin._id;
  const { title, description, price, imageUrl, courseId } = req.body;

  const course = await courseModel.findOne({
    creatorId: creatorId,
    _id: courseId,
  });

  if (!course) {
    res.status(422).json({
      message: "Can't access course details!",
    });
  }

  await courseModel.updateOne(
    { course },
    {
      title: title,
      description: description,
      price: price,
      imageUrl: imageUrl,
    }
  );

  res.json({
    message: "Course details updated successfully!"
  });
});

adminRouter.get("/course/details", verifyJWTAdmin, async (req, res) => {
  try {
    const admin = await adminModel.findOne({
      email: req.email,
    });

    const creatorId = admin._id;

    const courseDetails = await courseModel.find({
      creatorId: creatorId,
    });

    console.log(courseDetails);

    res.json({
      message: "Admin can see their courses!",
      courses : courseDetails
    });
  } catch (error) {
    res.json({
      message: "Can't fetch courses data!",
    });
  }
});

module.exports = adminRouter;
