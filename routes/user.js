const express = require('express');
const Router = express.Router;
// const { Router } = require('express');

const userRouter = Router();

userRouter.post('/signup', (req, res) => {
    
})


userRouter.post('/login', (req, res) => {

})


userRouter.post('/purchases', (req, res) => {

})

module.exports = {
    userRouter : userRouter
}

