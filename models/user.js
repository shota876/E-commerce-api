const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lovercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value) {
            if(value.lowercase().includes('password')){
                throw new Error("password mustn't contain wassword")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

},{timestamps: true})

const User = mongoose.model("User", userSchema)
module.exports = User