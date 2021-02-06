const moment = require('moment')
const Flash = require('../utilities/Flash')
const Post = require('../models/Post')
const Profile = require('../models/Profile')

function getDate(days) {
    let date = moment().subtract(days, 'days')
    return date.toDate()
}

function generateFilterObject(filter) {
    let filterObj = {}
    let order = 1

    switch (filter) {
        case 'week': {
            filterObj = {
                createdAt: {
                    $gt: getDate(7)
                } 
            }
            order = -1
            break
        }
        case 'month': {
            filterObj = {
                createdAt: {
                    $gt: getDate(30)
                } 
            }
            order = -1
            break
        }
        case 'all': {
            order = -1
            break
        }
    }
    return {
        filterObj,
        order
    }
}

exports.explorerGetController = async (req, res, next) => {
    let filter = req.query.filter || 'latest'
    let currentPage = parseInt(req.query.page) || 1
    let itemParPage = 5

    let {order, filterObj} = generateFilterObject(filter.toLowerCase())
    
    try {
        let posts = await Post.find(filterObj)
            .populate({
                path: 'author',
                select: 'username'
            })
            .sort(order === 1 ? '-createdAt' : 'createdAt')
            .skip((itemParPage * currentPage) - itemParPage)
            .limit(itemParPage);

        let totalPost = await Post.countDocuments(filterObj)
        let totalPage = Math.ceil(totalPost / itemParPage)

        let bookmarks = []
        if(req.user) {
            let profile = await Profile.findOne({user: req.user._id})
            if(profile) {
                bookmarks = profile.bookmarks
            }
        }

        res.render('pages/explorer/explorer', {
            title: 'Explore All Posts',
            filter,
            flashMessage: Flash.getMessage(req),
            posts,
            currentPage,
            itemParPage,
            totalPage,
            bookmarks
        });
    } catch (err) {
        next(err)
    }
}

exports.singlePostGetController = async (req, res, next) => {
    let {postId} = req.params

    try {
        let post = await Post.findById(postId)
            .populate('author', 'username profilePics')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username profilePics'
                }
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'replies.user',
                    select: 'username profilePics'
                }
            });
        if(!post) {
            let error = new Error('404 Page Not Found')
            error.status = 404
            throw error
        }

        let bookmarks = []
        if(req.user) {
            let profile = await Profile.findOne({user: req.user._id})
            if(profile) {
                bookmarks = profile.bookmarks
            }
        }

        res.render('pages/explorer/single-post', {
            title: post.title,
            flashMessage: Flash.getMessage(req),
            post,
            bookmarks
        });
    } catch (err) {
        next(err)
    }
}