## Creating a course selling app

- Initialize a new Nodejs project
- Add express, jsonwebtoken, zod to it as dependency 
- Create index.js
- Add route skeleton for user login, signup, purchase a course and see course
- Add route for admin login, admin signup, create a course, delete a course, add course content
- Define the Schema for User, Admin, Course and Purchase

![Schema for Course Selling App](./image/Screenshot%202025-06-17%20190238.png)

- Add middlewares for user and admin auth
- Add a database (mongodb), use dotenv to store the database connection string
- Complete the routes for user login, signup, purchase a course, see course (Use ecpress the routing to better structure your routes)
- Create the frontend