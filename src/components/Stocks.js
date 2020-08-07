import _ from "lodash";
import { Layout, Menu, Breadcrumb, Row, Col, Card,Cascader } from "antd";
import * as React from 'react';
import * as $ from 'jquery';
import StockDetail from "./StockDetail";
import StockCard from "./StockCard";
import OptionChainHeatmap from "./Heatmap";
import { UserOutlined, LaptopOutlined, NotificationOutlined } from "@ant-design/icons";

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

export default class Stock extends React.Component {

	listStocks = () => {

		let list = _.values(this.props.watchlists).filter(list => {
			if (list.watchlistId === this.props.selectedWatchlist) {
				return list
			}
		})

		if (list[0]){
			return (
				list[0].watchlistItems.map(stock => {
					return <StockCard 
						setSelectedStock={this.setSelectedStock} 
						key={stock.instrument.symbol}
						id={stock.instrument.symbol} stock={this.props[stock.instrument.symbol]}
					/>
				})
			)
		}
	}

    state = {
        data: [],
    };
    options = [
	{
	  value: 'zhejiang',
	  label: 'Zhejiang',
	  children: [
	    {
		 value: 'hangzhou',
		 label: 'Hangzhou',
	    },
	  ],
	},
	{
	  value: 'jiangsu',
	  label: 'Jiangsu',
	  children: [
	    {
		 value: 'nanjing',
		 label: 'Nanjing',
	    },
	  ],
	},
   ];

	// tick = (data) =>{
	// 	console.log(`${this.props.key}`)
	// 	this.setState({data : data})
	// }


    cas = () => {
	    return <Cascader options={this.options} onChange={this.onChange}>
		<a href="#">{this.props.id}</a>
		</Cascader>
    }

	render() {
		//console.log(this.props.key)
		//if(this.props.id === "TSLA") console.log(this.props)
		//if(!this.props.id) console.log(this.props)

		return (
			<Layout>
				<Sider style={{backgroundColor: "black"}}>
				<Menu mode="inline" defaultSelectedKeys={["1"]} defaultOpenKeys={["watchlists"]} style={{ height: "100%", borderRight: 0 }}>
					<SubMenu
						key="watchlists"
						title={
							<span>
								<UserOutlined />
								Watchlists
							</span>
						}
					>
						{_.values(this.props.watchlists).map((list) => (
							<Menu.Item key={list.watchlistId} onClick={() => this.props.setSelectedWatchlist(list.watchlistId)}>
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
			<Layout className="watchlist">
				<Row>
					{/* <Breadcrumb style={{ margin: '10px 0' }}>
							<Breadcrumb.Item>Home</Breadcrumb.Item>
							<Breadcrumb.Item>List</Breadcrumb.Item>
							<Breadcrumb.Item>App</Breadcrumb.Item>
							</Breadcrumb> */}

					{this.listStocks()}
				</Row>
				<Row>
					<Col span={18}>
						<Content

						>
							<Breadcrumb style={{ margin: "10px 0" }}>
								<Breadcrumb.Item>Home</Breadcrumb.Item>
								<Breadcrumb.Item>List</Breadcrumb.Item>
								<Breadcrumb.Item>App</Breadcrumb.Item>
							</Breadcrumb>

							{/* <StockDetail selectedStock={this.props.selectedStock} stock={this.props[this.props.selectedStock]} /> */}
						</Content>
					</Col>
				</Row>
			</Layout>
		</Layout>
			
		)
	}
}
