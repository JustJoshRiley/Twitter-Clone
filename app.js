const express = require('express')
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const Post = require('./models/post');
const checkAuth = require('./middleware/checkAuth');

const hbs = exphbs.create({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    helpers: {
        if_eq: function (a, b, opts) {
            if (a === b) {
                return opts.fn(this);
            }
            return opts.inverse(this);
        },
    },
});

const app = express();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
// CSS
app.use(express.static(path.join(__dirname, '/public')));

app.use(checkAuth);

require('./data/twitter-db');
require('./controllers/posts')(app);
require('./controllers/comments')(app);
require('./controllers/auth.js')(app);
require('./controllers/replies.js')(app);
require('./controllers/profile')(app)

app.get('/', (req, res) => {
    const token = req.cookies.nToken;
    if (token) {
        jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            console.log(err)
            return res.render('posts-index', {posts})
            
        }
        Post.find({}).lean().populate('author')
            .then((posts) => res.render('posts-index', { posts }))
            
            .catch((err) => {
            console.log(err.message);
            });
        })
    } else {
        Post.find({}).lean()
        .then((posts) => res.render('posts-index', {posts}))
    }
});

const port = process.env.PORT || 3000
app.listen(port, (err) => {
    if (err) {
        console.log(err)
    }
    console.log('App listening on ' + port)
})

module.exports = app;