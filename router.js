const express = require('express');
const router = express.Router();
const userController = require('./controller/userController');
const productController = require('./controller/productController');

const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/productImages")
    },
    filename: (req, file, cb) => {
        //console.log(file);
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})

router.get('/', userController.home);

router.post('/search', function(req,res) {
    res.send('Open search page');
})

router.get('/loginPage', userController.loginPage);//opens the login page
router.post('/login', userController.login);//logs in the user

router.get('/registerPage', userController.registerPage)//opens the register page
router.post('/register', userController.register )

router.get('/logout', userController.logout)
//need to set log out as well(thats once you sign up)


//post your product route
router.get('/postProductPage', userController.mustBeLoggedIn, productController.postProductPage);
router.post('/postProduct', userController.mustBeLoggedIn, upload.single('image') , productController.postProduct);

module.exports = router;