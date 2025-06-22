const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;
require('dotenv').config(); 
// config() -> Loads .env file content into process.env object (by default)

async function mongooseConnect () {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        // console.log("MongoDB connected succesfully!");
    } catch (error) {
        console.log(`Problem connecting with the MongoDB. Check your connection string!`)
    }
}

mongooseConnect();

// define the schema
const userSchema = new Schema({
    username : {type : String, unique : true},
    email : String,
    password : String,
    firstName : String,
    lastName : String
})

const adminSchema = new Schema({
    email : {type : String, unique : true},
    password : String,
    firstName : String,
    lastName : String
})

const courseSchema = new Schema({
    title : String,
    description : String,
    price : Number,
    imageUrl : String,
    creatorId : ObjectId
})

const purchaseSchema = new Schema({
    courseId : ObjectId,
    userId : ObjectId
})


// define the model
// const model_name = mongoose.model('collection_name', collectionSchema);
const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const courseModel = mongoose.model("course", courseSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);


module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}


