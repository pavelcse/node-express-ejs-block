const { body } = require('express-validator')
const cheerio = require('cheerio');

module.exports = [
    body('title')
        .not().isEmpty().withMessage('Title must not be empty')
        .isLength({max:100, min:2}).withMessage('Title must be between 2 to 100')
        .trim(),
    body('body')
        .not().isEmpty().withMessage('Post Details must not be empty')
        .custom(value => {
            let node = cheerio.load(value)
            let text = node.text()

            if(text.length > 5000) {
                throw new Error('Post Details must be less then 5000 chars')
            }
            return true
        }),
    
    body('tags')
        .not().isEmpty().withMessage('Tags must not be empty')
]