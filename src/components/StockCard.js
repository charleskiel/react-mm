import PriceIndicator from "./PriceIndicator";
import { Card as div , Cascader, Row, Col} from 'antd';
import * as React from 'react';
import * as $ from 'jquery';
import "../App.scss";
import "./StockCard.scss";
import moment from 'moment'
import CanvasJSReact from '../lib/canvasjs.react';
//var CanvasJSReact = require('./canvasjs.react');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

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

	options = {
		animationEnabled: true,
		theme: "dark1",
		width: 400,
		height: 200,
		backgroundColor: "rgba($color: #000000, $alpha: .0);",
		axisX:{
			valueFormatString: "DD MMM",
			crosshair: {
				enabled: true,
				snapToDataPoint: true
			}
		},
		axisY: {
			minimum : this.props.stock[13],
			maximum : this.props.stock[12],
			crosshair: {
				enabled: true,
				snapToDataPoint: true,
				
			}
		},
		data: [{
			type: "line",
			lineThickness: 1,
			xValueFormatString: "DD MMM",
			yValueFormatString: "$##0.00",
			dataPoints: [...this.props.stock.spark.map(tick => {
				return {x: new Date(tick[7]) ,y: tick[3] }
				})
			]
		}]
	}
	
	backgroundcolor = () => {
		// if (this.props.stock.key === "SPY" ) console.log("last", this.props.stock["3"]);
		// if (this.props.stock.key === "SPY" ) console.log("last - open" ,this.props.stock["3"] - this.props.stock["28"]);
		// if (this.props.stock.key === "SPY" ) console.log(this.props.stock["3"] - this.props.stock["29"]);
		//return { color: `rgb(${128 * (this.props.stock["3"] - this.props.stock["29"])}, 64, 64) ` };
		return { color: `rgb(128, 64, 64) `};
	}

	render() {
		//if(!this.props.id) console.log(this.props)
		//console.log(this.props)
		return (
			<tr className="stockCard">
				<background style={this.backgroundcolor()}>{this.props.stock.key}</background>
				<div className="chart" style={this.backgroundcolor()}>
					<CanvasJSChart options = {this.options} 
					/* onRef={ref => this.chart = ref} */
					/>
				</div>
					<tr>
						<span className="description">{this.props.stock[25] ? this.props.stock[25].replace(" - Common Stock", "") : this.props.stock.key}</span>
					</tr>
				<tr className="top">

					<tr className="stats">
						<td className="bigStat">
							{<PriceIndicator price={this.props.stock["3"]} />}
						</td>
						<td className="details" >
							<tr>
								<td>Bid: {<PriceIndicator price={this.props.stock["1"]} />}</td>
							</tr>

							<tr>
								<td>Ask: {<PriceIndicator price={this.props.stock["1"]} />}</td>
							</tr>

							<tr>
								<td>Volume: {<PriceIndicator price={this.props.stock["8"]} />}</td>
							</tr>
						</td>
					</tr>
				</tr>
				
				<tr className="bottom">
					<tr className="info">
						{this.exchange()}
						<sendto>
							<sendto1 onClick={() => this.props.commands.sendto(1)}>-</sendto1>
							<sendto2 onClick={() => this.props.commands.sendto(2)}>-</sendto2>
							<sendto3 onClick={() => this.props.commands.sendto(3)}>-</sendto3>
							<sendto4 onClick={() => this.props.commands.sendto(4)}>-</sendto4>
						</sendto>
					</tr>
				</tr>
			</tr>
		);
	}
}
