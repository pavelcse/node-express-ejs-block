const fs = require('fs')
const User = require("../models/User");
const Profile = require("../models/Profile");

exports.uploadProfilePics = async (req, res, next) => {
  if (req.file) {
    try {
      let oldProfilePics = req.user.profilePics;
      let profile = await Profile.findOne({ user: req.user._id });
      let profilePics = `/upload/${req.file.filename}`;

      if (profile) {
        await Profile.findOneAndUpdate(
          { user: req.user._id},
          {$set: { profilePics } }
        );
      }
      
      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { profilePics } }
      );

      if (oldProfilePics !== "/upload/default.png") {
        fs.unlink(`public${oldProfilePics}`, (err) => {
          if (err) console.log(err);
        });
      }

      res.status(200).json({ profilePics });
    } catch (e) {
      res.status(500).json({ profilePics: req.user.profilePics });
    }
  } else {
    res.status(500).json({ profilePics: req.user.profilePics });
  }
}

exports.removeProfilePics = (req, res, next) => {
    try {
        let defaultPic = '/upload/default.png'
        let currentPics = req.user.profilePics

        fs.unlink(`public${currentPics}`, async (err) => {
            if (err) {return console.log(err)};

            let profile = await Profile.findOne({ user: req.user._id });
            if(profile) {
                await Profile.findOneAndUpdate(
                    { user: req.user._id },
                    { $set: {profilePics: defaultPic} }
                )
            }

            await User.findOneAndUpdate(
                { _id: req.user._id },
                { $set: {profilePics: defaultPic} }
            )

        })
        res.status(200).json({profilePics: defaultPic})

    } catch (e){
        console.log(e)
        res.status(500).json({message: 'Cannot Remove Pics'})
    }
}

exports.postImageUploadController = async (req, res, next) => {
  if (req.file) {
    console.log(req.file.filename)
    return res.status(200).json({
        imgUrl: `/upload/${req.file.filename}`
    })
  }

  return res.status(500).json({
      message: 'Server Error'
  })
}
