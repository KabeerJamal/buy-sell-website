
const {MongoClient} = require('mongodb');

const client = new MongoClient("mongodb+srv://KabeerJamal:okLJNwUKELu8dbH7@cluster0.y9lzjvr.mongodb.net/OLXClone?retryWrites=true&w=majority");

async function run() {
    await client.connect();
    module.exports = client;//an object representing the real database
    const app = require('./app');
    app.listen(3000);// starts a server that listens for incoming connections on port 3000.
}

run();