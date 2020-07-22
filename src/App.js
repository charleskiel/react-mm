import React, { Component } from "react";
//import moment from "moment"
import "./App.scss";

import _ from "lodash"
import { Layout, Menu, Breadcrumb,Row, Col, Card } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import StockCard from "./components/StockCard";
import StockDetail from "./components/StockDetail";
import Dashboard from "./components/Dashboard";

//import { changeConfirmLocale } from "antd/lib/modal/locale";
//import {	MenuUnfoldOutlined,	MenuFoldOutlined,	VideoCameraOutlined,	UploadOutlined,} from "@ant-design/icons";
//import { responsiveMap } from "antd/lib/_util/responsiveObserve";

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
		selectedWatchlist : "default",
		systemTime: 0,
		selectedStock: "",
		status: {},
		pps: 0,
		heartbeat: 0,
		ACTIVES_NASDAQ: {},
		ACTIVES_NYSE: {},
		ACTIVES_OPTIONS: {},
		ACTIVES_OTCBB: {},
		showpage: "stocks"
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
			//console.log(response);
			
			this.setState(prevState => {
				return {...prevState, ...response.stocks}})
				//console.log(this.state)
			this.getStatus()
			//setInterval(this.getStatus, 10000)
			//setInterval(this.getState, 2000)
			setInterval(this.updateStateFromTimer,500);

			this.ws = new WebSocket("wss://charleskiel.dev:7999");

			this.ws.onopen = (event) => {
				//console.log(this.settings.principals.accounts);
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
				this.getWatchLists()
				this.ws.onmessage = (event) => {
					//console.log(event)
					this.msgRec(JSON.parse(event.data));
				};
				this.ws.send(login);

				this.ws.onerror = (event) => {console.log("Error ", event)};
				this.ws.onclose = (event) => {console.log("Disconnected ", event)};
				
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
							//console.log(m)
							m.content.forEach(eq => this.equityTick(eq));
							break;
						case "ACTIVES_NASDAQ":
							//console.log("Nasdaq Actives")
							//console.log(m)
							break;
						case "ACTIVES_NYSE":
							//console.log("NYSE Actives")
							//console.log(m)
							break;
						case "ACTIVES_OPTIONS":
							//console.log("OPTIONS Actives")
							//console.log(m)
							break;
						case "ACTIVES_OTCBB":
							//console.log("OTCBB Actives")
							//console.log(m)
							break;
						case "TIMESALE_FUTURES":
							break;
						default:
							//console.log(`Default Message: ${msg}`);
							//console.log(m);
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

	tickbuffer = {};
	equityTick = (tick) => {
		if (this.ticktimestamp >= Date.now() - 1000)
		{
			this.setState({pps: (this.tickcount / (Date.now() - this.ticktimestamp ) * 1000 )})
			this.ticktimestamp = Date.now()
			this.tickcount = 0
		} 

		this.tickbuffer[tick.key] = {...this.tickbuffer[tick.key],...this.state[tick.key],  ...tick}
		this.tickcount += 1

		if (this.tickcount < 40) {
			// console.log(tick);
			// console.log(this.state)
		}
	};

	updateStateFromTimer = () => {
		let excTime = Date.now();
		this.setState((prevState) => {
			return { ...prevState, ...this.tickbuffer};
		});
		//console.log(Date.now() - excTime,"ms");
		this.tickbuffer = {}
	}

	setSelectedStock = (stock) => {
		console.log(`Setting Chart to ${stock}`)
		this.setState({selectedStock: stock})
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
			return (
				list[0].watchlistItems.map(stock => {
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
				this.setSelectedWatchlist("1364950292");
			})
		})
	}
	
    
	getStatus = () => {
		fetch(`https://charleskiel.dev:8000/status`, {
			method: "GET",
			mode: "cors",
			headers: { "Content-Type": "application/json" },
		})
		.then((response) => response.json())
		.then((status) => {
			this.setState((prevState) => {
				return { ...prevState, ...status };
			});
		});

	 }
	getState = () => {
		fetch(`https://charleskiel.dev:8000/state`, {
			method: "GET",
			mode: "cors",
			headers: { "Content-Type": "application/json" },
		})
		.then((response) => response.json())
		.then((state) => {
			this.setState((prevState) => {
				return { ...prevState, ...state };
			});
		});

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
		return (
			<Layout>
				<Header/>

				{this.state.showpage === "stocks" && (
					<Layout>
						<Sider width={200} className="site-layout-background">
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
									{_.values(this.state.watchlists).map((list) => (
										<Menu.Item key={list.watchlistId} onClick={() => this.setSelectedWatchlist(list.watchlistId)}>
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
							<Row
								style={{
									padding: 12,
									margin: 0,
									minHeight: 280,
									backgroundColor: "LightGrey",
								}}
							>
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
										className="site-layout-background"
										style={{
											padding: 12,
											margin: 0,
											minHeight: 280,
											backgroundColor: "LightGrey",
										}}
									>
										<Breadcrumb style={{ margin: "10px 0" }}>
											<Breadcrumb.Item>Home</Breadcrumb.Item>
											<Breadcrumb.Item>List</Breadcrumb.Item>
											<Breadcrumb.Item>App</Breadcrumb.Item>
										</Breadcrumb>

										<StockDetail selectedStock={this.state.selectedStock} stock={this.state[this.state.selectedStock]} />
									</Content>
								</Col>
							</Row>
						</Layout>
					</Layout>
				)}
				{this.state.showpage === "dashboard" && <Dashboard state={this.state} />}
			</Layout>
		);}
}
export default App;
