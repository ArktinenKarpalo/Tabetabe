const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
	name: String,	// Name of the ingredient
	amount: String,	// Amount of the ingredient in form of number or fraction ie. 1/4
	unit: String	// Unit of measurement
}, {noId: true});

const recipeSchema = new mongoose.Schema({
	owner: String, // Id of the recipe owner
	name: String,	// Name of the recipe
	images: [String],	// Images related to the recipe
	ingredients: [ingredientSchema],
	instructions: String, // Instructions
	tasteRating: Number, // Taste rating from 0 to 5
	priceRating: Number, // Price rating from 0 to 5
	prepTime: Number, // Time in minutes to prepare the recipe
	prepTimeUnit: String,
	servings: Number // Servings
});

module.exports = Recipe = mongoose.model("recipe", recipeSchema);