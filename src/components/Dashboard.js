import * as React from "react";
import { Layout, Menu} from "antd";
import StockCard from "./StockCard";
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
		console.log(this.props);
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
						)
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
					{this.props.state.status.content && (
						<table>
							<tr span={6}>
								<td>
									<h1>Account Status</h1>
									<strong>Balance</strong>:
									<table style={{ fontSize: "10px", width: "400px" }}>
										<th>Symbol</th>
										<th>P/L</th>
										<th>P/L%</th>
										<th>Value</th>

										{this.props.state.status.content[0].account[0].securitiesAccount.positions.map((pos) => {
											return (
												<tr>
													<td>{pos.instrument.symbol}</td>
													<td>{pos.currentDayProfitLoss}</td>
													<td>{pos.currentDayProfitLossPercentage}%</td>
													<td>{pos.marketValue}</td>
												
												</tr>
											)
										})}
									</table>
								</td>
								<td>
									<h1>NASDAQ Actives - {moment(this.props.state.status.actives.ACTIVES_NASDAQ[0].timestamp).format("LLLL")}</h1>
									<table style={{ fontSize: "10px", width: "400px" }}>
										<th>Symbol</th>
										<th>Volume</th>
										<th>Price Chng</th>
										{this.props.state.status.actives.ACTIVES_NASDAQ[0].groups.map((pos) => {
											return (
												<tr>
													<td>{pos.symbol}</td>
													<td>{pos.volume}</td>
													<td>{pos.priceChange}</td>
												</tr>
											);
										})}
									</table>
								</td>
								<td>
									<h1>NYSE Actives - {moment(this.props.state.status.actives.ACTIVES_NYSE[0].timestamp).format("LLLL")}</h1>
									<table style={{ fontSize: "10px", width: "400px" }}>
										<th>Symbol</th>
										<th>Volume</th>
										<th>Price Chng</th>
										{this.props.state.status.actives.ACTIVES_NYSE[0].groups.map((pos) => {
											return (
												<tr>
													<td>{pos.symbol}</td>
													<td>{pos.volume}</td>
													<td>{pos.priceChange}</td>
												</tr>
											);
										})}
									</table>
								</td>
							</tr>
						</table>
					)}
				</Layout>
			</Layout>
		);
	}
}
