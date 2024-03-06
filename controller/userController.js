const User = require('../models/User')

exports.login = function() {
    res.send('Open login page');
}

exports.logout = function() {

}


//Pass this information to a model. If the model successfully registers it into the database,
// you're successfully registered. Otherwise, you're not, and you get an error message.
exports.register = async function(req, res) {
    let user = new User(req.body);
    try {
        let value = await user.register();
        res.send("yaaay, you registered");
    } catch(e) {
        //console.log(e);
        res.send("whoops, you didnt register");
    }
}

exports.registerPage = function(req, res) {
    res.render('register.ejs')
}

exports.home = function(req, res) {
    res.render('home.ejs')
}