const router = require('express').Router()
const {check, validationResult} = require('express-validator')

const Flash = require('../utilities/Flash')

router.get('/validator/signup', (req,res, next) => {
    console.log(Flash.getMessage(req))
    res.render('playground/signup', {title:'Validator Playground', errors: {}})
})

router.post('/validator/signup', 
[
    check('username')
        .not()
        .isEmpty().withMessage(`Username must not be empty`)
        .isLength({max:15, min:2}).withMessage(`Username must be between 2 to 15`)
        .trim(),
    check('email')
        .not()
        .isEmpty().withMessage(`Email must not be empty`)
        .isEmail().withMessage(`Please Provide A Valid Email`)
        .normalizeEmail(),
    check('password')
        .not()
        .isEmpty().withMessage(`Password must not be empty`)
        .custom(value => {
            if(value.length < 6) {
                throw new Error('Password Must Be Greater Then 5 Character')
            }
            return true
    }),
    check('confirmPassword')
        .not()
        .isEmpty().withMessage(`Confirm Password must not be empty`)
        .custom((value, { req }) => {
            if(value !== req.body.password) {
                throw new Error('Password Does Not Match')
            }
            return true
    })
],
(req,res, next) => {
    let errors = validationResult(req)
    const formatter = (error) => error.msg
    if(!errors.isEmpty()) {
        req.flash('fail', 'There is some error')
        console.log(errors = errors.formatWith(formatter).mapped())
    } else {
        req.flash('success', 'There is no error')
    }

    console.log(req.body.username, req.body.email)
    
    res.redirect('/playground/validator/signup')
})

module.exports = router