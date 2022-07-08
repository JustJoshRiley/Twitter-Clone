const Post = require("../models/post")
const User = require('../models/user')

module.exports = (app) => {
    app.get('/users/:username', (req,res) => {
        if (req.params) {
            User.findOne(req.params)
            .then((user) => {
                res.render('profile', {user})
            })
            .catch((err) => {
                console.log(err.message)
            })
        } else {
            return res.status(401); 
        }
    })
    // app.post('/users/:username/posts', (req,res) => {
    //     if (req.params) {
    //         const user = req.params
    //         user.posts.forEach((post) => {
    //             const postObjects = []
    //             postObjects.unshift(Post.findById(post))
    //         }).then(() => {
    //             res.render('users-posts', {postObjects})
    //         })
    //     }
    // })
}