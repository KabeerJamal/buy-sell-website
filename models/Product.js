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
            //console.log(this.data);
            this.cleanUp();
            this.validate();
            
            if(!this.errors.length) {
                productCollection.insertOne(this.data).then(() => {
                    /*
                    {
                        title: 'safe',
                        price: '32',
                        description: 'fefef',
                        image: '/productImages/1711892056641.jpg',
                        createdDate: 2024-03-31T13:34:16.647Z,
                        author: new ObjectId('65f582c0a8fa2bdf5f43aa27'),
                        _id: new ObjectId('66096658f1f3681682bd9696')
                    }
                    */
                    //console.log(this.data);
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
            if(typeof(productId) != "string" || !ObjectId.isValid(productId)) {
                reject();
                return;
            }
            //console.log(productId);
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

    static search(searchTerm) {
        return new Promise(async (resolve, reject) => {
            if(typeof searchTerm == "string") {
                let products = await productCollection.aggregate([
                    {$match: {$text: {$search: searchTerm}}},
                    
                    //needs to be done further, lookup author id and get the author name
                    {$lookup: {from: "users", localField: "author", foreignField: "_id", as: "authorDocument"}},
                    
                    {$project: {
                        title:1,
                        price:1,
                        image:1,
                        createdDate:1,
                        authorId: '$author',
                        //author: {$arrayElemAt: [{$arrayElemAt: ["$authorDocument", 0]}, 1]}
                        author: {$arrayElemAt:["$authorDocument.username",0]}
                    }},
                    {$sort: {$score: {$meta: "textScore"}}}//if not at the end, it will not work           
                      
                ]).toArray();
                //console.log(products);
                /*
                [
  {
    _id: new ObjectId('65f58f327301a57981c4a3e8'),
    title: 'kabeer',
    price: '123213',
    image: '/productImages/1710591794780.jpg',
    createdDate: 2024-03-16T12:23:14.796Z,
    authorId: new ObjectId('65f582c0a8fa2bdf5f43aa27'),
    author: 'kabeer'
  },
  {
    _id: new ObjectId('65f84dfa9f415b582faea728'),
    title: 'Kabeer',
    price: '432432',
    image: '/productImages/1710771706644.png',
    createdDate: 2024-03-18T14:21:46.648Z,
    authorId: new ObjectId('65f582c0a8fa2bdf5f43aa27'),
    author: 'kabeer'
  },

]

*/
                resolve(products);
            } else {
                reject();
            }
        })
    }
}

module.exports = Product;