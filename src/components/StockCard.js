import PriceIndicator from "./PriceIndicator";
import { Card as div , Cascader, Row, Col} from 'antd';
import * as React from 'react';
import * as $ from 'jquery';
import "../App.scss";
import "./StockCard.scss";


export default class StockCard
	extends React.Component {
	state = {
		data: [],
		plColor : "darkgrey"
	};
	options = [
		{
			value: 'zhejiang',
			label: 'Zhejiang',
			children: [
			{
				value: 'hangzhou',
				label: 'Hangzhou',
			},
			],
		},
		{
			value: 'jiangsu',
			label: 'Jiangsu',
			children: [
			{
				value: 'nanjing',
				label: 'Nanjing',
			},
			],
		},
	];
    	cas = () => {
	    return <Cascader options={this.options} onChange={this.onChange}>
		<a href="#">{this.props.id}</a>
		</Cascader>
	}
	
	exchange = () => {
		//console.log(this.props.stock["16"]);
		switch (this.props.stock["16"]) {
			
			case "n" :
				return (<span>NYSE</span>)
			case "a" :
				return (<span>AMEX</span>)
			case "q" :
				return (<span>NASDAQ</span>)
			case "u" :
				return (<span>OTCBB</span>)
			case "p" :
				return (<span>PACIFIC</span>)
			case "x" :
				return (<span>INDICES</span>)
			case "g" :
				return (<span>AMEX_INDEX</span>)
			case "m" :
				return (<span>MUTUAL_FUND</span>)
			case "9" :
				return (<span>PINK_SHEET</span>)
			default:
				return (<span>jj</span>)
		}
	}

	backgroundcolor = () => {
		// if (this.props.stock.key === "SPY" ) console.log("last", this.props.stock["3"]);
		// if (this.props.stock.key === "SPY" ) console.log("last - open" ,this.props.stock["3"] - this.props.stock["28"]);
		// if (this.props.stock.key === "SPY" ) console.log(this.props.stock["3"] - this.props.stock["29"]);
		return { color: `rgb(${128 * (this.props.stock["3"] - this.props.stock["29"])}, 64, 64) ` };
	}

	render() {
		//console.log(this.props.key)
		//if(this.props.id === "TSLA") console.log(this.props)
		//if(!this.props.id) console.log(this.props)
		//console.log(this.props)
		return (
			<div className="stockCard">
				<background style={this.backgroundcolor()}>{this.props.stock.key}</background>
				<div className="top">
					<div className="description">
						<span>{this.props.stock[25] ? this.props.stock[25].replace(" - Common Stock", "") : this.props.stock.key}</span>
					</div>

					<Row>
						<Col span={10} className="bigStat">
							{<PriceIndicator price={this.props.stock["3"]} />}
						</Col>
						<Col span={14}><div className="details">
							<Row>
								<Col span={6}>Bid: {<PriceIndicator price={this.props.stock["1"]} />}</Col>
							</Row>

							<Row>
								<Col span={6}>Ask: {<PriceIndicator price={this.props.stock["1"]} />}</Col>
							</Row>

							<Row>
								<Col span={12}>Volume: {<PriceIndicator price={this.props.stock["8"]} />}</Col>
							</Row>
							</div>
						</Col>
					</Row>
				</div>
				<div className="bottom">
					<div className="info">
						{this.exchange()}
						<sendTo>
							<sendTo1 onClick={() => this.props.commands.sendTo(1)}>-</sendTo1>
							<sendTo2 onClick={() => this.props.commands.sendTo(2)}>-</sendTo2>
							<sendTo3 onClick={() => this.props.commands.sendTo(3)}>-</sendTo3>
							<sendTo4 onClick={() => this.props.commands.sendTo(4)}>-</sendTo4>
						</sendTo>
					</div>
				</div>
			</div>
		);
	}
}
