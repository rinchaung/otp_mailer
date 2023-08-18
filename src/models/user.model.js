const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role:{
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String
    }
});

module.exports = mongoose.model('User', UserSchema);
