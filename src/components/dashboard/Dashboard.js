//import "./Dashboard.scss";
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
export default class Dashboard extends React.Component {
	state = {
		data : []
	};

componentWillMount(){
		this.props.functions.subscribe("Dashboard")
	}
	componentDidMount = () => {
		console.log("Loading Dashboard")
		console.log(this.props)
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
			<Layout className="Dashboard">
				<h2>Dashboard</h2>
				
				{/* {this.lineChart(this.state.data)} */}
				<Tabs className="activesTabs" defaultActiveKey="1" tabPosition={"left"}>

					{ ["NYSE","NASDAQ","OTCBB"].map(active => {
					return <TabPane tab={active} key={active} >
						<h4>Most active {active} </h4>
						<Tabs className="activesTabs" defaultActiveKey="0" tabPosition="top">
						{_.values(this.props.state.actives["ACTIVES_" + active]).map((act) => {
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
														{this.props.state.subStocks[pos.symbol] ? "+" : "-"}
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
						{_.values(this.props.state.actives.ACTIVES_OPTIONS).map((act) => {
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
															{this.props.state.subStocks[pos.name] ? "+" : "-"}
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