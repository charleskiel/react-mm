import * as React from "react";
import { Layout, Card, Menu, Popover, Button} from "antd";
import StockCard from "../StockCard";
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
	
	getCards = (positions, source = "TDA") => {
		positions.map((pos) => {
			
			switch (pos.instrument.assetType) {
				case "EQUITY":
					return (
						<Card size="small" title={pos.instrument.symbol} extra={<a href="#">More</a>} style={{ width: 300 }}>
							<Popover
								placement="bottom"
								title="Chart"
								content={
									<sendTo>
										<sendTo1 onClick={() => this.props.commands.sendTo(1)}>-</sendTo1>
										<sendTo2 onClick={() => this.props.commands.sendTo(2)}>-</sendTo2>
										<sendTo3 onClick={() => this.props.commands.sendTo(3)}>-</sendTo3>
										<sendTo4 onClick={() => this.props.commands.sendTo(4)}>-</sendTo4>
									</sendTo>
								}
								trigger="click"
							>
								<span style={{ float: "right" }}>
									<Button> Chart</Button>
								</span>
							</Popover>

							<p>{pos.instrument.underlyingSymbol}</p>
							<p>{pos.instrument.symbol}</p>
							<p>{pos.currentDayProfitLoss}</p>
							<p>{pos.currentDayProfitLossPercentage * 100}%</p>
							<p>{pos.marketValue}</p>
						</Card>
					)
				case "ETF":

					return (
						<Card size="small" title={pos.instrument.symbol} extra={<a href="#">More</a>} style={{ width: 300 }}>
							<Popover
								placement="bottom"
								title="Chart"
								content={
									<sendTo>
										<sendTo1 onClick={() => this.props.commands.sendTo(1)}>-</sendTo1>
										<sendTo2 onClick={() => this.props.commands.sendTo(2)}>-</sendTo2>
										<sendTo3 onClick={() => this.props.commands.sendTo(3)}>-</sendTo3>
										<sendTo4 onClick={() => this.props.commands.sendTo(4)}>-</sendTo4>
									</sendTo>
								}
								trigger="click"
							>
								<span style={{ float: "right" }}>
									<Button> Chart</Button>
								</span>
							</Popover>

							<p>{pos.instrument.underlyingSymbol}</p>
							<p>{pos.instrument.symbol}</p>
							<p>{pos.currentDayProfitLoss}</p>
							<p>{pos.currentDayProfitLossPercentage * 100}%</p>
							<p>{pos.marketValue}</p>
						</Card>
					)
				case "FUTURE":
					return (
						<Card size="small" title={pos.instrument.symbol} extra={<a href="#">More</a>} style={{ width: 300 }}>
							<Popover
								placement="bottom"
								title="Chart"
								content={
									<sendTo>
										<sendTo1 onClick={() => this.props.commands.sendTo(1)}>-</sendTo1>
										<sendTo2 onClick={() => this.props.commands.sendTo(2)}>-</sendTo2>
										<sendTo3 onClick={() => this.props.commands.sendTo(3)}>-</sendTo3>
										<sendTo4 onClick={() => this.props.commands.sendTo(4)}>-</sendTo4>
									</sendTo>
								}
								trigger="click"
							>
								<span style={{ float: "right" }}>
									<Button> Chart</Button>
								</span>
							</Popover>

							<p>{pos.instrument.underlyingSymbol}</p>
							<p>{pos.instrument.symbol}</p>
							<p>{pos.currentDayProfitLoss}</p>
							<p>{pos.currentDayProfitLossPercentage * 100}%</p>
							<p>{pos.marketValue}</p>
						</Card>
					)
				case "OPTION":
					return (
						<Card size="small" title={pos.instrument.symbol} extra={<a href="#">More</a>} style={{ width: 300 }}>
							<Popover
								placement="bottom"
								title="Chart"
								content={
									<sendTo>
										<sendTo1 onClick={() => this.props.commands.sendTo(1)}>-</sendTo1>
										<sendTo2 onClick={() => this.props.commands.sendTo(2)}>-</sendTo2>
										<sendTo3 onClick={() => this.props.commands.sendTo(3)}>-</sendTo3>
										<sendTo4 onClick={() => this.props.commands.sendTo(4)}>-</sendTo4>
									</sendTo>
								}
								trigger="click"
							>
								<span style={{ float: "right" }}>
									<Button> Chart</Button>
								</span>
							</Popover>

							<p>{pos.instrument.underlyingSymbol}</p>
							<p>{pos.instrument.symbol}</p>
							<p>{pos.currentDayProfitLoss}</p>
							<p>{pos.currentDayProfitLossPercentage * 100}%</p>
							<p>{pos.marketValue}</p>
						</Card>
					)
				default:
					return (
						<Card size="small" title={pos.instrument.symbol} extra={<a href="#">More</a>} style={{ width: 300 }}>
							<Popover
								placement="bottom"
								title="Chart"
								content={
									<sendTo>
										<sendTo1 onClick={() => this.props.commands.sendTo(1)}>-</sendTo1>
										<sendTo2 onClick={() => this.props.commands.sendTo(2)}>-</sendTo2>
										<sendTo3 onClick={() => this.props.commands.sendTo(3)}>-</sendTo3>
										<sendTo4 onClick={() => this.props.commands.sendTo(4)}>-</sendTo4>
									</sendTo>
								}
								trigger="click"
							>
								<span style={{ float: "right" }}>
									<Button> Chart</Button>
								</span>
							</Popover>

							<p>{pos.instrument.underlyingSymbol}</p>
							<p>{pos.instrument.symbol}</p>
							<p>{pos.currentDayProfitLoss}</p>
							<p>{pos.currentDayProfitLossPercentage * 100}%</p>
							<p>{pos.marketValue}</p>
						</Card>
					)
			}
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
						<Content>
							<div className="holdings">
								<small class="text-muted"></small>
								<tr span={6}>
									<td style={{ verticalAlign: "top" }}>
										<h1>Account Status</h1>
										<h4>Current Balance</h4>: {this.props.app.account[0].securitiesAccount.currentBalances.liquidationValue}
										<h4>Initial Balance</h4>:
										<table>
											<tr>
												<th>Symbol</th>
												<th>P/L</th>
												<th>P/L%</th>
												<th>Value</th>
											</tr>
										</table>
									</td>
								</tr>
							</div>
							{() => this.getCards(this.props.app.account[0].securitiesAccount.positions)}


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
						</Content>
					)}
				</Layout>
			</Layout>
		);
	}
}
