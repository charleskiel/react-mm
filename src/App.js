import React, { Component } from "react";
import moment from "moment"
//import "antd/dist/antd.css";
import _ from "lodash"
import { Layout, Menu, Breadcrumb,Row, Col, Card } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

import { changeConfirmLocale } from "antd/lib/modal/locale";
import StockCard from "./components/StockCard";
import Stock from "./components/Stock";
import {	MenuUnfoldOutlined,	MenuFoldOutlined,	VideoCameraOutlined,	UploadOutlined,} from "@ant-design/icons";

//import "./index.css";
import "./App.css";
import StockDetail from "./components/StockDetail";
import { responsiveMap } from "antd/lib/_util/responsiveObserve";
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
class App extends Component {
	sessionId = "";
	nowplayingId = 0;
	packetcount = 0;
	casparpacketcount = 0;
	broadcastpacketcount = 0;
	controllerpacketcount = 0;

	settings = {
		account: {},
		principals: {},
		refresh_token: {},
		access_token: {},
		auth: {},
		serverStatus: {},
		
		packetcount: 0,}

	state = {
		equities: {},
		watchlists: {},
		selectedWatchlist : "",
		systemTime: 0,
		selectedStock: "",
		pps: 0,
		heartbeat: 0,
		ACTIVES_NASDAQ: {},
		ACTIVES_NYSE: {},
		ACTIVES_OPTIONS: {},
		ACTIVES_OTCBB: {},
		showpage: "watchlist"
	};

	ws = {};
	rid = 0;
	requestid = () => {
		return (this.rid = +1);
	};

ws = new Object()
	jsonToQueryString = (json) => {return Object.keys(json).map(function (key) {return (encodeURIComponent(key) +"=" +encodeURIComponent(json[key]));}).join("&");};

	componentDidMount() {
		fetch("https://charleskiel.dev:8000/state", {
			method: "GET",
			//mode: 'cors',
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then((response) => response.json())
		.then((response) => {
			console.log(response);
			
			this.setState(prevState => {
				return {...prevState, ...response.stocks}})
			console.log(this.state)

			this.ws = new WebSocket(
				"wss://charleskiel.dev:7999"
			);

			this.ws.onopen = (event) => {
				console.log(this.settings.principals.accounts);
				console.log("Connected to Server ", event);

				let login = JSON.stringify({
					requests: [
						{
							service: "ADMIN",
							command: "LOGIN",
							requestid: 0,
							username: "demo",
							password: "password",
							
						},
					],
				});
				console.log(login)
				this.ws.send(login);

				this.getWatchLists()
				this.ws.onerror = (event) => {console.log("Error ", event)};

				this.ws.onclose = (event) => {console.log("Disconnected ", event)};

				// Listen for messages
				this.ws.onmessage = (event) => {
					//console.log('Message from server ', event.data);
					this.msgRec(JSON.parse(event.data));

					//this.setState({ packetcount: this.state.packetcount += 1 })
					//console.log(msg)
				};
			};
		})
		.catch((error) => {
			console.error("Error:", error);
		});

	}

	msgRec = (msg) => {
		//console.log(msg)
		if (msg.notify) {
			this.setState({heartbeat: msg.notify[0].heartbeat})
		} else {
			if (msg.data) {
				msg.data.forEach((m) => {
					//console.log(m);
					
					switch (m.service) {
						case "QUOTE":
							m.content.forEach(eq => this.equityTick(eq));
							break;
						case "ACTIVES_NASDAQ":
							console.log("Nasdaq Activies")
							console.log(m)
							//console.log(this.state.ACTIVES_NASDAQ)
						
						case "ACTIVES_NYSE":
							console.log("NYSE Activies")
							console.log(m)
							//console.log(this.state.ACTIVES_NYSE)
							break;
						case "ACTIVES_OPTIONS":
							console.log("OPTIONS Activies")
							console.log(m)
							//console.log(o)
							break;
						case "ACTIVES_OTCBB":
							console.log("OTCBB Activies")
							console.log(m)
							break;
							break;
						case "TIMESALE_FUTURES":
							//console.log("OTCBB Activies")
							//console.log(m)
							break;
						default:
							//console.log(`Default Message: ${msg}`);
							console.log(m);
					}
				});
			}

			if (msg.response) {
				msg.response.forEach((m) => {
					switch (m.service) {
						case "ADMIN":
							if (m.content.code === 0) {
								console.log(`Login Sucuess!`, m.content.code, m.content.msg);
								this.initStream()
							} else {
								console.log(`LOGIN FAILED!!`, m.content.code, m.content.msg);
							}
							break;
						default:
							console.log(`Default Message`,msg)
							break;
					}
				});
			}
		}
	};

	sendMsg = (c) => {
		console.log(`Sending: ${JSON.stringify(c)}`);
		this.ws.send(JSON.stringify(c));
	};
	initStream = () => {}

	tickerSubscribe = (key) => {
		let keys = [..._.keys(this.state).filter(stock=> {
			if (this.state[stock].key) {
				//console.log(this.state[stock].key);
				return true;}
		}), ...key]
		//console.log(_.keys(this.state).map(m => m.key).toString())
		this.sendMsg({
			requests: [
				{
					service: "QUOTE",
					requestid: this.requestid(),
					command: "SUBS",
					account: this.settings.principals.accounts[0].accountId,
					source: this.settings.principals.streamerInfo.appId,
					parameters: {
						keys: keys.toString(),
						fields: "0,1,2,3,8,9,10,11,12,13,14,15,16,17,18,24,25,28,29,40",
					},
				},
			],
		});
	};

	toHHMMSS = (time) => {
		var sec_num = parseInt(time, 10); // don't forget the second param
		var hours = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - hours * 3600) / 60);
		var seconds = sec_num - hours * 3600 - minutes * 60;

		if (hours < 10) {
			hours = "0" + hours;
		}
		if (minutes < 10) {
			minutes = "0" + minutes;
		}
		if (seconds < 10) {
			seconds = "0" + seconds;
		}
		return hours + ":" + minutes + ":" + seconds;
	};

