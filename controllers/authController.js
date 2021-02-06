const bcrypt = require('bcrypt')
const User = require('../models/User');
const Flash = require('../utilities/Flash')

const { validationResult } = require('express-validator')

const validationErrorFormatter = require('../utilities/validationErrorFormatter')

exports.signupGetController = (req, res, next) => {
    res.render('pages/auth/signup', 
    {
        title: 'Signup - Create A New Account', 
        errors: {}, 
        values: {},
        flashMessage: Flash.getMessage(req)
    })
}

exports.signupPostController = async (req, res, next) => {
    const {username, email, password, confirmPassword} = req.body

    let errors = validationResult(req).formatWith(validationErrorFormatter)

    if(!errors.isEmpty()) {
        req.flash('fail', 'Please Check Your Input')

        return res.render('pages/auth/signup', 
        {
            title: 'Signup - Create A New Account', 
            errors: errors.mapped(),
            values: { username, email, password },
            flashMessage: Flash.getMessage(req)
        })
    }

    try {
        let hashedPassword = await bcrypt.hash(password, 11)

        let user = new User({
            username, email, password: hashedPassword
        });

        await user.save()
        req.flash('success', 'User Created Successfully...')
        return res.redirect('/auth/login')
    } catch (err) {
        next(err)
    }
}

exports.loginGetController = (req, res, next) => {
    res.render('pages/auth/login', 
    {
        title: 'Login - Login Your Account',
        errors: {},
        values: {},
        flashMessage: Flash.getMessage(req)
    })
}

exports.loginPostController = async (req, res, next) => {
    const {username, password} = req.body
    
    let errors = validationResult(req).formatWith(validationErrorFormatter)

    if(!errors.isEmpty()) {
        req.flash('fail', 'Please Check Your Input')
        
        return res.render('pages/auth/login', 
        {
            title: 'Login - Login Your Account',
            errors: errors.mapped(),
            values: { username, password },
            flashMessage: Flash.getMessage(req)
        })
    }

    try {
        let user = await User.findOne({username})
        if(!user) {
            req.flash('fail', 'Authentication Failed')
            return res.render('pages/auth/login', 
                {
                    title: 'Login - Login Your Account',
                    errors: {username: 'Invalid Username!'},
                    values: { username, password },
                    flashMessage: Flash.getMessage(req)
                })
        }

        let match = await bcrypt.compare(password, user.password)
        if(!match) {
            req.flash('fail', 'Authentication Failed')

            return res.render('pages/auth/login', 
                {
                    title: 'Login - Login Your Account',
                    errors: {password: 'Password Does Not Match!'},
                    values: { username, password },
                    flashMessage: Flash.getMessage(req)
                })
        }

        req.session.isLoggedIn = true
        req.session.user = user

        req.session.save(err => {
            if(err) {
                return next(err)
            }
            req.flash('success', 'LoggedIn Successfully...')
            res.redirect('/dashboard')
        })

    } catch (err) {
        return res.json({
            error: err
        })
    }
}

exports.logoutController = (req, res, next) => {
    //req.flash('success', 'Logout Successfully...')
    req.session.destroy(err => {
        if(err) {
            return next(err)
        }

        res.redirect('/auth/login')
    })
}