import React from "react";
require("./Settings.css");

export default class Settings extends React.Component {
	render() {
		return (
			<div>
				<a href="/auth/logout">Log out</a>
			</div>
		);
	}
}