import * as React from "react";
import {Badge, Tabs, Layout, Menu} from "antd";
import StockCard from "../StockCard";
import Account from "./Account";
import Home from "./Home";
import currency from "currency.js";
import PriceIndicator from "../PriceIndicator";
import "./Dashboard.scss";
import _ from "lodash";
import { UserOutlined, LaptopOutlined, NotificationOutlined } from "@ant-design/icons";
import moment from "moment";


const { SubMenu } = Menu;

const { TabPane } = Tabs;
const { Content, Sider } = Layout;
//{currency().format()}
export default class Dashboard extends React.Component {
	state = {
		showpage: "home",
	};
	
	setShowPage = (page) => {
		console.log(`Setting Dashboard to ${page}`)
		this.setState({showpage: page})
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
							<Menu.Item key={"home"} onClick={() => this.setShowPage("home")}>
								Main Dashboard
							</Menu.Item>
							<Menu.Item key={"account"} onClick={() => this.setShowPage("account")}>
								Account
							</Menu.Item>
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
				<Layout className="mainLayout">

					{this.state.showpage === "account" && <Account {...this.props} />}
					{this.state.showpage === "home" && this.props.actives && <Home {...this.props} />}
				</Layout>
			</Layout>
		);
	}
}