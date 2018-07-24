const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: String,
	googleID: String
});

module.exports = User = mongoose.model("user", userSchema);