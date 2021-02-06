const {Schema, model} = require('mongoose')

const Profile = require('./Profile')

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        minLength: 2,
        maxlength: 15,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: 3
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: Profile
    },
    profilePics: {
        type: String,
        default: '/upload/default.png'
    },
}, {timestamps: true})

const User = model('User', userSchema)

module.exports = User