const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
	name: String,	// Name of the ingredient
	amount: String,	// Amount of the ingredient in form of number or fraction ie. 1/4
	unit: String	// Unit of measurement
}, {noId: true});

module.exports = Recipe = mongoose.model("ingredient", ingredientSchema);