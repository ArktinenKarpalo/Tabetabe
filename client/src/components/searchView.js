import ViewRecipe from "./viewRecipe.js"
import React from "react";
require("./searchView.css");

export default class searchView extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			currentRecipeID : "",
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
				this.setState({recipeList: JSON.parse(xhttp.responseText)});
			} else if(xhttp.status && xhttp.status !== 200) {
				console.log("Failed to fetch recipes, status " + xhttp.status);
			}
		}
		xhttp.open("GET", "/api/recipe", true);
		xhttp.send();
	}

	componentWillReceiveProps(props) {
		this.setState({currentRecipeID: ""});
	}

	selectRecipe = (event) =>  {
		this.changeView(<ViewRecipe recipeId={event.target.dataset.id} changeView={this.state.changeView}/>);
	}

	setFilter = (event) => {
		if(event.target.value)
			this.setState({filterWord: event.target.value.toLowerCase()});
		else
			this.setState({filterWord: ""})
	}

	render() {
		if(this.state.recipeList) {
			return (
				<div>
					<input type="search" onChange={this.setFilter} placeholder="Search by name"></input>
					<table className="recipeList">
						<thead>
							<tr>
								<th className="recipeList">Name</th>
							</tr>
						</thead>
						<tbody>
						{this.state.recipeList.map((item) => {
							if(!this.state.filterWord || this.state.filterWord.length === 0 || item.name.toLowerCase().includes(this.state.filterWord))
								return (
								<tr key={item._id}>
									<td className="recipeList" key={item._id}><button className="recipeList" key={item._id} data-id={item._id} onClick={this.selectRecipe} href="#">{item.name}</button></td>
								</tr>
								)
							else
								return "";
							})}
						</tbody>
					</table>
				</div>
			)
		} else {
			return <h1>Loading...</h1>
		}
	}
}