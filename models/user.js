var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	name: { 
		type: String, 
		required: true 
	},
	email: { 
		type: String, 
		required: true, 
		unique: true 
	},
	phone: { 
		type: String, 
		required: true, 
		unique: true 
	},
	username: { 
		type: String, 
		required: true,
		unique: true 
	},
	password: String,
	permalink: String,
	verified: { 
		type: Boolean, 
		default: false 
	},
	verify_token: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);