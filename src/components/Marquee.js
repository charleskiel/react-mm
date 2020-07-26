import React from "react";
import _ from "lodash";
import "./Marquee.scss";
import "./Indicator.scss";
import StockCard from "./StockCard"
class Marquee extends React.Component {
	listStocks = () => {
		
		if (this.props.watchlists[7]) {
			return this.props.watchlists[7].watchlistItems.map((stock) => {
				return <StockCard setSelectedStock={this.setSelectedStock} key={stock.instrument.symbol} id={stock.instrument.symbol} stock={this.props[stock.instrument.symbol]} />;
			});
		}
	};

	item = () => {
		return <span className="marqueeItem">{this.props.equity.key}</span>;
	}

	render() {


		return (
			<ul class="list-inline" className="list-inline"> {this.props.Marquee}
			</ul>
		);
	}
}


export default Marquee;
