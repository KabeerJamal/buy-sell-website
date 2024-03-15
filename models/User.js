const validator = require("validator");//npm install validator
const usersCollection = require('../db').db().collection("users");
const bcrypt = require("bcryptjs"); //npm install bcryptjs

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
                let salt = bcrypt.genSaltSync(10);
                this.data.password = bcrypt.hashSync(this.data.password, salt);
                //store user in database
                await usersCollection.insertOne(this.data);
                resolve()
            } else {
                reject(this.errors);
            }

        })
    }

    login() {
        return new Promise(async (resolve, reject) => {
            this.cleanUp();

            let userName = await usersCollection.findOne({username: this.data.username});
            //console.log(userName);
            //{
            //    _id: new ObjectId('65e4bd58f792c64bfcf8eac1'),
            //    username: 'kabeer',
            //    email: 'kabeer@kabeer.com',
            //    password: 'qwertyqwerty'
            //  }
            //console.log(this.data);
            //{ username: 'kabeer', email: '', password: 'wewew' }
            if(userName &&  await bcrypt.compare(this.data.password, userName.password)) {
                this.data = userName;
                resolve();
            } else {
                reject("Invalid username / password");
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
        return new Promise(async (resolve, reject) => {
            if(this.data.username == "") {this.errors.push("You must provide a username")};
            if(this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {this.errors.push("Username can only contain letters and numbers")};
            if(!validator.isEmail(this.data.email)) {this.errors.push("You must provide a email")};
            if(this.data.password == "") {this.errors.push("You must provide a password")};
            if(this.data.password.legnth > 0 && this.data.password.legnth < 12) {this.errors.push("Password must be at least 12 characters")};
            if(this.data.password.legnth > 50) {this.errors.push("Password cannot exceed 50 characters")};
            if(this.data.username.legnth > 0 && this.data.username.legnth < 3) {this.errors.push("Username must be at least 3 characters")};
            if(this.data.username.legnth > 30) {this.errors.push("Password cannot exceed 30 characters")};

            //only if username is valid then check to see if it is already taken
            if (this.data.username.length > 2 && this.data.username.length < 31 && validator.isAlphanumeric(this.data.username)) {
                let usernameExists = await usersCollection.findOne({username: this.data.username})
                if (usernameExists) {this.errors.push("That username is already taken.")}
            }

            //only if email is valid then check to see if it is already taken
            if (validator.isEmail(this.data.email)) {
                let emailExists = await usersCollection.findOne({email: this.data.email})
                if (emailExists) {this.errors.push("That email is already being used.")}
            }
            resolve();
            })
        
    }

    
}

module.exports = User
