var mongoose = require("mongoose");
const mongoController = {};


mongoController.getCollections = (req, res, next) => {
	var uri = req.query.uri;
	mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

	const connection = mongoose.connection;
	
	connection.once("open", function() {
		console.log("MongoDB database connection established successfully");
		console.log(uri);
	});
	return next();
}
module.exports = mongoController;