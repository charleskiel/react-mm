import React from "react";
import "../App.css";
class Indicator
	extends React.Component {

	state = { className: "" }
	componentDidUpdate(prevProps, prevState, snapshot) {
		
		if (prevProps.indicator != this.props.indicator) {
			switch (this.props.indicator) {
				case true:
					this.setState({ className: "squareIndicator-on" })
					break;
				case false:
					this.setState({ className: "squareIndicator-off" })
					break;
				default:
					this.setState({ className: this.props.type === "square" ? "squareIndicator-on" : "indicator-on" })
					setTimeout(() => { this.setState({ className: this.props.type === "square" ? "squareIndicator-off" : "indicator-off" }), 10000 })
					break;
			}
		}
	}

	render() {
		return (
			<span><span className={this.state.className}></span>{this.props.text}</span>
		);
	}
};

export default Indicator
