import React from "react";
import Settings from "./Settings.js";
import MainView from "./mainView.js";
import AddRecipeView from "./addRecipeView.js";
import SearchView from "./searchView.js";
require("./Navbar.css");

export default class Navbar extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			changeView: this.props.changeView
		}
	}

	changeView = (newView) => {
		this.props.changeView(newView);
	}

	render() {
		return (
			<nav className="navbar">
				<ul className="navbar">
					<li className="navbar"><button onClick={(newState) => this.changeView(<MainView/>)} >Home</button></li>
					<li className="navbar"><button onClick={(newState) => this.changeView(<SearchView changeView={this.state.changeView}/>)}>Search</button></li>
					<li className="navbar"><button onClick={(newState) => this.changeView(<AddRecipeView changeView={this.state.changeView}/>)}>Add recipe</button></li>
					<li className="navbar"><button onClick={(newState) => this.changeView(<Settings/>)}>Account</button></li>
				</ul>
			</nav>
		);
	}
}