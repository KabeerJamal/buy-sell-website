const Product = require('../models/Product');


exports.postProductPage = function(req, res) {
    //open the post product page
    res.render('postProduct.ejs');
}


exports.postProduct = async function(req, res) {
    //console.log(req.body, req.file.filename);
    //req.file.filename is used to access the name of the file that was uploaded to the server.
    const ImageUrl = '/productImages/' + req.file.filename;
   // console.log(typeof req.session.user.id);//string
    let product = new Product(req.body, ImageUrl, req.session.user.id);

    try {
        let productInfo = await product.insertImage();
        //console.log(productInfo);
        //ideally send a success flash package
        // res.session.save(() => {
        //     res.render('productDetails.ejs', {productInfo: productInfo});
        // })
        //need to create a success flash message and use it here.
        req.flash('success', 'Product posted successfully');
        req.session.save(function() {
            res.redirect('/productDetails/' + productInfo._id);
        });
        
        
    } catch (e) {
        res.send("failure");
    }
    
}

exports.productDetails = async function(req, res) {
    try {
        let productInfo = await Product.findSingleProductById(req.params.id, req.session.user.id);
        //console.log(productInfo);
        res.render('productDetails.ejs', {productInfo: productInfo});
    } catch {
        res.send("failure");
    }
}