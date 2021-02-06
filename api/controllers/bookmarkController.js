const Profile = require('../../models/Profile')

exports.bookmarkGetController = async (req, res, next) => {
    let {postId} = req.params;
    let bookmarked = null;

    if(!req.user) {
        return res.status(403).json({
            error: 'Yor are not authenticated user'
        })
    }

    let userId = req.user._id;

    try {
        let profile = await Profile.findOne({user: userId})
        
        if(profile.bookmarks.includes(postId)) {
            await Profile.findOneAndUpdate(
                {user: userId},
                {$pull: {'bookmarks': postId}}
            )
            bookmarked = false;
        } else {
            await Profile.findOneAndUpdate(
                {user: userId},
                {$push: {'bookmarks': postId}}
            )
            bookmarked = true;
        }
        
        return res.status(200).json({ bookmarked });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: 'Server Error Occurred'
        })
    }
}