import React from "react";
import "./Indicator.scss";
import currency from  "currency.js";

class PriceIndicator extends React.Component {
	state = { className: "same" };

	componentDidUpdate(prevProps, prevState, snapshot) {
		if ((prevProps.price !== this.props.price) || (prevProps.commandKeyStatus!== this.props.commandKeyStatus)) {
			if (prevProps.price < this.props.price) {
				this.setState({ className: "up-on" });
				//if (!this.props.startPrice) setTimeout(() => this.setState({ className: "up" }), 100);
			} else if (prevProps.price > this.props.price) {
				this.setState({ className: "down-on" });
				//if (!this.props.startPrice) setTimeout(() => this.setState({ className: "down" }), 100);
			} else {
				this.setState({ className: "same-on" });
				//if (!this.props.startPrice) setTimeout(() => this.setState({ className: "same" }), 100);
			}



			if (this.props.startPrice) {
				if (this.props.startPrice < this.props.price) {
					setTimeout(() => this.setState({ className: "down" }), 100);
				} else if (this.props.startPrice > this.props.price) {
					setTimeout(() => this.setState({ className: "up" }), 100);
				} else {
					setTimeout(() => this.setState({ className: "same" }), 100);
				}

			}
			else
			{
				if (prevProps.price < this.props.price) {
					setTimeout(() => this.setState({ className: "down" }), 100);
				} else if (prevProps.price > this.props.price) {
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
		if (!this.props.masking || this.props.commandKeyStatus === "granted"){
			if (this.props.startPrice) {
				return currency(this.props.price - this.props.startPrice).format()
			}
			else {
				return currency(this.props.price).format()
			}
		}else{
			if (this.props.startPrice) {
				return `$${"*".repeat(this.props.price - this.props.startPrice).toString().length }`
			}
			else {
				return `$${"*".repeat((this.props.price).toString().length) }`
			}
		}
	}
	render() {
		return (
			<span className={this.state.className}> {this.price()}</span>
		);
	}
}

export default PriceIndicator;
