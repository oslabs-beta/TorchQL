// var mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const mongoController = {};


mongoController.getCollections = (req, res, next) => {
	var uri = 'mongodb://admin1:admin1@ds055485.mlab.com:55485/datacenter';
	console.log(uri, req.query.uri)
	MongoClient.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
		console.log("MongoDB connection established successfully");
		db = client.db('datacenter');
		db.listCollections().toArray((err, collections) => {
			console.log('collections: ', collections);
			client.close();
			return next();
		})
	});
	
}
module.exports = mongoController;