const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const app = express();


let sessionOptions = session({
    secret: "JavaScript is so cool",
    store: MongoStore.create({client: require('./db')}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000*60*60*24, httpOnly: true}  
})

app.use(sessionOptions);
app.use(flash());

app.use(function(req, res, next) {

    //make all error and sucess flash messages available from all templates
    res.locals.errors = req.flash("errors");
    res.locals.success = req.flash("success");

    /*
    if (req.session.user) {
        //console.log(typeof req.session.user._id);//string
        req.visitorId = req.session.user._id} 
    else {req.visitorId = 0}*/

    res.locals.user = req.session.user;//ejs can access the user object which has username and avatar
    next();
})

//for debugging
/*
app.use(function(req, res, next) {
    console.log(`${req.method} ${req.originalUrl} was hit`);
    next();
});*/

const router = require('./router');

app.use(express.static('public'));
app.set('views', 'views');
app.set('view engine', 'ejs');

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));


app.use('/', router);

module.exports = app;


//tomm



//(till tomm)

//start working on a search bar(should higlight your product with "My product")
//chat
//payment option

//settings page


