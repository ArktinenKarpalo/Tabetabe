const express = require("express");
const router = express.Router();
const authentication = require("./../authentication.js");
const database = require("./../database.js")
const mongoose = require("mongoose");

// Add a new recipe
router.post("/recipe", (req, res) => {
	if(!req.body)
		return res.sendStatus(400);
	if(!authentication.isLoggedIn(req))
		return res.sendStatus(401);
	callback = (err, recipe) => {
		if(err)
			throw err;
		res.set("Content-Type", "routerlication/json");
		res.status(200).send(JSON.stringify(recipe._id));
	};
	database.addRecipe(req.user.id, JSON.parse(req.body), callback);
});

// Delete the recipe
router.delete("/recipe/:id", (req, res) => {
	if(!authentication.isLoggedIn(req))
		res.sendStatus(401);
	callback = (recipe) => {
		if(recipe.owner === req.user.id) {
			callback2 = () => {
				res.sendStatus(200);
			}
			database.deleteRecipeByID(req.params.id, callback2);
		} else {
			res.sendStatus(401);
		}
	};
	database.findRecipeByID(req.params.id, callback);
});

// Replace an existing recipe
router.put("/recipe/:id", (req, res) => {
	if(!req.body)
		res.sendStatus(400);
	if(!authentication.isLoggedIn(req))
		res.sendStatus(401);
		callback = (recipe)=> {
			if(recipe.owner === req.user.id) {
				callback = () => {
					res.sendStatus(200);
				}
				database.editRecipe(req.params.id, req.user.id, JSON.parse(req.body), callback);
			} else {
				res.sendStatus(401);
			}
		};
	database.findRecipeByID(req.params.id, callback);
});

// Get an existing recipe
router.get("/getRecipe/:id", (req, res) => {
	res.set("Content-Type", "routerlication/json");
	callback = (recipe) => {
		if(recipe.owner === req.user.id)
			res.status(200).send(JSON.stringify(recipe))
		else
			res.sendStatus(401);
	}
	err = (err) => {
		console.log(err);
		res.status(404).send("Recipe with id: " + req.params.id + " not found!");
	}
	database.findRecipeByID(req.params.id, callback, err);
});

// Copy recipe with id to current user
router.get("/shareRecipe/:id", (req, res) => {
	if(!authentication.isLoggedIn(req)) {
		return res.status(401).send("Please log in first");
	}
	callback = (recipe) => {
		var newRecipe = recipe;
		newRecipe.owner = req.user.id;
		newRecipe._id = mongoose.Types.ObjectId();
		newRecipe.isNew = true;
		newRecipe.save((err) => {
			if(err) {
				console.log(err);
				return res.status(500).send("Error while saving the recipe!");
			}
			res.status(200).send("Recipe succesfully added to the user!")}
		);
	}
	err = (error) => {
		res.status(404).send("Recipe with ID: " + req.params.id + " not found!");
		console.log(error);
	}
	database.findRecipeByID(req.params.id, callback, err);
});

// Returns names and id's of the correspoding user's recipes
router.get("/recipe", (req, res) => {
	if(!authentication.isLoggedIn(req)) {
		return res.sendStatus(401);
	}
	res.set("Content-Type", "routerlication/json");
	callback = (recipes) => {
		res.status(200).send(JSON.stringify(recipes));
	}
	database.getRecipesByUserID(req.user.id, callback);
});

module.exports = router;