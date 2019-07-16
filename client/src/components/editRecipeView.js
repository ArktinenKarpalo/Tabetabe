import ViewRecipe from "./viewRecipe.js"
import React from "react";
import SearchView from "./searchView.js";
require("./editRecipeView.css");

export default class editRecipeView extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			ingredients: [{name: "", amount: "", unit: ""}],
			recipeImage: "",
			changeView: this.props.changeView
		}
	}

	changeView = (newView) => {
		this.props.changeView(newView);
	}

	componentDidMount() {
		const xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = () => {
			if(xhttp.readyState === 4 && xhttp.status === 200 && xhttp.responseText) {
				this.setState({recipeData: JSON.parse(xhttp.responseText), ingredients: JSON.parse(xhttp.responseText).ingredients});
			} else if(xhttp.status && xhttp.status !== 200) {
				console.log("Failed to fetch recipe, status " + xhttp.status);
			}
		}
		xhttp.open("GET", "/api/getRecipe/" + this.props.recipeId, true);
		xhttp.send();
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

	removeRecipe = () => {
		if(window.confirm("Delete this recipe?")) {
			const xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = () => {
				if(xhttp.readyState === 4 && xhttp.status === 200 && xhttp.responseText) {
					this.changeView(<SearchView  changeView={this.state.changeView} />);
				} else if(xhttp.status && xhttp.status !== 200) {
					console.log("Failed to remove recipe, status: " + xhttp.status);
				}
			}
			xhttp.open("DELETE", "/api/recipe/" + this.props.recipeId, true);
			xhttp.send();
		}
	}

	submitForm = () => {
		const xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = () => {
			if(xhttp.readyState === 4 && xhttp.status === 200 && xhttp.responseText) {
				this.changeView(React.createElement(ViewRecipe, {recipeId:this.props.recipeId, changeView:this.state.changeView}));
				//this.changeView(<ViewRecipe recipeId={this.props.recipeId} changeView={this.state.changeView}/>);
			} else if(xhttp.status && xhttp.status !== 200) {
				console.log("Failed to fetch recipe, status " + xhttp.status);
			}
		}
		xhttp.open("PUT", "/api/recipe/" + this.props.recipeId, true);
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
		if(this.state.recipeData) {
			if(this.state.recipeData.images.length && !this.state.recipeImage) {
				const img = new Image();
				img.onload = () =>  {
					this.switchImage(img);
				}
				img.src = "recipeImages/"+this.state.recipeData.images[0]+".jpg"
			}
			return (
				<div>
					<form ref={form => this.addRecipeForm = form}>
						<input className="editRecipeView recipename" defaultValue={this.state.recipeData.name} type="text" placeholder="Recipe name (required)" onChange={this.validateForm} name="recipeName"/>
						<div onClick={this.imageOnClick} id="drop_zone" onDrop={this.imageDropHandler} onDragOver={this.imageDragHandler}>
							<img type="file" className="editRecipeView" src={this.state.recipeImage} alt=""></img>
						</div>
						<br/>
						<ul className="editRecipeView" id="ingredientList">
							{this.state.ingredients.map((ingredient, index) => (
								<li key={index} className="editRecipeView">
									<input className="editRecipeView ingredient" type="text" defaultValue={ingredient.name} placeholder="Ingredient" name="ingredient[]"/>
									<input className="editRecipeView amount" type="text" defaultValue={ingredient.amount} placeholder="Amount" name="amount[]"/>
									<select className="editRecipeView" defaultValue={ingredient.unit} name="unit[]">
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
						<button className="editRecipeView" type="button" onClick={this.addIngredientField} >Add ingredient</button>
						<button className="editRecipeView" type="button" onClick={this.removeIngredientField}>Remove ingredient</button>
						<br/>
						<br/>
						<textarea className="editRecipeView" rows="10" cols="50" defaultValue={this.state.recipeData.instructions} name="instructions" placeholder="Instructions (required)" onChange={this.validateForm}></textarea>
						<br/>
						<input className="editRecipeView" defaultValue={this.state.recipeData.tasteRating} type="number" min="0" max="5" placeholder="Taste 0-5 (Optional)" name="tasteRating"/>
						<input className="editRecipeView" defaultValue={this.state.recipeData.priceRating} type="number" min="0" max="5" placeholder="Price 0-5 (Optional)" name="priceRating"/>
						<input className="editRecipeView" defaultValue={this.state.recipeData.servings} type="number" min="0" placeholder="Servings (Optional)" name="servings"/>
						<input className="editRecipeView preptime" defaultValue={this.state.recipeData.prepTime} type="number" min="1" placeholder="Prep time (Optional)" name="prepTime"/>
						<select className="editRecipeView timeUnit" defaultValue={this.state.recipeData.prepTimeUnit} name="prepTimeUnit">
							<option value="minutes">minutes</option>
							<option value="hours">hours</option>
						</select>
						<br/>
					</form>
					<button id="submitBtn" className="editRecipeView"name="submitBtn" onClick={this.submitForm}>Save changes</button>
					<button id="removeBtn" className="editRecipeView"name="removeBtn" onClick={this.removeRecipe}>Remove recipe</button>
				</div>
			);
		} else {
			return <h1>Loading...</h1>
		}
	}
}