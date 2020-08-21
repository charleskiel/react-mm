import * as React from "react";
import {Badge, Tabs, Layout} from "antd";
import StockCard from "../StockCard";
import currency from "currency.js";
import PriceIndicator from "../PriceIndicator";
import _ from "lodash";
import { UserOutlined, LaptopOutlined, NotificationOutlined } from "@ant-design/icons";
import moment from "moment";

const { TabPane } = Tabs;
const { Content} = Layout;
//{currency().format()}
export default class Account extends React.Component {
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
					<td className="mkvalue" ><PriceIndicator price={pos.marketValue} masking={this.props.masking} /></td>
				</tr>
			);
		})

	}
	render() {
		//console.log(this.props);
		return (
			
			<Layout className="Account">
				<h1>Account Home Page</h1>
				<span style={{width : "50%"}}>
					<h1>Account Status</h1>
					<div><strong>Current Balance</strong> : <PriceIndicator price={this.props.app.account[0].securitiesAccount.currentBalances.liquidationValue}  commandKeyStatus={this.props.settings.commandKeyStatus}/></div>
					{/* <div><strong>Current Balance</strong> : <PriceIndicator price={this.props.app.account[0].securitiesAccount.currentBalances.liquidationValue}  commandKeyStatus={this.props.settings.commandKeyStatus}/>({this.props.app.account[0].securitiesAccount.currentBalances.liquidationValue /this.props.app.account[0].securitiesAccount.initialBalances.liquidationValue })  </div> */}
					<div><strong>Initial Balance</strong> : <PriceIndicator price={this.props.app.account[0].securitiesAccount.initialBalances.liquidationValue} commandKeyStatus={this.props.settings.commandKeyStatus}/></div>
					<div><strong>Stock Buying Power</strong> : <PriceIndicator price={this.props.app.account[0].securitiesAccount.projectedBalances.stockBuyingPower} commandKeyStatus={this.props.settings.commandKeyStatus}/></div>
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
				</span>
			</Layout>
		)	
	}
}