	ticktimestamp = Date.now()
	tickcount = 0
	equityTick = (tick) => {
		//console.log(tick)
		if (this.ticktimestamp >= Date.now() - 1000)
		{
			this.setState({pps: (this.tickcount / (Date.now() - this.ticktimestamp ) * 1000 )})
			this.ticktimestamp = Date.now()
			this.tickcount = 0
		} 
		this.tickcount += 1
		this.setState(prevState => {
			return {...prevState, [tick.key] : {...prevState[tick.key],...tick,}}})
	};

	setSelectedStock = (stock) => {
		console.log(`Setting Chart to ${stock}`)
		this.setState({selectedStock: stock})
		//console.log(this.state)
	}


	setSelectedWatchlist = (list) => {
		console.log(`Setting Watchlist to ${list}`)
		this.setState({selectedWatchlist: list})
		console.log(this.state)
	}
  
	listStocks = () => {

		let list = _.values(this.state.watchlists).filter(list => {
			if (list.watchlistId === this.state.selectedWatchlist) {
				return list
			}
		})

		if (list[0]){

			console.log (list[0].watchlistItems)
			return (
				list[0].watchlistItems.map(stock => {
					console.log(stock.instrument.symbol)
					// console.log(stock.instrument.symbol)
					// console.log(this.state[stock.instrument.symbol])
					return <StockCard 
						setSelectedStock={this.setSelectedStock} 
						key={stock.instrument.symbol}
						id={stock.instrument.symbol}stock={this.state[stock.instrument.symbol]}
					/>
				})
			)
		}
	}
	   

	getWatchLists = () => {
		return new Promise((sucsess, fail) => {
			fetch("https://charleskiel.dev:8000/getWatchlists", {
				method: "GET",
				mode: "cors",
				headers: {"Content-Type": "application/json"},
			})
			.then((response) => response.json())
			.then((response) => {
				console.log(response)
				this.setState({ watchlists: response });
			})
		})
	}
	

