const User = require('../models/User')

exports.loginPage = function(req, res) {
    //open a login page
    res.render('login.ejs');
}

exports.mustBeLoggedIn = function(req, res, next) {
    if(req.session.user) {
        next();
    } else {
        req.flash("errors", "You must be logged in to perform that action");
        req.session.save(function() {
            res.redirect('/');
        });
    }
}

exports.login = async function(req, res) {
    let user = new User(req.body);
    try {
        await user.login();
        req.session.user = {username: user.data.username, id: user.data._id};
        req.session.save(function() {
            //console.log(typeof req.session.user._id);//object
            res.redirect('/')//This runs once the session information has been saved to the database
        });
    } catch(e) {
        req.flash('errors', e);
        req.session.save(function() {
            res.redirect('/loginPage');
        });
    }
}


//Pass this information to a model. If the model successfully registers it into the database,
// you're successfully registered. Otherwise, you're not, and you get an error message.
exports.register = async function(req, res) {
    let user = new User(req.body);
    try {
        await user.register();

        req.session.user = {username: user.data.username};
        req.session.save(function() {
            //console.log(typeof req.session.user._id);//object
            res.redirect('/')//This runs once the session information has been saved to the database
        });
     
    } catch(e) {
        //console.log(e);
        req.flash('errors', e);
        res.redirect('/registerPage');
        //need to include a flash message here/
        
    }
}

exports.registerPage = function(req, res) {
    res.render('register.ejs')
}

exports.logout = async function(req,res) {
    await req.session.destroy();
    res.redirect('/');
    
}

exports.home = function(req, res) {
    res.render('home.ejs');
    //make changes here(look in app.js for the changes)
}