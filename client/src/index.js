import React from "react";
import ReactDOM from "react-dom";
import Navbar from "./components/Navbar.js";
import MainView from "./components/mainView.js";

export default class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			view: <MainView />
		}
	}

	view = () => {
		return this.state.view;
	}

	changeView = (newView) => {
		this.setState({view: newView});
	}

	render() {
		return (
			<div className="App">
				<div id="logo">
					<img src="img/logo.png"></img>
				</div>
				<div id="main">
					<Navbar changeView={this.changeView.bind(this)}/>
					{this.state.view}
				</div>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("root"));