	switchView = (page) => {
		this.setState({showpage : page})
	}
	activites = (a) =>  {
		console.log(a)
		if (a.groups) return a.groups.map(_stock =>   {

		console.log(this.state[_stock.symbol]);
			
		return <Card
			className="stockCard"
			size="small"
			 title={!_stock.name && this.state[_stock.symbol][25].replace(" - Common Stock","") + " : $" + this.state[_stock.symbol][3]}
			
			extra={<a onClick={() => this.state[_stock.symbol].setSelectedStock(this.state[_stock.symbol].id)} href="#">Chart</a>} >
			{this.state[_stock.symbol][29]}
			<small>
				<Row>
					<Col span={12}>Bid: {this.state[_stock.symbol]['1']}</Col>
					<Col span={12}>Ask: {this.state[_stock.symbol]['2']}</Col>
				</Row>
				<Row>
					<Col span={12}>Vol: {this.state[_stock.symbol]['8']}</Col>
					<Col span={12}>{this.state[_stock.symbol]['4']}</Col>
				</Row>
				<Row>
					<Col span={12}>Vol: {_stock.volume}</Col>
					<Col span={12}>{this.state[_stock.symbol]['4']}</Col>
				</Row>
			</small>
		</Card>
		})}
	
	render(){
	return(
		<Layout>
			<Header className="header">
				<div className="logo" />
				<Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
					<Menu.Item key="1">Stocks</Menu.Item>
					<Menu.Item key="2">Crypto</Menu.Item>
					<Menu.Item key="3" onClick={() => this.switchView("activities") }>Dashboard</Menu.Item>
				</Menu>
				<h2>{moment(parseInt(this.state.heartbeat)).toString()}</h2>
			</Header>
			<Layout>
				<Sider width={200} className="site-layout-background">

					<Menu mode="inline"defaultSelectedKeys={['1']}defaultOpenKeys={['watchlists']}style={{ height: '100%', borderRight: 0 }}>
						<SubMenu key="watchlists" title={<span><UserOutlined />Watchlists</span>}>
							{_.values(this.state.watchlists).map(list => <Menu.Item key={list.watchlistId} onClick={() => this.setSelectedWatchlist(list.watchlistId)} >{list.name}</Menu.Item>)}
						</SubMenu>
						<SubMenu key="sub2" title={<span><LaptopOutlined />subnav 2</span>}>
							<Menu.Item key="5"	>Activities</Menu.Item>
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
				<Layout className="watchlist" >
					<Row>
						<Col span={6}>
							<Content
								className="site-layout-background"
								style={{
									padding: 12,
									margin: 0,
									minHeight: 280,
									backgroundColor: "LightGrey"
								}}>
								<Breadcrumb style={{ margin: '10px 0' }}>
									<Breadcrumb.Item>Home</Breadcrumb.Item>
									<Breadcrumb.Item>List</Breadcrumb.Item>
									<Breadcrumb.Item>App</Breadcrumb.Item>
								</Breadcrumb>
								{ this.state.showpage === "watchlist" &&
								this.listStocks()}
								{ this.state.showpage === "activities" &&
								<div className="site-card-wrapper">
									<Row gutter={16}>
									  <Col span={8}>
									    <Card title="NASAQ Activites" bordered={false}>
										{this.activites(this.state.ACTIVES_NASDAQ)		}
										{this.activites(this.state.ACTIVES_NYSE)		}
										{/* {this.activites(this.state.ACTIVES_OPTIONS)		}
										{this.activites(this.state.ACTIVES_OTCBB)		} */}
									    </Card>
									  </Col>
									  <Col span={8}>
									    <Card title="Card title" bordered={false}>
										 Card content
									    </Card>
									  </Col>
									  <Col span={8}>
									    <Card title="Card title" bordered={false}>
										 Card content
									    </Card>
									  </Col>
									</Row>
								</div>
								}
								
							</Content>

						</Col>
						<Col span={16}>
													
							<Content
								className="site-layout-background"
								style={{
									padding: 12,
									margin: 0,
									minHeight: 280,
									backgroundColor: "LightGrey"
								}}
							>
								<Breadcrumb style={{ margin: '10px 0' }}>
									<Breadcrumb.Item>Home</Breadcrumb.Item>
									<Breadcrumb.Item>List</Breadcrumb.Item>
									<Breadcrumb.Item>App</Breadcrumb.Item>
								</Breadcrumb>

								<StockDetail
								selectedStock={this.state.selectedStock} 
								stock={this.state[this.state.selectedStock]} 
								/>
								

							</Content>
						</Col>
					</Row>

				</Layout>
			</Layout>
		</Layout>
	)}
}
export default App;
