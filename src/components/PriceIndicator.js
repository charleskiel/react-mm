import React from "react";
import "./Indicator.scss";
import currency from  "currency.js";
class PriceIndicator extends React.Component {
	state = { className: "" };

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.price !== this.props.price) {
			if (prevProps.price < this.props.price) {
				this.setState({ className: "up-on" });
				if (!this.props.startPrice) setTimeout(() => this.setState({ className: "up" }), 100);
			} else if (prevProps.price > this.props.price) {
				this.setState({ className: "down-on" });
				if (!this.props.startPrice) setTimeout(() => this.setState({ className: "down" }), 100);
			} else {
				this.setState({ className: "same-on" });
				if (!this.props.startPrice) setTimeout(() => this.setState({ className: "same" }), 100);
			}



			if (this.props.startPrice) {
				if (prevProps.startPrice < this.props.price) {
					setTimeout(() => this.setState({ className: "down" }), 100);
				} else if (prevProps.startPrice > this.props.price) {
					setTimeout(() => this.setState({ className: "up" }), 100);
				} else {
					setTimeout(() => this.setState({ className: "same" }), 100);
				}

			}

					
					
		}
		
	}

	componentDidMount() {
		this.setState({ className: "same-on" });
		setTimeout(() => this.setState({ className: "same" }), 500);
	}
	
	price = () => {
		if (this.props.startPrice) {
			
			return this.props.price - this.props.startPrice
		}
		else {
			return this.props.price 
			
		}
	}
	render() {
		return (
			<span className={this.state.className}> {currency(this.price()).format()}</span>
		);
	}
}

export default PriceIndicator;
