import React, { Component } from "react";
import "./App.css";
import "antd/dist/antd.css";
import _ from "lodash"
import { Layout, Menu, Breadcrumb,Row, Col } from 'antd';
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
		pps: 0
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

		// fetch("https://charleskiel.dev:8000/chains?symbol=SPCE", {
		// 	method: "GET",
		// 	mode: "cors",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// })
		// 	.then((response) => response.json())
		// 	.then((response) => {
		// 		this.setState({ response });
		// 	})
		// 	.then(() => {
		// 		//console.log(this.state.response)
		// 	});
	}

	msgRec = (msg) => {
		if (msg.notify) {
			//console.log(`Heartbeat: ${msg.notify[0].heartbeat}`)
			console.log(msg)
		} else {
			if (msg.data) {
				msg.data.forEach((m) => {
					//console.log(m);

					switch (m.service) {
						case "QUOTE":
							m.content.forEach(eq => this.equityTick(eq));
							break;
						default:
							console.log(`Default Message: ${msg}`);
					}
				});
			}

			if (msg.response) {
				msg.response.forEach((m) => {
					switch (m.service) {
						case "ADMIN":
							if (m.content.code === 0) {
								console.log(
									`Login Sucuess! [code: ${m.content.code} msg:${m.content.msg}`
								);
								this.tickerSubscribe(
									"QQQ,GLD,SPY,TSLA,AAPL,AMD,AMZN"
								);
								//sendMessage(initStream)
								this.getWatchLists()
								//getInsturment("TSLA")
							} else {
								console.log(
									`LOGIN FAILED!! [code: ${m.content.code} msg:${m.content.msg}`
								);
							}
							break;
						case "CHART_EQUITY":
							break;

						default:
						//console.log(`Default Message ${msg}`)
					}
				});
			}
		}
	};

	sendMsg = (c) => {
		console.log(`Sending: ${JSON.stringify(c)}`);
		this.ws.send(JSON.stringify(c));
	};

	tickerSubscribe = (key) => {
		this.sendMsg({
			requests: [
				{
					service: "QUOTE",
					requestid: this.requestid(),
					command: "SUBS",
					account: this.settings.principals.accounts[0].accountId,
					source: this.settings.principals.streamerInfo.appId,
					parameters: {
						keys: key,
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

	chain = () => {};
	getCards = (list) => {
		//console.log(list)
		return list.map((e) => {
			return (
				<div component="span" display="block">
					<h2>{e}</h2>
				</div>
			);
		});
	};

	setSelectedStock = (stock) => {
		console.log(`Setting Chart to ${stock}`)
		this.setState({selectedStock: stock})
	}
  
	listStocks = () => {
		if (this.state){
			return _.values(this.state).map(stock => {
				//console.log(stock)
				if (stock.key) return <StockCard setSelectedStock={this.setSelectedStock} key={stock.key} id={stock.key} {...stock} />
		    
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
	   
	render(){
	return(
		<Layout>
			<Header className="header">
				<div className="logo" />
				<Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
					<Menu.Item key="1">Stocks</Menu.Item>
					<Menu.Item key="2">Crypto</Menu.Item>
					<Menu.Item key="3">Dashboard</Menu.Item>
				</Menu>
			</Header>
			<Layout>
				<Sider width={200} className="site-layout-background">
					<Menu mode="inline"defaultSelectedKeys={['1']}defaultOpenKeys={['watchlists']}style={{ height: '100%', borderRight: 0 }}>
						<SubMenu key="watchlists" title={<span><UserOutlined />Watchlists</span>}>
							{_.values(this.state.watchlists).map(list => <Menu.Item key={list.watchlistId}>{list.name}</Menu.Item>)}
						</SubMenu>
						<SubMenu key="sub2" title={<span><LaptopOutlined />subnav 2</span>}>
							<Menu.Item key="5">option5</Menu.Item>
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
						<Col span={4}>
							<Content
								className="site-layout-background"
								style={{
								padding: 12,
								margin: 0,
								minHeight: 280,
							}}
							>

								<Breadcrumb style={{ margin: '10px 0' }}>
									<Breadcrumb.Item>Home</Breadcrumb.Item>
									<Breadcrumb.Item>List</Breadcrumb.Item>
									<Breadcrumb.Item>App</Breadcrumb.Item>
								</Breadcrumb>
								Content
								{this.listStocks()}
							</Content>

						</Col>
						<Col span={20}>
													
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

								<StockDetail selectedStock={this.state.selectedStock}  stocks={this.state} />
								

							</Content>
						</Col>
					</Row>

				</Layout>
			</Layout>
		</Layout>
	)}
}
export default App;
