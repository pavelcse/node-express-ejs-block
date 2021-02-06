const router = require('express').Router();

const {
    explorerGetController,
    singlePostGetController
} = require('../controllers/explorerController')

router.get('/', explorerGetController)
router.get('/:postId', singlePostGetController)

module.exports = router