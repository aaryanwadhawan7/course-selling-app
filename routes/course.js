const express = require('express');
const { auth } = require('../middleware/user');
const courseRouter = express.Router();
const { courseModel, purchaseModel } = require('../db');


courseRouter.post('/purchase', auth, async (req, res) => {

    // req.user = user
    const userId = req.user._id;
    const courseId = req.body.courseId;

    await purchaseModel.create({
        userId : userId,
        courseId : courseId
    })

    res.json({
        message : "You have bought the course!",
    })
})


courseRouter.get('/details', (req, res) => {
    // Authentication is not reqd for the user to see course details
    const courses = courseModel.find({});

    res.json({
        message : "Course details fetch successfully!",
        allCourses : courses
    })
})


module.exports = courseRouter;