const express = require('express');
const app = express();
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
//deal with git(new repository and delete this one),then complete registeration + login + flash + encrypt passwords