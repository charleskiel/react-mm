import * as React from "react";
import {Badge, Layout, Menu} from "antd";
import StockCard from "./StockCard";
import currency from "currency.js";
import PriceIndicator from "./PriceIndicator";
import "./Dashboard.scss";
import _ from "lodash";
import { UserOutlined, LaptopOutlined, NotificationOutlined } from "@ant-design/icons";
import moment from "moment";
const { SubMenu } = Menu;
const { Content, Sider } = Layout;
//{currency().format()}
export default class Dashboard extends React.Component {
	state = {
		data: [],
	};
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
					<td className="mkvalue" ><PriceIndicator price={pos.marketValue} /></td>
				</tr>
			);
		})

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
						<div>
							<h1>Account Status</h1>
							<div><strong>Current Balance</strong> : {currency(this.props.app.account[0].securitiesAccount.currentBalances.liquidationValue).format()} </div>
							{/* <div><strong>Current Balance</strong> : {currency(this.props.app.account[0].securitiesAccount.currentBalances.liquidationValue).format()} ({this.props.app.account[0].securitiesAccount.currentBalances.liquidationValue /this.props.app.account[0].securitiesAccount.initialBalances.liquidationValue })  </div> */}
							<div><strong>Initial Balance</strong> : {currency(this.props.app.account[0].securitiesAccount.initialBalances.liquidationValue).format()}</div>
							<div><strong>Stock Buying Power</strong> : <span>{currency(this.props.app.account[0].securitiesAccount.projectedBalances.stockBuyingPower).format()}</span></div>
							<table className="accountTable">
								<tr>
									<th>Side</th>
									<th>Key</th>
									<th>Type</th>
									<th>Name</th>
									<th>P/L %</th>
									<th>Total P/L</th>
									<th>Market Value</th>
								</tr>

								{this.positions(this.props.app.account[0].securitiesAccount.positions)}
							</table>
							<table>
								<tr span={6}>
									<td style={{ verticalAlign: "top" }}>
										NYSE Actives
										{_.values(this.props.actives.ACTIVES_NYSE).map((act) => {
											return (
												<tr>
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
												</tr>
											);
										})}
									</td>
									<td style={{ verticalAlign: "top" }}>
										NASDAQ Actives
										{_.values(this.props.actives.ACTIVES_NASDAQ).map((act) => {
											return (
												<tr>
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
												</tr>
											);
										})}
									</td>
									<td style={{ verticalAlign: "top" }}>
										OTCBB Actives
										{_.values(this.props.actives.ACTIVES_OTCBB).map((act) => {
											return (
												<tr>
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
												</tr>
											);
										})}
									</td>
									<td style={{ verticalAlign: "top" }}>
										Options Actives
										{_.values(this.props.actives.ACTIVES_OPTIONS).map((act) => {
											return (
												<tr>
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
												</tr>
											);
										})}
									</td>
								</tr>
							</table>
						</div>
					)}
				</Layout>
			</Layout>
		);
	}
}
