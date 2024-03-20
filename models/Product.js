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
                    /*console.log(this.data);
                    {
                        title: 'ffe',
                        createdDate: 2024-03-15T15:59:58.277Z,
                        author: new ObjectId('65f4707ebc61a0ca1758bb65'),
                        _id: new ObjectId('65f4707ebc61a0ca1758bb66')
                      }*/
                    console.log(this.data);
                    resolve(this.data);
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
        
        //console.log(this.userId);//string

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
    

    static getMyProducts(userId) {
        return new Promise(async (resolve,reject) => {
            if(typeof(userId) != "string" || !ObjectId.isValid(userId)) {
               reject();
                return;
            }
            try {
                let products = await productCollection.find({author: new ObjectId(userId)}).toArray();
                //console.log(products);
                resolve(products);
            } catch {
                reject();
         }

        })
    }

    static getOtherProducts(userId) {
        return new Promise(async (resolve,reject) => {
            if(typeof(userId) != "string" || !ObjectId.isValid(userId)) {
               reject();
                return;
            }
            try {
                let products = await productCollection.find({author: {$ne: new ObjectId(userId)}}).toArray();
                //console.log(products);
                resolve(products);
            } catch {
                reject();
         }

        })
    }
    
    static getAllProducts() {
        return new Promise(async (resolve,reject) => {
           
            try {
                let products = await productCollection.find().toArray();
                //console.log(products);
                resolve(products);
            } catch {
                reject();
         }

        })
    }
    static findSingleProductById(productId,userId) {
        return new Promise(async (resolve, reject) => {
            //console.log(productId);
            if(typeof(productId) != "string" || !ObjectId.isValid(productId)) {
                reject();
                return;
            }
            console.log(productId);
            try {
                //console.log(productId);
                let product = await productCollection.findOne({_id: new ObjectId(productId)});
                //console.log(product);
                product.isCurrentUser = false;
                if (product.author == userId) {
                    product.isCurrentUser = true;  
                }
                resolve(product);
            } catch {   
                reject();
            }
        })
    }
}

module.exports = Product;