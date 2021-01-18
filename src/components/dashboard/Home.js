import * as React from "react";
import {Badge, Tabs, Layout, Menu} from "antd";
import StockCard from "../StockCard";
import Account from "./Account";
import Dashboard from "./Dashboard";
import currency from "currency.js";
import PriceIndicator from "../PriceIndicator";
import "./Home.scss";
import _ from "lodash";
import { UserOutlined, LaptopOutlined, NotificationOutlined } from "@ant-design/icons";
import moment from "moment";


const { SubMenu } = Menu;

const { TabPane } = Tabs;
const { Content, Sider } = Layout;
//{currency().format()}
export default class Home extends React.Component {
	state = {
		showpage: "dashboard",
	};

	componentWillMount(){
		this.props.functions.subscribe("DASHBOARD")
	}
	setShowPage = (page) => {
		console.log(`Setting Home to ${page}`)
		this.setState({showpage: page})
	}
  
	render() {
		return (
			<Layout>
				<Sider width={200} className="site-layout-background">
					<Menu mode="inline" defaultSelectedKeys={["0"]} defaultOpenKeys={["watchlists"]} style={{ height: "100%", borderRight: 0 }}>
						<Menu.Item key={"home"} onClick={() => this.setShowPage("home")}>Main Home</Menu.Item>
						<Menu.Item key={"account"} onClick={() => this.setShowPage("account")}>Account</Menu.Item>
						
						<SubMenu key="sub2" title={<span> <LaptopOutlined /> Statistics </span>} >
							<Menu.Item key="5">Activities</Menu.Item>
							<Menu.Item key="6">option6</Menu.Item>
							<Menu.Item key="7">option7</Menu.Item>
							<Menu.Item key="8">option8</Menu.Item>
						</SubMenu>

						<SubMenu key="admin" title={<span><NotificationOutlined />Logs</span>} >
							<Menu.Item key="9" onClick={() => this.props.functions.switchView("admin")} >Event Logs</Menu.Item>
							<Menu.Item key="10">Data Logs</Menu.Item>
							<Menu.Item key="11">option11</Menu.Item>
							<Menu.Item key="12">option12</Menu.Item>
						</SubMenu>
					</Menu>
				</Sider>

				<Layout className="mainLayout">
					{this.state.showpage === "dashboard" && this.props.state.actives && <Home functions={this.props.functions} state={this.props.state} />}
					{this.state.showpage === "account" && <Account functions={this.props.functions} state={this.props.state} />}
				</Layout>
			</Layout>
		);
	}
}