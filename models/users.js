const mongoose = require('mongoose');
var Schema = mongoose.Schema
var uniqueValidator = require('mongoose-unique-validator');

// USER SCHEMA
const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true 
    }
});

UserSchema.plugin(uniqueValidator, {message: "{PATH}"});

const User = module.exports = mongoose.model('User', UserSchema);