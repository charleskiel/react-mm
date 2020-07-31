import * as React from "react";
import { Layout, Menu} from "antd";
import StockCard from "./StockCard";
import "./Dashboard.scss"
import _ from "lodash";
import { UserOutlined, LaptopOutlined, NotificationOutlined } from "@ant-design/icons";
import moment from "moment";
const { SubMenu } = Menu;
const { Content, Sider } = Layout;

export default class Dashboard extends React.Component {
	state = {
		data: [],
	};
	showcard = () => {
		return <StockCard stock={this.props.stocks.SPY}/>
	}
	render() {
		//console.log(this.props);
		return (
			<Layout>
				<Sider width={200} className="site-layout-background">
					<Menu mode="inline" defaultSelectedKeys={["1"]} defaultOpenKeys={["watchlists"]} style={{ height: "100%", borderRight: 0 }}>
						<SubMenu
							key="watchlists"
							title={
								<span>
									<UserOutlined />
									Menu 1
								</span>
							}
						>
							{_.values(this.state.watchlists).map((list) => (
								<Menu.Item key={list.watchlistId} onClick={() => this.setSelectedWatchlist(list.watchlistId)}>
									{list.name}
								</Menu.Item>
							))}
						</SubMenu>
						<SubMenu
							key="sub2"
							title={
								<span>
									<LaptopOutlined />
									subnav 2
								</span>
							}
						>
							<Menu.Item key="5">Activities</Menu.Item>
							<Menu.Item key="6">option6</Menu.Item>
							<Menu.Item key="7">option7</Menu.Item>
							<Menu.Item key="8">option8</Menu.Item>
						</SubMenu>
						
						<SubMenu
							key="sub3"
							title={
								<span>
									<NotificationOutlined />
									subnav 3
								</span>
							}
						>
							<Menu.Item key="9">option9</Menu.Item>
							<Menu.Item key="10">option10</Menu.Item>
							<Menu.Item key="11">option11</Menu.Item>
							<Menu.Item key="12">option12</Menu.Item>
						</SubMenu>
					</Menu>
				</Sider>
				<Layout className="dashboard">
					<h1>DASHBOARD</h1>
					{this.props.app && (
						<table>
							<tr span={6}>
								<td style={{ verticalAlign: "top" }}>
									<h1>Account Status</h1>
									<h4>Current Balance</h4>: {this.props.app.account[0].securitiesAccount.currentBalances.liquidationValue}
									<h4>Initial Balance</h4>:
									
									{this.props.app.account[0].securitiesAccount.positions.map((pos) => {
										// return <StockCard 
										// 	setSelectedStock={this.setSelectedStock} 
										// 	key={pos.instrument.symbol}
										// 	id={pos.instrument.symbol}
										// 	stock={this.props[pos.instrument.symbol]}
										// />
											return <tr>
												<td>{pos.instrument.symbol}</td>
												<td>{pos.currentDayProfitLoss}</td>
												<td>{pos.currentDayProfitLossPercentage * 100}%</td>
												<td>{pos.marketValue}</td>
											</tr>
									})}
								</td>
							</tr>
							<tr span={6}>

								<td style={{ verticalAlign: "top" }}>
									NYSE Actives
									{_.values(this.props.actives.ACTIVES_NYSE).map((act) => {
										return (
											<div>
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
																<td>{pos.symbol}</td>
																<td>{pos.volume}</td>
																<td>{pos.priceChange}</td>
															</tr>
														);
													})}
												</table>
											</div>
										);
									})}
								</td>
								<td style={{ verticalAlign: "top" }}>
									NASDAQ Actives
									{_.values(this.props.actives.ACTIVES_NASDAQ).map((act) => {
										return (
											<div>
												<small>({act.sampleDuration / 60}min)</small>
												<table style={{ fontSize: "10px", width: "400px" }}>
													<tr>
														<th>Symbol</th>
														<th>Volume</th>
														<th>Price Chng</th>
													</tr>
													{act.groups.map((pos) => {
														return (
															<tr style={{ background: "darkGrey", border: "1px solid white" }}>
																<td>{pos.symbol}</td>
																<td>{pos.volume}</td>
																<td>{pos.priceChange}</td>
															</tr>
														);
													})}
												</table>
											</div>
										);
									})}
								</td>
								<td style={{ verticalAlign: "top" }}>
									OTCBB Actives
									{_.values(this.props.actives.ACTIVES_OTCBB).map((act) => {
										return (
											<div>
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
																<td>{pos.symbol}</td>
																<td>{pos.volume}</td>
																<td>{pos.priceChange}</td>
															</tr>
														);
													})}
												</table>
											</div>
										);
									})}
								</td>
								<td style={{ verticalAlign: "top" }}>
									Options Actives
									{_.values(this.props.actives.ACTIVES_OPTIONS).map((act) => {
										return (
											<div>
												<small>({act.sampleDuration / 60}min)</small>
												<table style={{ fontSize: "10px", width: "400px" }}>
													<tr>
														<th>Symbol</th>
														<th>Name</th>
														<th>Volume</th>
														<th>Price Chng</th>
													</tr>
													{act.groups.map((pos) => {
														return (
															<tr>
																<td>{pos.symbol}</td>
																<td>{pos.name}</td>
																<td>{pos.volume}</td>
																<td>{pos.priceChange}</td>
															</tr>
														);
													})}
												</table>
											</div>
										);
									})}
								</td>
							</tr>
						</table>
					)}
				</Layout>
			</Layout>
		);
	}
}
