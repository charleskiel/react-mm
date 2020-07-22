import React from 'react'
import { connect } from 'react-redux'
import "./components/Marquee.scss";
import { Layout, Menu, Breadcrumb,Row, Col, Card } from 'antd';
const { Header, Content, Sider } = Layout;

//const { Header, Content, Sider } = Layout;

const AppHeader = ({ currentUser }) => (
	<Header className="header">
		<div className="logo" />
		<Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
			<Menu.Item key="1" onClick={() => this.switchView("dashboard")}>
				Dashboard
			</Menu.Item>
			<Menu.Item key="2" onClick={() => this.switchView("stocks")}>
				Stocks
			</Menu.Item>
			<Menu.Item key="3" onClick={() => this.switchView("crypto")}>
				Crypto
			</Menu.Item>
		</Menu>
		<div class="marquee">
			<div class="marquee__content">
				<ul class="list-inline">
					<li>Text 1</li>
					<li>Text 2</li>
					<li>Text 3</li>
					<li>Text 4</li>
					<li>Text 5</li>
				</ul>
				<ul class="list-inline">
					<li>Text 1</li>
					<li>Text 2</li>
					<li>Text 3</li>
					<li>Text 4</li>
					<li>Text 5</li>
				</ul>
				<ul class="list-inline">
					<li>Text 1</li>
					<li>Text 2</li>
					<li>Text 3</li>
					<li>Text 4</li>
					<li>Text 5</li>
				</ul>
			</div>
		</div>
	</Header>
);

// const mapStateToProps = (state) = ({
// 	currentUser: state.user.currentUser
// })

export default AppHeader
//export default connect(mapStateToProps)(Header)