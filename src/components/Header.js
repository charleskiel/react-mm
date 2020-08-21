import React from 'react'
import PriceIndicator from "./PriceIndicator";
import { connect } from 'react-redux'
import "./Marquee.scss";
import "./Header.scss";
import {Input, Layout, Menu, Breadcrumb,Row, Col, Card } from 'antd';

import { KeyOutlined } from "@ant-design/icons";

const { Header, Content, Sider } = Layout;


//const { Header, Content, Sider } = Layout;


export default class AppHeader extends React.Component {
	log = (e) => { console.log(e)}

	render() {
		//console.log(this.props)
		//console.log(this.props["CAT"]);

		return (
			<Header className="header">
				<tr className="logo" />
				<Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]} className="headerMenu">
					<Menu.Item key="1" onClick={() => this.props.switchView("dashboard")}>
						Dashboard
					</Menu.Item>
					<Menu.Item key="2" onClick={() => this.props.switchView("stocks")}>
						Stocks
					</Menu.Item>
					<Menu.Item key="3" onClick={() => this.props.switchView("crypto")}>
						Crypto
					</Menu.Item>
					<Menu.Item key="4" onClick={() => this.props.switchView("admin")}>
						Admin
					</Menu.Item>
					<Menu.Item key="5" onClick={() => this.props.switchView("about")}>
						About
					</Menu.Item>
				</Menu>
				<Input
					id="commandKey"
					ref="commandKey"
					prefix={<KeyOutlined />}
					placeholder="Enter access key"
					onChange={(evt) => this.props.setCommandkey(evt.target.value)}
					className={this.props.commandKeyStyle}
				></Input>

				<tr className="marquee">
					<tr className="marquee__content">
						<ul className="list-inline">
							{this.props.watchlists.length > 0 &&
								this.props.watchlists[7].items.map((stock) => {
									return (
										<li className="marqueeItem">
											{stock} - {<PriceIndicator commandKeyStatus={this.props.settings.commandKeyStatus} price={this.props[stock]["3"]} />}
										</li>
									);
								})}
						</ul>
					</tr>
				</tr>
			</Header>
		);
	}
}

// const mapStateToProps = (state) = ({
// 	currentUser: state.user.currentUser
// })

//export default connect(mapStateToProps)(Header)