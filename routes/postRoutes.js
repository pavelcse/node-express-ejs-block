const router = require('express').Router()
const {isAuthenticated} = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')
const { 
    createPostGetController, 
    createPostPostController, 
    editPostGetController,
    editPostPostController,
    editPostDeleteController,
    postsController
} = require('../controllers/postController')
const postValidator = require('../validator/dashboard/postValidator')

router.get('/create', isAuthenticated, createPostGetController)
router.post('/create', isAuthenticated, upload.single('post_thumbnail'), postValidator, createPostPostController)

router.get('/edit/:postId', isAuthenticated, editPostGetController)
router.post('/edit/:postId', isAuthenticated, upload.single('post_thumbnail'), postValidator, editPostPostController)
router.get('/delete/:postId', isAuthenticated, editPostDeleteController)
router.get('/', isAuthenticated, postsController)

module.exports = router