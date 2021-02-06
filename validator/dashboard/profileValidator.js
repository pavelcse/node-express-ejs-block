const { body } = require('express-validator')
const validator = require('validator')

const linkValidator = value => {
    if(value) {
        if(!validator.isURL(value)) {
            throw new Error('Please Provide Valid Url')
        }
    }
    return true
}

module.exports = [
    body('name')
        .not().isEmpty().withMessage('Name must not be empty')
        .isLength({max:30, min:2}).withMessage('Name must be between 2 to 30')
        .trim(),
    body('title')
        .not().isEmpty().withMessage('Title must not be empty')
        .isLength({max:100, min:2}).withMessage('Title must be between 2 to 100')
        .trim(),
    body('bio')
        .not().isEmpty().withMessage('Bio must not be empty')
        .isLength({max:500, min:10}).withMessage('Bio must be between 10 to 500')
        .trim(),
    body('website')
        .custom(linkValidator)
        .trim(),
    body('facebook')
        .custom(linkValidator)
        .trim(),
    body('twitter')
        .custom(linkValidator)
        .trim(),
    body('github')
        .custom(linkValidator)
        .trim(),
]