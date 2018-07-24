import ViewRecipe from "./viewRecipe.js"
import React from "react";
//const ViewRecipe = require("./viewRecipe.js");
require("./addRecipeView.css");

export default class addRecipeView extends React.Component {
		
	constructor(props) {
		super(props)
		this.state = {
			recipeImage: "",
			ingredients: [{name: "", amount: "", unit: ""}],
			changeView: this.props.changeView
		}
	}

	changeView = (newView) => {
		this.props.changeView(newView);
	}

	addIngredientField = () => {
		this.setState({ingredients: [...this.state.ingredients, {name: "", amount: "", unit: ""}]});
	}

	removeIngredientField = () => {
		if(this.state.ingredients.length > 1) {
			const newArray = [...this.state.ingredients];
			newArray.pop();
			this.setState({ingredients: newArray});
		}
	}

	validateForm = () => {
		const form = this.addRecipeForm;
		let valid = true;
		if(!form.recipeName.value)
			valid = false;
		if(!form.instructions.value)
			valid = false;
		if(valid) {
		} else {
		}
	}

	submitForm = () => {
		const xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = () => {
			if(xhttp.readyState === 4 && xhttp.status === 200 && xhttp.responseText) {
				this.changeView(<ViewRecipe recipeId={JSON.parse(xhttp.responseText)} changeView={this.state.changeView}/>);
			} else if(xhttp.status && xhttp.status !== 200) {
				console.log("Failed to submit recipe! Status: " + xhttp.status);
			}
		}
		xhttp.open("POST", "/api/recipe", true);
		xhttp.setRequestHeader("Content-Type", "text/plain");
		const obj = {
			"recipeName": "",
			"prepTime": "",
			"prepTimeUnit": "",
			"tasteRating": "",
			"priceRating": "",
			"servings": "",
			"ingredients": [],
			"instructions": "",
			"image": this.state.recipeImage
		}
		const form = this.addRecipeForm;
		obj.recipeName = form.recipeName.value;
		obj.prepTime = form.prepTime.value;
		obj.tasteRating = form.tasteRating.value;
		obj.priceRating = form.priceRating.value;
		obj.servings = form.servings.value;
		obj.instructions = form.instructions.value;
		obj.prepTimeUnit = form.prepTimeUnit.value;
		document.getElementById("ingredientList").childNodes.forEach((child) => {
			const ingredient = {
				"name": "",
				"amount": "",
				"type": ""
			}
			ingredient.name = child.childNodes[0].value;
			ingredient.amount = child.childNodes[1].value;
			ingredient.type = child.childNodes[2].value;
			obj.ingredients.push(ingredient);
		});
		xhttp.send(JSON.stringify(obj));
	}

	imageDropHandler = (event) => {
		event.preventDefault();
		if(event.dataTransfer.files.length === 1) {
			if(event.dataTransfer.files[0].type === "image/png" || event.dataTransfer.files[0].type === "image/jpg" || event.dataTransfer.files[0].type === "image/jpeg") {
				const reader = new FileReader();
				reader.onload = (file) => {
					const img = new Image();
					img.onload = () => {
						this.switchImage(img);
					}
					img.src = reader.result;
				}
				reader.readAsDataURL(event.dataTransfer.files[0]);
			}
		}
	}

	switchImage = (img) => {
		const canvas = document.createElement("canvas");
		canvas.width = 1080;
		canvas.height = 1080/img.width*img.height;
		const ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, 1080, 1080/img.width*img.height);
		this.setState({recipeImage: canvas.toDataURL("image/jpeg")});
	}

	imageDragHandler = (event) => {
		event.preventDefault();
	}

	imageOnClick = (event) => {
		const fileInput = document.createElement("input");
		fileInput.setAttribute("type", "file");
		fileInput.addEventListener("change", () => {
			if(fileInput.files.length === 1) {
			if(fileInput.files[0].type.match("image/*")) {
				const reader = new FileReader();
				reader.onload = (file) => {
					const img = new Image();
					img.onload = () => {
						this.switchImage(img);
					}
					img.src = reader.result;
				}
				reader.readAsDataURL(fileInput.files[0]);
			}
		}
		});
		fileInput.click();	
	}

	render() {
		return (
			<div>
				<form ref={form => this.addRecipeForm = form}>
					<input className="addRecipeView recipename" type="text" placeholder="Recipe name (required)" onChange={this.validateForm} name="recipeName"/>
					<legend>Image</legend>
					<div onClick={this.imageOnClick} id="drop_zone" onDrop={this.imageDropHandler} onDragOver={this.imageDragHandler}>
						<img type="file" className="addRecipeView" src={this.state.recipeImage} alt=""></img>
					</div>
					<br/>
					<ul className="addRecipeView" id="ingredientList">
						{this.state.ingredients.map((ingredient, index) => (
							<li key={index} className="addRecipeView">
								<input className="addRecipeView ingredient" type="text" defaultValue={ingredient.name} placeholder="Ingredient" name="ingredient[]"/>
								<input className="addRecipeView amount" type="text" defaultValue={ingredient.amount} placeholder="Amount" name="amount[]"/>
								<select className="addRecipeView" defaultValue={ingredient.unit} name="unit[]">
									<option value="g">g</option>
									<option value="kg">kg</option>
									<option value="ml">ml</option>
									<option value="tsp">tsp</option>
									<option value="tbsp">tbsp</option>
									<option value="dl">dl</option>
									<option value="l">l</option>
									<option value="pinch">pinch</option>
									<option value="pieces">pieces</option>
									<option value="-">-</option>
								</select>
							</li>
						))}
					</ul>
					<button className="addRecipeView" type="button" onClick={this.addIngredientField} >Add ingredient</button>
					<button className="addRecipeView" type="button" onClick={this.removeIngredientField}>Remove ingredient</button>
					<br/>
					<br/>
					<textarea className="addRecipeView" rows="10" cols="50" name="instructions" placeholder="Instructions (required)" onChange={this.validateForm}></textarea>
					<br/>
					<input className="addRecipeView" type="number" min="0" max="5" placeholder="Taste 0-5 (Optional)" name="tasteRating"/>
					<input className="addRecipeView" type="number" min="0" max="5" placeholder="Price 0-5 (Optional)" name="priceRating"/>
					<input className="addRecipeView" type="number" min="0" placeholder="Servings (Optional)" name="servings"/>
					<input className="addRecipeView preptime" type="number" min="1" placeholder="Prep time (Optional)" name="prepTime"/>
					<select className="addRecipeView timeUnit" name="prepTimeUnit">
						<option value="minutes">minutes</option>
						<option value="hours">hours</option>
					</select>
					<br/>
				</form>
				<button className="addRecipeView" id="submitBtn" name="submitBtn" onClick={this.submitForm}>Add recipe</button>
			</div>
		);
	}
}