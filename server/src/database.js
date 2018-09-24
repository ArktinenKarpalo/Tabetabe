const mongoose = require("mongoose");
const keys = require("./keys.js")
const User = require("./models/user.js");
const Recipe = require("./models/recipe.js");
const Ingredient = require("./models/ingredient.js");
const utils = require("./utils.js");
const uuidv4 = require("uuid/v4");

// Connect to the database
mongoose.connect(keys.mongodb.dbURI, {keepAlive: 120}, () => {
	console.log("Connection to the database established!");
});

// Register a new user using googleID
module.exports.registerUserGoogleID = (name, id) => {
	return new User({
		username: name,
		googleID: id
	}).save();
};

// Find user with google id
module.exports.findUserByGoogleID = (id) => {
	return User.findOne({googleID: id});
}

// Find user by id
module.exports.findUserByID = (id) => {
	return User.findById(id);
}

// Get a recipe by id
module.exports.findRecipeByID = (id, callback, err) => {
	Recipe.findById(id).then(callback, err);
}

// Delete a recipe with id
module.exports.deleteRecipeByID = (id, callback) => {
	Recipe.findOneAndDelete({_id: id}).then(callback);
}

// Returns true if recipe was added
module.exports.addRecipe = (ownerID, recipe, callback) => {
	const dbRecipe = new Recipe();
	if(!recipe.recipeName || !recipe.instructions|| !ownerID)
		return false;
	dbRecipe.owner = ownerID;
	dbRecipe.instructions = recipe.instructions;
	dbRecipe.name = utils.capitalizeFirstLetter(recipe.recipeName);

	for(let i=0; i<recipe.ingredients.length; i++) {
		dbRecipe.ingredients.push(new Ingredient({
			name: recipe.ingredients[i].name,
			amount: recipe.ingredients[i].amount,
			unit: recipe.ingredients[i].type	
		}));
	}

	if(recipe.tasteRating && parseInt(recipe.tasteRating) >= 0 && parseInt(recipe.tasteRating) <= 5)
		dbRecipe.tasteRating = parseInt(recipe.tasteRating);

	if(recipe.priceRating && parseInt(recipe.priceRating) >= 0 && parseInt(recipe.priceRating) <= 5)
		dbRecipe.priceRating = parseInt(recipe.priceRating);

	if(recipe.servings && parseInt(recipe.servings) > 0)
		dbRecipe.servings = parseInt(recipe.servings);

	if(recipe.prepTime && parseInt(recipe.prepTime) > 0 && (recipe.prepTimeUnit === "minutes" || recipe.prepTimeUnit === "hours")) {
		dbRecipe.prepTime = parseInt(recipe.prepTime);
		dbRecipe.prepTimeUnit = recipe.prepTimeUnit;
	}

	// Handle image, save image name to the database only accept <= 5MB and 1080 width jpeg images
	if(recipe.image.length && recipe.image.length <= 6666666 && recipe.image.includes("data:image/jpeg;base64")) {
		const path = uuidv4().replace(/-/g, "");
		utils.saveBase64File(recipe.image.replace("data:image/jpeg;base64,", ""), __dirname + "/../recipeImages/"+path+".jpg");
		dbRecipe.images = [path];
		dbRecipe.save(callback);
	} else {
		dbRecipe.save(callback);
	}
}

module.exports.editRecipe = (recipeID, ownerID, recipe, callback) => {
	const dbRecipe = new Recipe();
	if(!recipe.recipeName || !recipe.instructions|| !ownerID)
		return false;
	dbRecipe.owner = ownerID;
	dbRecipe.instructions = recipe.instructions;
	dbRecipe.name = utils.capitalizeFirstLetter(recipe.recipeName);

	for(let i=0; i<recipe.ingredients.length; i++) {
		dbRecipe.ingredients.push(new Ingredient({
			name: recipe.ingredients[i].name,
			amount: recipe.ingredients[i].amount,
			unit: recipe.ingredients[i].type	
		}));
	}

	if(recipe.tasteRating && parseInt(recipe.tasteRating) >= 0 && parseInt(recipe.tasteRating) <= 5)
		dbRecipe.tasteRating = parseInt(recipe.tasteRating);

	if(recipe.priceRating && parseInt(recipe.priceRating) >= 0 && parseInt(recipe.priceRating) <= 5)
		dbRecipe.priceRating = parseInt(recipe.priceRating);

	if(recipe.servings && parseInt(recipe.servings) > 0)
		dbRecipe.servings = parseInt(recipe.servings);

	if(recipe.prepTime && parseInt(recipe.prepTime) > 0 && (recipe.prepTimeUnit === "minutes" || recipe.prepTimeUnit === "hours")) {
		dbRecipe.prepTime = parseInt(recipe.prepTime);
		dbRecipe.prepTimeUnit = recipe.prepTimeUnit;
	}
	
	dbRecipe._id = recipeID;
	
	Recipe.findOneAndDelete({_id: recipeID}).then((err) => {
		// Handle image, save image name to the database only accept <= 5MB and 1080 width jpeg images
		if(recipe.image.length && recipe.image.length <= 6666666) {
			const path = uuidv4().replace(/-/g, "");
			console.log("Attempting to save image: " + path);
			utils.saveBase64File(recipe.image.replace("data:image/jpeg;base64,", ""), __dirname + "/../recipeImages/"+path+".jpg");
			dbRecipe.images = [path];
			dbRecipe.save(callback);
		} else {
			dbRecipe.save(callback);
		}
	});
	return true;
}

// Get all recipes with a specific owner
module.exports.getRecipesByUserID = (userID, callback) => {
	Recipe.find({owner: userID}, "name").sort("name").then(callback);
}