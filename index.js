const express = require('express');
const jwt = require('jsonwebtoken');
const zod = require('zod');
const userRouter = require('./routes/user');
const courseRouter = require('./routes/course');
const adminRouter = require('./routes/admin');
const { userModel, adminModel, courseModel, purchaseModel } = require('./db');
const mongoose = require('mongoose');
const app = express();

require('dotenv').config();


app.use(express.json());

app.use('/user', userRouter);
app.use('/course', courseRouter);
app.use('/admin', adminRouter);

async function mongooseConnect () {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        app.listen(3000, () => {
            console.log("Application is currently running on port 3000!");
        });
    } catch (error) {
        console.error(`Error connecting to MongoDB : ${error.message}`);
    }
}

mongooseConnect();

