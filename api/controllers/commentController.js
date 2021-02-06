const Post = require('../../models/Post')
const Comment = require('../../models/Comment')

exports.commentPostController = async (req, res, next) => {
    let {postId} = req.params;
    let {body} = req.body;

    if(!req.user) {
        return res.status(403).json({
            error: 'Yor are not authenticated user'
        })
    }

    let comment = new Comment({
        post: postId,
        user: req.user._id,
        body,
        replies: []
    })

    try {
        let createdComment = await comment.save();

        await Post.findOneAndUpdate(
            {_id: postId},
            {$push: {'comments': createdComment._id}}
        )

        console.log('Here')
        let commentJson = await Comment.findById(createdComment._id).populate({
            path: 'user',
            select: 'username profilePics'
        })
        console.log('Here 2')

        return res.status(201).json(commentJson);

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: 'Server Error Occurred'
        })
    }
 }

exports.replyCommentPostController = async (req, res, next) => {
    let {commentId} = req.params;
    let {body} = req.body;

    if(!req.user) {
        return res.status(403).json({
            error: 'Yor are not authenticated user'
        })
    }

    let reply = {
        user: req.user._id,
        body
    }

    try {
        await Comment.findOneAndUpdate(
            {_id: commentId},
            {$push: {'replies': reply}}
        );

        return res.status(201).json({
            ...reply,
            profilePics: req.user.profilePics,
            username: req.user.username
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: 'Server Error Occurred'
        })
    }
}