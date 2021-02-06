const router = require('express').Router()
const {isAuthenticated} = require('../../middleware/authMiddleware')
const {
    commentPostController,
    replyCommentPostController
} = require('../controllers/commentController')

const {
    likeController,
    dislikeController
} = require('../controllers/likeDislikeController')

const { bookmarkGetController } = require('../controllers/bookmarkController')


router.post('/comments/:postId', commentPostController)
router.post('/comments/replies/:commentId', replyCommentPostController)

router.get('/likes/:postId', likeController)
router.get('/dislikes/:postId', dislikeController)

router.get('/bookmarks/:postId', bookmarkGetController)

module.exports = router