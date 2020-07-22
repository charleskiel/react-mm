import React from "react";
import "./Indicator.scss";
class PriceIndicator extends React.Component {
	state = { className: "" };

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.indicator !== this.props.indicator) {
			if (prevProps.indicator < this.props.indicator) {
				this.setState({ className: "up-on" });
				setTimeout(() => this.setState({ className: "up" }), 100);
			} else if (prevProps.indicator > this.props.indicator) {
				this.setState({ className: "down-on" });
				setTimeout(() => this.setState({ className: "down" }), 100);
			} else {
				this.setState({ className: "same-on" });
				setTimeout(() => this.setState({ className: "same" }), 100);
			}
		}
		
	}

	componentDidMount() {
		this.setState({ className: "same-on" });
		setTimeout(() => this.setState({ className: "same" }), 500);
	}
	


	set = (state) => {
		
				this.setState({ className: state });
	}

	render() {
		return (
			<span className={this.state.className}>{this.props.indicator}</span>
		);
	}
}

export default PriceIndicator;
