//This file should handle request of access to data from ScoringSystem.js and open an connection to the mongodb data
const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://rasmushp03:bIV6MsfnmT4Z72LR@users.jcvjwsz.mongodb.net/';
const client = new MongoClient(uri);
const database = client.db('Users');
const collection = database.collection('UserData');
