import React from 'react'
import PriceIndicator from "./PriceIndicator";
import { connect } from 'react-redux'
import "./Marquee.scss";
import "./Header.scss";
import { Layout, Menu, Breadcrumb,Row, Col, Card } from 'antd';
const { Header, Content, Sider } = Layout;

//const { Header, Content, Sider } = Layout;

export default class AppHeader extends React.Component {
	render() {
		return <Header className="header">
			<div className="logo" />
			<Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
				<Menu.Item key="1" onClick={() => this.props.switchView("dashboard")}>
					Dashboard
			</Menu.Item>
				<Menu.Item key="2" onClick={() => this.props.switchView("stocks")}>
					Stocks
			</Menu.Item>
				<Menu.Item key="3" onClick={() => this.props.switchView("crypto")}>
					Crypto
			</Menu.Item>
			</Menu>
			<div class="marquee">
				<div class="marquee__content">
					<ul class="list-inline">
						{this.props.watchlists.length > 0 &&
							this.props.watchlists[7].watchlistItems.map((stock) => {
								return (
									<li className="marqueeItem">
										{stock.instrument.symbol}  -  {<PriceIndicator indicator={this.props[stock.instrument.symbol]["3"]} />}
									</li>
								);
							})
						}
		
					</ul>
				</div>
			</div>
		</Header>
	}
}

// const mapStateToProps = (state) = ({
// 	currentUser: state.user.currentUser
// })

//export default connect(mapStateToProps)(Header)