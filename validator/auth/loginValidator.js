const { body } = require('express-validator')
const User = require('../../models/User')

module.exports = [
    body('username')
        .not()
        .isEmpty().withMessage(`Username must not be empty`)
        .trim(),
    body('password')
        .not()
        .isEmpty().withMessage('Password must not be empty')
]