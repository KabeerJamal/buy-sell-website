const productCollection = require('../db').db().collection("product");
const ObjectId = require('mongodb').ObjectId;

class Product {
    constructor(data, imageUrl, userId) {
        this.data = data;
        this.imageUrl = imageUrl;
        this.userId = userId;
        this.errors = [];
    }

    insertImage() {
        return new Promise(async (resolve, reject) => {
            this.cleanUp();
            this.validate();

            if(!this.errors.length) {
                productCollection.insertOne(this.data).then(() => {
                    resolve();
                }).catch(() => {
                    this.errors.push("Please try again later.");
                    reject(this.errors);//problem with database
                });
            } else {
                reject(this.errors);
            }
        })
    }

    cleanUp() {
        if(typeof(this.data.title) != "string") {this.data.title = ""};
        if(typeof(this.data.price) != "string") {this.data.price = ""};
        if(typeof(this.data.description) != "string") {this.data.description = ""};
        

        //get rid of any bogus properties
        this.data = {
            title: this.data.title.trim(),
            price: this.data.price.trim(),
            description: this.data.description.trim(),
            image: this.imageUrl,
            createdDate: new Date(),
            author: new ObjectId(this.userId)
        }
    }

    validate() {
        if(this.data.title == "") {this.errors.push("You must provide a title.")};
        if(this.data.price == "") {this.errors.push("You must provide a price.")};
    }
    
}

module.exports = Product;