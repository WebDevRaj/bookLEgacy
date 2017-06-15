var mongoose = require("mongoose");
var bookSchema = new mongoose.Schema({
	title: String,
	author: String,
	subject: String,
	department: String,
	sem: String,
	price: String,
	owner: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String,
        phone: String
	}
});

module.exports = mongoose.model("Book", bookSchema);