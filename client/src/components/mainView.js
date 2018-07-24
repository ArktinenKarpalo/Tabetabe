import React from "react";
require("./mainView.css");

export default class mainView extends React.Component {
	render() {
		return (
			<div>
				<h1>Welcome!</h1>
				<p>This site provides a place to store all of your recipes.</p>
				<p>Current features include at least the following:</p>
				<ul>
					<li>Adding new recipes</li>
					<li>Viewing existing recipes</li>
					<li>Searching existing recipes</li>
					<li>Editing existing recipes</li>
				</ul>
			</div>
		);
	}
}