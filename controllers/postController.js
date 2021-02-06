const { validationResult } = require("express-validator");
const readingTime = require("reading-time");
const Flash = require("../utilities/Flash");
const Profile = require("../models/Profile");
const Post = require("../models/Post");
const validationErrorFormatter = require("../utilities/validationErrorFormatter");

exports.createPostGetController = async (req, res, next) => {
  return res.render("pages/dashboard/post/create-post", {
    title: "Create Your Post",
    errors: {},
    posts: {},
    flashMessage: Flash.getMessage(req),
  });
};

exports.createPostPostController = async (req, res, next) => {
  let { title, body, tags } = req.body;
  let errors = validationResult(req).formatWith(validationErrorFormatter);

  if (!errors.isEmpty()) {
    req.flash("fail", "Please Check Your Input");

    return res.render("pages/dashboard/post/create-post", {
      title: "Create Your Post",
      errors: errors.mapped(),
      posts: { title, body, tags },
      flashMessage: Flash.getMessage(req),
    });
  }

  if (tags) {
    tags = tags.split(",");
    tags = tags.map((tag) => tag.trim());
  }

  let readTime = readingTime(body).text;

  let post = new Post({
    title,
    body,
    author: req.user._id,
    tags,
    thumbnail: "",
    readTime,
    likes: [],
    dislikes: [],
    comments: [],
  });

  if (req.file) {
    post.thumbnail = `/upload/${req.file.filename}`;
  }

  try {
    let newPost = await post.save();
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $push: { posts: newPost._id } }
    );

    req.flash("success", "Post Created Successfully...");
    return res.redirect(`/posts/edit/${newPost._id}`);
  } catch (err) {
    next(err);
  }
};

exports.editPostGetController = async (req, res, next) => {
  let postId = req.params.postId;

  try {
    let post = await Post.findOne({ author: req.user._id, _id: postId });

    if (!post) {
      let error = new Error("404 Page Not Found!");
      error.status = 404;
      throw error;
    }

    return res.render("pages/dashboard/post/edit-post", {
      title: "Edit Your Post",
      errors: {},
      posts: post,
      flashMessage: Flash.getMessage(req),
    });
  } catch (err) {
    next(err);
  }
};

exports.editPostPostController = async (req, res, next) => {
  let postId = req.params.postId;
  let { title, body, tags } = req.body;
  let errors = validationResult(req).formatWith(validationErrorFormatter);

  try {
    let post = await Post.findOne({ author: req.user._id, _id: postId });

    if (!post) {
      let error = new Error("404 Page Not Found!");
      error.status = 404;
      throw error;
    }

    if (!errors.isEmpty()) {
      req.flash("fail", "Please Check Your Input");

      return res.render("pages/dashboard/post/create-post", {
        title: "Create Your Post",
        errors: errors.mapped(),
        posts: { title, body, tags },
        flashMessage: Flash.getMessage(req),
      });
    }

    if (tags) {
      tags = tags.split(",");
      tags = tags.map((tag) => tag.trim());
    }

    let readTime = readingTime(body).text;
  
    let thumbnail = post.thumbnail
    if (req.file) {
      thumbnail = `/upload/${req.file.filename}`;
    }
    
    await Post.findOneAndUpdate(
      { _id: post._id },
      { $set: {title, body, tags,readTime,thumbnail}},
      { new: true}
    )

    req.flash("success", "Post Updated Successfully...");
    return res.redirect(`/posts/edit/${post._id}`);
  } catch (err) {
    console.log(err)
    next(err);
  }
};

exports.editPostDeleteController = async (req, res, next) => {
  let postId = req.params.postId;
  
  try {
    let post = await Post.findOne({ author: req.user._id, _id: postId });

    if (!post) {
      let error = new Error("404 Page Not Found!");
      error.status = 404;
      throw error;
    }

    await Post.findOneAndDelete({ _id: post._id})
    await Profile.findOneAndUpdate(
      {user: req.user._id},
      {$pull: {'posts': postId}}
    )

    req.flash("success", "Post Deleted Successfully...");
    return res.redirect('/posts');

  } catch (err) {
    next(err)
  }
}

exports.postsController = async (req, res, next) => {
  try {
    let posts = await Post.find({author: req.user._id})

    return res.render("pages/dashboard/post/posts", {
      title: "Post List",
      errors: {},
      posts,
      flashMessage: Flash.getMessage(req),
    });
  } catch (err) {
    next(err)
  }

}
