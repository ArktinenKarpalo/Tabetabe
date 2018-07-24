import React from "react";
import EditRecipeView from "./editRecipeView.js";
require("./viewRecipe.css");

export default class viewRecipe extends React.Component {
	
	constructor(props) {
		super(props)
		this.state = {
			ingredients: [{name: "", amount: "", unit: ""}],
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
				this.setState({recipeData: JSON.parse(xhttp.responseText)});
			} else if(xhttp.status && xhttp.status !== 200) {
				console.log("Failed to fetch recipe, status " + xhttp.status);
			}
		}
		xhttp.open("GET", "/api/getRecipe/" + this.props.recipeId, true);
		xhttp.send();
	}

	componentWillReceiveProps(props) {
		const xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = () => {
			if(xhttp.readyState === 4 && xhttp.status === 200 && xhttp.responseText) {
				this.setState({recipeData: JSON.parse(xhttp.responseText)});
			} else if(xhttp.status && xhttp.status !== 200) {
				console.log("Failed to fetch recipe, status " + xhttp.status);
			}
		}
		xhttp.open("GET", "/api/getRecipe/" + props.recipeId, true);
		xhttp.send();
	}

	getImage = () => {
		if(this.state.recipeData.images.length)
			return this.state.recipeData.images[0];
	}

	infoBar = () =>  {
		let ret = "";
		if(this.state.recipeData.prepTime) {
			if(ret)
				ret = ret + " | ";
			ret = ret + "Preparation time: " + this.state.recipeData.prepTime + " " +  this.state.recipeData.prepTimeUnit;
		}
		if(this.state.recipeData.servings) {
			if(ret)
				ret = ret + " | ";
			ret = ret + "Servings: " + this.state.recipeData.servings;
		}
		if(this.state.recipeData.tasteRating) {
			if(ret)
				ret = ret + " | ";
			ret = ret + "Taste: " + this.state.recipeData.tasteRating + "/5";
		}
		if(this.state.recipeData.priceRating) {
			if(ret)
				ret = ret + " | ";
			ret = ret + "Affordability: " + this.state.recipeData.priceRating + "/5"
		}
		return <i>{ret}</i>;
	}

	editRecipe = () => {
		this.setState({edit: true});
	}

	renderRecipe = () => {
		if(this.state.recipeData) {
			return (
				<div>
					<div id="imageBox">
						<h1 id="recipeName">{this.state.recipeData.name}</h1>
						<button id="editBtn" onClick={() => this.changeView(<EditRecipeView recipeId={this.state.recipeData._id} changeView={this.state.changeView}/>)}>Edit</button>
						<br/>
						<img className="recipeImage" src={"recipeImages/"+this.getImage()+".jpg"} alt=""></img>
						<br/>
						{this.infoBar()}
					</div>
					<table className="ingredientList">
						<thead>
							<tr className="ingredientList">
								<th className="ingredientList">Ingredient</th>
								<th className="ingredientList">Amount</th>
								<th className="ingredientList">Unit</th>
							</tr>
						</thead>
						<tbody>
							{this.state.recipeData.ingredients.map((ingredient) => (
							<tr className="ingredientList">
								<td className="ingredientList" id="ingredientListName">{ingredient.name}</td>
								<td className="ingredientList" id="ingredientListAmount">{ingredient.amount}</td>
								<td className="ingredientList" id="ingredientListUnit">{ingredient.unit}</td>
							</tr>
							))}
						</tbody>
					</table>
					<div id="recipeInstructions">
						{this.state.recipeData.instructions.split("\n").map((text) => <p>{text}</p>)}
					</div>
				</div>
			);
		} else {
			return <h1>Loading...</h1>
		}
	}

	render() {

		return (
			<div>
				{this.renderRecipe()}
			</div>
		);
	}
}