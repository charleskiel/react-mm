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
		console.log(this.props.stock["16"]);
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

	render() {
		//console.log(this.props.key)
		//if(this.props.id === "TSLA") console.log(this.props)
		//if(!this.props.id) console.log(this.props)
		//console.log(this.props)
		return (
			<div className="stockCard">
				<div className="background">
					{this.props.stock.key}
				</div>

				<div className="description">{this.props.stock[25] ? this.props.stock[25].replace(" - Common Stock", "") : this.props.stock.key}</div>
				{() => this.exchange}
				<Row>
					<Col flex={2}><h3>{<PriceIndicator indicator={this.props.stock["3"]} />}</h3></Col>
					<Col flex={1}><h3>{<PriceIndicator indicator={this.props.stock["29"]} />}</h3></Col>
				</Row>
				<Row>
					<Col flex={1}>Bid: {<PriceIndicator indicator={this.props.stock["1"]} />} </Col>
					<Col flex={1}>Ask: {<PriceIndicator indicator={this.props.stock["2"]} />} </Col>
				</Row>
				<Row>
					<Col flex={1}>Vol: {this.props.stock["8"]}</Col>
					<Col flex={1}>{this.props.stock["14"]}</Col>
				</Row>
			</div>
		);
	}
}
