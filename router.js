const express = require('express');
const router = express.Router();
const userController = require('./controller/userController');

router.get('/', userController.home);

router.post('/search', function(req,res) {
    res.send('Open search page');
})

router.get('/login', userController.login)

router.get('/registerPage', userController.registerPage)//opens the register page
router.post('/register', userController.register )
//need to set log out as well(thats once you sign up)


module.exports = router;