const Flash = require('../utilities/Flash')
const Post = require('../models/Post')

exports.searchResultGetController = async (req, res, next) => {
    let term = req.query.term;
    let currentPage = parseInt(req.query.page) || 1;
    let itemParPage = 5;

    try{
        let posts = await Post.find({
            $text: {
                $search: term
            }
        })
        .populate({
            path: 'author',
            select: 'username'
        })
        .skip((itemParPage * currentPage) - itemParPage)
        .limit(itemParPage);

        let totalPost = await Post.countDocuments({
            $text: {
                $search: term
            }
        });
        let totalPage = Math.ceil(totalPost / itemParPage);

        res.render('pages/explorer/search', {
            title: `Search Result - ${term}`,
            flashMessage: Flash.getMessage(req),
            searchTerm: term,
            posts,
            currentPage,
            itemParPage,
            totalPage
        });

    } catch (e) {
        next(e);
    }
}