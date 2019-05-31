const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//Book Schema
const BookSchema = mongoose.Schema({
    title:{
        type: String
    },
    description:{
        type:String,
        required:true
    },
    copies:{
        type:number,
        required:true
    }
});