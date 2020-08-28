import "./Dashboard.scss";
import * as React from "react";
import {Badge, Tabs, Layout} from "antd";
import StockCard from "../StockCard";
import currency from "currency.js";
import PriceIndicator from "../PriceIndicator";
import _ from "lodash";
import { UserOutlined, LaptopOutlined, NotificationOutlined } from "@ant-design/icons";
import moment from "moment";
import "../../../node_modules/react-vis/dist/style.css";
import { XYPlot, LineSeries } from "react-vis";

const { TabPane } = Tabs;
const { Content} = Layout;
//{currency().format()}
export default class Home extends React.Component {
	state = {
		data : [

		]
	};
	componentDidMount = () => {
		this.getdata()
		setInterval(this.getdata, 2000)
	}

	getdata = () => {
		fetch("https://charleskiel.dev:8000/accountData", {
			method: "GET",
			//mode: 'cors',
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then((response) => response.json())
		.then(response => {
			this.setState({data : response})
			console.log(response)
			this.forceUpdate()
		})
	}
	positions = (positions) => {

		return positions.map(pos => {
			//console.log(pos)
			return (
				<tr>
					<td>
						<position>{pos.shortQuantity > 0 ? <span className="short">- {pos.shortQuantity} </span> : <span className="long">+ {pos.longQuantity}</span>}</position>
					</td>

					{pos.instrument.assetType === "OPTION" ? <td>{pos.instrument.underlyingSymbol}</td> : <td>{pos.instrument.symbol}</td>}

					<td>{pos.instrument.assetType}</td>
					{pos.instrument.assetType === "OPTION" ? <td>{pos.instrument.description} </td> : <td>{this.props[pos.instrument.symbol][25]}</td>}

					<td className="plPc">{currency(pos.currentDayProfitLossPercentage * 100).value}%</td>
					<td className="pl">{currency(pos.currentDayProfitLoss).format()}</td>
					{/* <td className="mkvalue" >{currency(pos.marketValue).format()}</td> */}
					<td className="mkvalue" ><PriceIndicator price={pos.marketValue} masking={this.props.masking} /></td>
				</tr>
			);
		})

	}

	lineChart = () => {
		return (
		<XYPlot height={200} width={400}>
			<LineSeries 
			data={this.state.data.liquidationValue}
			strokeWidth={1}
			curve="curveBasis"
			/>
			{/* <LineSeries 
			data={this.state.data.longMarginValue}
			strokeWidth={1}
			color={"red"}
			/>
			 */}
		</XYPlot>
	);
	   }


	render() {
		//console.log(this.props);
		return (
			<Layout className="Home">
				<h2>Dashboard</h2>
				
				{this.lineChart(this.state.data)}
				<Tabs className="activesTabs" defaultActiveKey="1" tabPosition={"left"}>

					{ ["NYSE","NASDAQ","OTCBB"].map(active => {
					return <TabPane tab={active} key={active} >
						<h4>Most active {active} </h4>
						<Tabs className="activesTabs" defaultActiveKey="0" tabPosition="top">
						{_.values(this.props.actives["ACTIVES_" + active]).map((act) => {
								return (


									<TabPane tab={`${act.sampleDuration / 60}min`} key={`${act.sampleDuration / 60}min`} >
										<small>({act.sampleDuration / 60}min)</small>
										<table style={{ fontSize: "10px", width: "400px" }}>
											<tr>
												<th>Symbol</th>
												<th>Volume</th>
												<th>Price Chng</th>
											</tr>
											{act.groups.map((pos) => {
												return (
													<tr>
														<td>
														{this.props[pos.symbol] ? "+" : "-"}
														{pos.symbol}
														</td>
														<td>{pos.volume}</td>
														<td>{pos.priceChange}</td>
													</tr>
												);
											})}
										</table>
									</TabPane>
								);
							})}
						</Tabs>
					</TabPane>
					})
					}
					<TabPane tab={`ACTIVES_OPTIONS`} key={"ACTIVES_OPTIONS"}>
					<h4>Most active options </h4>
						
					<Tabs className="activesTabs" defaultActiveKey="0" tabPosition="top">
						{_.values(this.props.actives.ACTIVES_OPTIONS).map((act) => {
							return (
								<TabPane tab={`${act.sampleDuration / 60}min`} key={act.sampleDuration} >
									<small>({act.sampleDuration / 60}min)</small>
									
									<table>
										<tr>
											<th>Symbol</th>
											<th>Name</th>
											<th>Volume</th>
											<th>Price Chng</th>
										</tr>
										{act.groups.map((pos) => {
											return (
													<tr>
														<td>
															{this.props[pos.name] ? "+" : "-"}
															{pos.symbol}</td>
														<td>{pos.name}</td>
														<td>{pos.volume}</td>
														<td>{pos.priceChange}</td>
													</tr>
											)
										})}
									</table>
								</TabPane>
							);
						})}
					</Tabs>
					</TabPane>
				</Tabs>
			</Layout>
		)
	}
}