const { body } = require('express-validator')

module.exports = [
    body('oldPassword')
        .not()
        .isEmpty().withMessage(`Old Password must not be empty`),
    body('password')
        .not()
        .isEmpty().withMessage('Password must not be empty')
        .isLength({min:6}).withMessage('Password Must Be Greater Then 5 Characters'),
    body('confirmPassword')
        .not()
        .isEmpty().withMessage('Confirm Password must not be empty')
        .custom((value, { req }) => {
            if(value !== req.body.password) {
                throw new Error('Password Does Not Match')
            }
            return true
    })
]