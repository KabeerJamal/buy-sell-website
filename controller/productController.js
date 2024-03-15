const Product = require('../models/Product');


exports.postProductPage = function(req, res) {
    //open the post product page
    res.render('postProduct.ejs');
}


exports.postProduct = async function(req, res) {
    //console.log(req.body, req.file.filename);
    //req.file.filename is used to access the name of the file that was uploaded to the server.
    const ImageUrl = '../productImages/' + req.file.filename;
    let product = new Product(req.body, ImageUrl, req.session.user._id);

    try {
        await product.insertImage();
        //ideally send a success flash package
        res.send("success");
    } catch (e) {
        res.send("failure");
    }
    
}