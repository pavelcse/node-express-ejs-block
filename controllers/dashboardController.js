const { validationResult } = require("express-validator");
const bcrypt = require('bcrypt')
const Flash = require("../utilities/Flash");
const Profile = require("../models/Profile");
const Comment = require("../models/Comment");
const User = require("../models/User");
const validationErrorFormatter = require("../utilities/validationErrorFormatter");

exports.dashboardGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id })
        .populate('posts')
        .populate('bookmarks');
    let commentCount = await Comment.countDocuments({user: req.user._id})

    if (profile) {
      return res.render("pages/dashboard/dashboard", {
        title: "My Dashboard",
        profile,
        commentCount,
        flashMessage: Flash.getMessage(req),
      });
    }

    res.redirect("/dashboard/create-profile");
  } catch (e) {
    next(e);
  }
};

exports.createProfileGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      return res.redirect("/dashboard/edit-profile");
    }

    return res.render("pages/dashboard/create-profile", {
      title: "Create Your Profile",
      errors: {},
      values: {},
      flashMessage: Flash.getMessage(req),
    });
  } catch (e) {
    next(e);
  }
};

exports.createProfilePostController = async (req, res, next) => {
  const { name, title, bio, website, facebook, twitter, github } = req.body;

  let errors = validationResult(req).formatWith(validationErrorFormatter);

  if (!errors.isEmpty()) {
    req.flash("fail", "Please Check Your Input");

    return res.render("pages/dashboard/create-profile", {
      title: "Create Your Profile",
      errors: errors.mapped(),
      values: { name, title, bio, website, facebook, twitter, github },
      flashMessage: Flash.getMessage(req),
    });
  }

  try {
    let profile = new Profile({
      user: req.user._id,
      name,
      title,
      bio,
      profilePics: req.user.profilePics,
      links: {
        website: website || "",
        facebook: facebook || "",
        twitter: twitter || "",
        github: github || "",
      },
      posts: [],
      bookmarks: [],
    });

    let createdProfile = await profile.save();
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { profile: createdProfile._id } }
    );

    req.flash("success", "Profile Created Successfully...");
    res.redirect("/dashboard");
  } catch (e) {
    next(e);
  }
};

exports.editProfileGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      res.redirect("/dashboard/create-profile");
    }

    return res.render("pages/dashboard/edit-profile", {
      title: "Edit Your Profile",
      errors: {},
      values: {},
      profile,
      flashMessage: Flash.getMessage(req),
    });
  } catch (e) {
    next(e);
  }
};

exports.editProfilePostController = async (req, res, next) => {
  const { name, title, bio, website, facebook, twitter, github } = req.body;

  let errors = validationResult(req).formatWith(validationErrorFormatter);

  if (!errors.isEmpty()) {
    req.flash("fail", "Please Check Your Input");

    return res.render("pages/dashboard/edit-profile", {
      title: "Edit Your Profile",
      errors: errors.mapped(),
      profile: {
        name,
        title,
        bio,
        links: { website, facebook, twitter, github },
      },
      flashMessage: Flash.getMessage(req),
    });
  }

  try {
    let profile = {
      name,
      title,
      bio,
      links: {
        website: website || "",
        facebook: facebook || "",
        twitter: twitter || "",
        github: github || "",
      },
    };

    let editProfile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: profile },
      { new: true }
    );

    req.flash("success", "Profile Updated Successfully...");

    return res.render("pages/dashboard/edit-profile", {
      title: "Edit Your Profile",
      errors: {},
      profile: editProfile,
      flashMessage: Flash.getMessage(req),
    });
  } catch (e) {
    next(e);
  }
};

exports.bookmarksGetController = async (req, res, next) => {
  let userId = req.user._id;

  try {
    let profile = await Profile.findOne({user: userId})
    // .populate('bookmarks', 'title thumbnail')
      .populate({
        path: 'bookmarks',
        model: 'Post',
        select: 'title thumbnail createdAt'
      });

      return res.render("pages/dashboard/post/bookmarks", {
        title: "Bookmarks",
        errors: {},
        profile,
        flashMessage: Flash.getMessage(req),
      });
  } catch (e) {
    next(e);
  }
}

exports.commentsGetController = async (req, res, next) => {
  let userId = req.user._id;

  try {
    let profile = await Profile.findOne({user: userId});
    let comments = await Comment.find({post: {$in: profile.posts }})
          .populate({
            path: 'post',
            select: 'title'
          })
          .populate({
            path: 'user',
            select: 'username profilePics'
          })
          .populate({
            path: 'replies.user',
            select: 'username profilePics'
          });
    
    return res.render("pages/dashboard/post/comments", {
      title: "Comments",
      errors: {},
      comments,
      flashMessage: Flash.getMessage(req),
    });
  } catch (e) {
    next(e);
  }
}

exports.changePasswordGetController = async (req, res, next) => {
  return res.render("pages/auth/change-password", {
    title: "Change Password",
    errors: {},
    flashMessage: Flash.getMessage(req),
  });
}

exports.changePasswordPostController = async (req, res, next) => {
  const {oldPassword, password, confirmPassword} = req.body
    
    let errors = validationResult(req).formatWith(validationErrorFormatter)

    if(!errors.isEmpty()) {
        req.flash('fail', 'Please Check Your Input')
        
        return res.render('pages/auth/change-password', 
        {
            title: 'Change Password',
            errors: errors.mapped(),
            flashMessage: Flash.getMessage(req)
        })
    }

    try {
        let match = await bcrypt.compare(oldPassword, req.user.password)
        if(!match) {
            req.flash('fail', 'Authentication Failed')

            return res.render('pages/auth/change-password', 
                {
                    title: 'Change Password',
                    errors: {oldPassword: 'Old Password Does Not Match!'},
                    flashMessage: Flash.getMessage(req)
                })
        }

        let hashedPassword = await bcrypt.hash(password, 11)

        await User.findOneAndUpdate(
          {_id: req.user._id},
          {$set: {
            password: hashedPassword
           }}
          );

        req.flash('success', 'Password Updated Successfully...')
        return res.redirect('/dashboard/change-password')

    } catch (err) {
        return res.json({
            error: err
        })
    }
}

