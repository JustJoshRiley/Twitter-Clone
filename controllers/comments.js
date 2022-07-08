const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports = (app) => {

    app.post('/posts/:postId/comments', (req, res) => {
        const comment = new Comment(req.body);
        comment.author = req.user._id;
        comment
        .save()
        .then(() => Promise.all([
            Post.findById(req.params.postId),
        ]))
        .then(([post]) => {
            post.comments.unshift(comment);
            return Promise.all([
            post.save(),
            ]);
        })
        .then(() => res.redirect(`/posts/${req.params.postId}`))
        .catch((err) => {
            console.log(err);
        });
    });
    app.get('/comment/:CommentId/delete/:postId', (req,res) => {
        Comment.findById(req.params.CommentId).then(comment => {
            comment.delete()
            res.redirect(`/posts/${req.params.postId}`)
        }).catch((err) => {
            console.log(err)
        })
    })
    app.get('/comment/:CommentId/edit/:PostId', (req,res) => {
        // const currentUser = req.user;
        const postId = req.params.PostId
        Comment.findById(req.params.CommentId).then((comment) => {
            res.render('comment-update', {comment, postId})
        })
    })
    app.post('/comment/:CommentId/:PostId', (req,res) => {
        Comment.findById(req.params.CommentId).then((comment) => {
            comment.updateOne(req.body).then(() => {
                res.redirect(`/posts/${req.params.PostId}`);
            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.log(err)
        })
    })
};