import React, { Component } from "react";
import moment from "moment"
import "./App.css";
import "antd/dist/antd.css";
import _ from "lodash"
import { Layout, Menu, Breadcrumb,Row, Col, Card } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

import { changeConfirmLocale } from "antd/lib/modal/locale";
import StockCard from "./components/StockCard";
import Stock from "./components/Stock";
import {	MenuUnfoldOutlined,	MenuFoldOutlined,	VideoCameraOutlined,	UploadOutlined,} from "@ant-design/icons";

import "./index.css";
import StockDetail from "./components/StockDetail";
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

	credentials = () => {
		var tokenTimeStampAsDateObj = new Date(
			this.settings.principals.streamerInfo.tokenTimestamp
		);
		var tokenTimeStampAsMs = tokenTimeStampAsDateObj.getTime();

		return {
			userid: this.settings.principals.accounts[0].accountId,
			token: this.settings.principals.streamerInfo.token,
			company: this.settings.principals.accounts[0].company,
			segment: this.settings.principals.accounts[0].segment,
			cddomain: this.settings.principals.accounts[0].accountCdDomainId,
			usergroup: this.settings.principals.streamerInfo.userGroup,
			accesslevel: this.settings.principals.streamerInfo.accessLevel,
			authorized: "Y",
			timestamp: tokenTimeStampAsMs,
			appid: this.settings.principals.streamerInfo.appId,
			acl: this.settings.principals.streamerInfo.acl,
		};
	};

	jsonToQueryString = (json) => {return Object.keys(json).map(function (key) {return (encodeURIComponent(key) +"=" +encodeURIComponent(json[key]));}).join("&");};

	componentDidMount() {
		fetch("https://charleskiel.dev:8000/accountinfo", {
			method: "GET",
			//mode: 'cors',
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((response) => {
				console.log(response.principals);
				this.settings.refresh_token= response.refresh_token
				this.settings.access_token= response.access_token
				this.settings.account_info= response.account_info
				this.settings.principals= response.principals

				this.ws = new WebSocket(
					"wss://streamer-ws.tdameritrade.com/ws"
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
								account: this.settings.principals.accounts[0].accountId,
								source: this.settings.principals.streamerInfo.appId,
								parameters: {
									credential: this.jsonToQueryString(this.credentials()),
									token: this.settings.principals.streamerInfo.token,
									version: "1.0",
									qoslevel: 0,
								},
							},
						],
					});
					console.log(login)
					this.ws.send(login);

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
		if (msg.notify) {
			this.setState({heartbeat: msg.notify[0].heartbeat})
			//console.log(msg)
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
							//console.log(m)
							var split = m.content[0]["1"].split(";")
							var o = {
								"timestamp" : m.timestamp,
								"ID:" : split[0],
								"sampleDuration" : split[1],
								"Start Time" : split[2],
								"Display Time" : split[3],
								"GroupNumber" : split[4],
								"groups" : []}
							split = (split[6].split(":"))
							o.totalVolume = (split[0])
							o.groupcount = split[1]
							for (let i = 3; i < split.length; i += 3) {
								this.setState(prevState => {
									return {...prevState, [split[i]] : {...prevState[split[i]],...tick,}}
								})

								this.setState( {...this.state, [split[i]] : {key : split[i]}})
								o.groups.push({symbol: split[i], volume: split[i+1], priceChange: split[i+2]}) 
								//console.log(`${split[i]} - ${split[i+1]} - ${split[i+2]}`) 
							}
							console.log(o)
							this.setState({ACTIVES_NASDAQ : o})
							
							console.log(this.state.ACTIVES_NASDAQ)
						
						case "ACTIVES_NYSE":
							console.log("NYSE Activies")
							//console.log(m)
							var split = m.content[0]["1"].split(";")
							var o = {
								"timestamp" : m.timestamp,
								"ID:" : split[0],
								"sampleDuration" : split[1],
								"Start Time" : split[2],
								"Display Time" : split[3],
								"GroupNumber" : split[4],
								"groups" : []}
							split = (split[6].split(":"))
							o.totalVolume = (split[0])
							o.groupcount = split[1]
							for (let i = 3; i < split.length; i += 3) {
								if (!this.state[split[i]]) return {...this.state, [split[i]] : {key : split[i]}}
								o.groups.push({symbol: split[i], volume: split[i+1], priceChange: split[i+2]}) 
								//console.log(`${split[i]} - ${split[i+1]} - ${split[i+2]}`) 
								
							}
							this.setState({ACTIVES_NYSE : o})
							
							console.log(this.state.ACTIVES_NYSE)
							break;
						case "ACTIVES_OPTIONS":
							console.log("OPTIONS Activies")
							//console.log(m)
							var split = m.content[0]["1"].split(";")
							var o = {
							"timestamp" : m.timestamp,
							"ID:" : split[0],
							"sampleDuration" : split[1],
							"Start Time" : split[2],
							"Display Time" : split[3],
							"GroupNumber" : split[4],
							"groups" : []}

							split = (split[6].split(":"))
							o.totalVolume = (split[3])
							o.groupcount = split[1]

							for (let i = 3; i < split.length; i += 4) {
								//if (!this.state[split[i]]) this.tickerSubscribe([split[i]])
								o.groups.push({symbol: split[i], name: split[i+1], volume: split[i+2], percentChange: split[i+3]}) 
							}
							this.setState({ACTIVES_OPTIONS : o})
							console.log(o)
							break;
						case "ACTIVES_OTCBB":
							console.log("OTCBB Activies")
							console.log(m)
							break;
						default:
							//console.log(`Default Message: ${msg}`);
							//console.log(msg);
					}
				});
			}

			if (msg.response) {
				msg.response.forEach((m) => {
					switch (m.service) {
						case "ADMIN":
							if (m.content.code === 0) {
								console.log(`Login Sucuess! [code: ${m.content.code} msg:${m.content.msg}`);
								this.tickerSubscribe( ["QQQ","GLD","SPY","TSLA","AAPL","AMD","AMZN"]);
								this.getWatchLists()
								this.initStream()
								//getInsturment("TSLA")
							} else {
								console.log(`LOGIN FAILED!! [code: ${m.content.code} msg:${m.content.msg}`);
							}
							break;
						case "CHART_EQUITY":
							break;
						case "ACTIVES_NASDAQ":
							console.log(msg)
							break;
						default:
						//console.log(`Default Message ${msg}`)
						console.log(msg)
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
	initStream = () => {
		this.sendMsg({
			"requests": [
			    {
				   "service": "ACTIVES_NASDAQ", 
				   "requestid": "3", 
				   "command": "SUBS", 
				   "account": this.settings.principals.accounts[0].accountId, 
				   "source": this.settings.principals.streamerInfo.appId, 
				   "parameters": {
					  "keys": "NASDAQ-ALL", 
					  "fields": "0,1"
				   }
			    }, 
			    {
				   "service": "ACTIVES_OTCBB", 
				   "requestid": "5", 
				   "command": "SUBS", 
				   "account": this.settings.principals.accounts[0].accountId, 
				   "source": this.settings.principals.streamerInfo.appId, 
				   "parameters": {
					  "keys": "OTCBB-ALL", 
					  "fields": "0,1"
				   }
			    }, 
			    {
				   "service": "ACTIVES_NYSE", 
				   "requestid": "2", 
				   "command": "SUBS", 
				   "account": this.settings.principals.accounts[0].accountId, 
				   "source": this.settings.principals.streamerInfo.appId, 
				   "parameters": {
					  "keys": "NYSE-ALL", 
					  "fields": "0,1"
				   }
			    }, 
			    {
				   "service": "ACTIVES_OPTIONS", 
				   "requestid": "4", 
				   "command": "SUBS", 
				   "account": this.settings.principals.accounts[0].accountId, 
				   "source": this.settings.principals.streamerInfo.appId,             
				   "parameters": {
					  "keys": "OPTS-DESC-ALL", 
					  "fields": "0,1"
				   }
			    }
			]
		 })
		 this.sendMsg({
			"requests": [
			    {
				   "service": "CHART_FUTURES",
				   "requestid": "2",
				   "command": "SUBS",
				   "account": this.settings.principals.accounts[0].accountId, 
				   "source": this.settings.principals.streamerInfo.appId,    
				   "parameters": {
					  "keys": "/ES",
					  "fields": "0,1,2,3,4,5,6,7"
				   }
			    }
			]
		 })
	}

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
  
	listStocks = () => {
		if (this.state){
			return _.values(this.state).filter(stock => {
				console.log(stock)
				if (stock.key) {
					return <StockCard setSelectedStock={this.setSelectedStock} key={stock.key} id={stock.key} {...stock}
					 />}
		    
		  })
		} 
	   }

	getWatchLists = () => {
		return new Promise((sucsess, fail) => {
			fetch("https://charleskiel.dev:8000/watchlists", {
				method: "GET",
				mode: "cors",
				headers: {"Content-Type": "application/json"},
			})
			.then((response) => response.json())
			.then((response) => {
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
							{_.values(this.state.watchlists).map(list => <Menu.Item key={list.watchlistId} >{list.name}</Menu.Item>)}
						</SubMenu>
						<SubMenu key="sub2" title={<span><LaptopOutlined />subnav 2</span>}>
							<Menu.Item key="5"	>Activities</Menu.Item>
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
