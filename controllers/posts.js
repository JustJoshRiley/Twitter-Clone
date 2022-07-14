const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');


module.exports = (app) => {
    app.get('/posts/new', (req, res) => {
        const currentUser = req.user;
        res.render('posts-new', {currentUser})
    });
    // CREATE
    app.post('/posts/new', (req, res) => {
        if (req.user) {
            const userId = req.user._id;
            const post = new Post(req.body);
            post.upVotes = [];
            post.downVotes = [];
            post.voteScore = 0;
            post.author = userId;
            post
                .save()
                .then(() => User.findById(userId))
                .then((user) => {
                    user.posts.unshift(post);
                    user.save();
                    return res.redirect(`/posts/${post._id}`);
                })
                .catch((err) => {
                console.log(err.message);
                });
        } else {
            return res.status(401); 
        }
    });
    // LOOK UP THE POST
    app.get('/posts/:id', (req, res) => {
        Post.findById(req.params.id).populate('comments').lean()
            .then((post) => res.render('posts-show', { post }))
            .catch((err) => {
                console.log(err.message);
        });
    });

    app.get('/posts/:id/delete/:UserId', (req, res) => {
        User.findById(req.params.UserId).then((user => {
            user.posts.shift()
            console.log(user.posts)
        }))
        Post.findById(req.params.id).then(post => {
            post.delete();
            res.redirect(`/`);
        }).catch((err) => {
            console.log(err);
        });
    })

    app.get('/posts/:id/edit', (req,res) => {
        Post.findById(req.params.id).then(post => {
            res.render('posts-edit', {post})
        })
    })

    app.post('/posts/edit/:id', (req,res) => {
        Post.findById(req.params.id).then(post => {
            post.updateOne(req.body).then(() => {
                res.redirect(`/posts/${req.params.id}`);
            }).catch((error) => {
                console.log(error)
            })
        }).catch((error) => {
            console.log(error)
        })
    })

    app.put('/posts/:id/vote-up', (req, res) => {
        Post.findById(req.params.id).then(post => {
            post.upVotes.push(req.params.id);
            post.voteScore = post.upVotes.length - post.downVotes.length;
            post.save();

            return res.render('posts-show', {post});
        }).catch(err => {
            console.log(err);
        })
    });

    app.put('/posts/:id/vote-down', (req, res) => {
        Post.findById(req.params.id).then(post => {
            post.downVotes.push(req.params.id);
            post.voteScore = post.upVotes.length - post.downVotes.length;
            post.save();

            return res.render('posts-show', {post});
        }).catch(err => {
            console.log(err);
        });
    });
};