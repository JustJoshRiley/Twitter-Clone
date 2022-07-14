const Post = require("../models/post")
const User = require('../models/user')

module.exports = (app) => {
    app.get('/users/:username', (req,res) => {
        if (req.params) {
            User.findOne(req.params)
            .populate('posts follows followers')
            .then((user) => {
                console.log(user)
                res.render('profile', {user})
            })
            .catch((err) => {
                console.log(err.message)
            })
        } else {
            return res.status(401); 
        }
    })
    // app.post('/user/:username/follow', (req,res) => {

    // })
}