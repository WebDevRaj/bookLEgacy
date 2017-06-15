var mongoose = require("mongoose");
var catagorySchema = new mongoose.Schema({
	department: "String",
	semester: [String],
	
});