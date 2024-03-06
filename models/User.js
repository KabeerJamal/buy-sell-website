const validator = require("validator");//npm install validator
const usersCollection = require('../db').db().collection("users");

class User {
    constructor(data) {
        this.data = data;
        this.errors = [];
    }


    register() {
        return new Promise(async (resolve, reject) => {
            this.cleanUp();
            await this.validate();

            //if array is empty, we insert username email and pass into databse and resolve
            //if errrors, we reject with this.errors.
            if (this.errors.length == 0){
                //store user in database
                let user = usersCollection.insertOne(this.data);
                resolve()
            } else {
                reject(this.errors);
            }

        })
    }

    cleanUp() {
        if(typeof(this.data.username) != "string") {this.data.username = ""};
        if(typeof(this.data.email) != "string") {this.data.email = ""};
        if(typeof(this.data.password) != "string") {this.data.password = ""};

        //get rid of any bogus properties
        this.data = {
            username: this.data.username.trim().toLowerCase(),
            email: this.data.email.trim().toLowerCase(),
            password: this.data.password
        }
    }

    validate() {
        return new Promise((resolve, reject) => {
            if(this.data.username == "") {this.errors.push("You must provide a username")};
            if(this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {this.errors.push("Username can only contain letters and numbers")};
            if(!validator.isEmail(this.data.email)) {this.errors.push("You must provide a email")};
            if(this.data.password == "") {this.errors.push("You must provide a password")};
            if(this.data.password.legnth > 0 && this.data.password.legnth < 12) {this.errors.push("Password must be at least 12 characters")};
            if(this.data.password.legnth > 50) {this.errors.push("Password cannot exceed 50 characters")};
            if(this.data.username.legnth > 0 && this.data.username.legnth < 3) {this.errors.push("Username must be at least 3 characters")};
            if(this.data.username.legnth > 30) {this.errors.push("Password cannot exceed 30 characters")};

            resolve();
        })
        
    }

    cleanUp() {

    }
}

module.exports = User
