import React, { Component } from "react";
//import moment from "moment"
import "./App.scss";
import Header from "./components/Header"
import _ from "lodash"
import { Table, Layout, Menu, Breadcrumb,Row, Col, Card } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import Stocks from "./components/Stocks";
import Dashboard from "./components/Dashboard";
import "./App.less";

//import { changeConfirmLocale } from "antd/lib/modal/locale";
//import {	MenuUnfoldOutlined,	MenuFoldOutlined,	VideoCameraOutlined,	UploadOutlined,} from "@ant-design/icons";
//import { responsiveMap } from "antd/lib/_util/responsiveObserve";

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
		selectedWatchlist : "stocks",
		systemTime: 0,
		selectedStock: "",
		status: {},
		pps: 0,
		heartbeat: 0,
		ACTIVES_NASDAQ: {},
		ACTIVES_NYSE: {},
		ACTIVES_OPTIONS: {},
		ACTIVES_OTCBB: {},
		showpage: "dashboard",
		masking: true
	};

	ws = {};
	rid = 0;
	requestid = () => {return (this.rid = +1);};

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
			let test = []
			test["one"] = { key : 1, 1: "wegwe", 2: "22ewsfs"}
			console.log(response.stocks);
			console.log(test)
			this.setState(prevState => {
				return {...prevState, ...response.stocks}})
				//console.log(this.state)
			this.getStatus()
			setInterval(this.getStatus, 2000)
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
		}

		if (msg.content) {
			//console.log(m);
			switch (msg.service) {
				case "CHART_EQUITY":
					msg.content.forEach(eq => {
						if (this.ticktimestamp >= Date.now() - 1000)
						{
							this.setState({pps: (this.tickcount / (Date.now() - this.ticktimestamp ) * 1000 )})
							this.ticktimestamp = Date.now()
							this.tickcount = 0
						} 
						if (this.tickbuffer[eq.key]) this.tickbuffer[eq.key] = { ...this.tickbuffer[eq.key], spark: [...this.state[eq.key].spark, eq] };
						this.tickcount += 1
					});
					break;
				case "QUOTE":
					//console.log(m)
					msg.content.forEach(eq => {
						this.tickbuffer[eq.key] = { ...this.state[eq.key],    ...this.tickbuffer[eq.key], ...eq }
						this.tickcount += 1
					})
					
					break;
				case "ACTIVES_NASDAQ":
					//console.log(m)
					break;
				case "ACTIVES_NYSE":
					//console.log(m)
					break;
				case "ACTIVES_OPTIONS":
					//console.log(m)
					break;
				case "ACTIVES_OTCBB":
					//console.log(m)
					break;
				case "TIMESALE_FUTURES":
					break;
				default:
					//console.log(m);
			}
		}

		if (msg.response) {
			msg.response.forEach((m) => {
				switch (m.service) {
					case "ADMIN":
						if (msg.content.code === 0) {
							console.log(`Login Sucuess!`, msg.content.code, msg.content.msg);
							this.initStream()
						} else {
							console.log(`LOGIN FAILED!!`, msg.content.code, msg.content.msg);
						}
						break;
					default:
						console.log(`Default Message`,msg)
						break;
				}
			});
		}
	}


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
	

	updateStateFromTimer = () => {
		let excTime = Date.now();
		this.setState((prevState) => {
			return { ...prevState, ...this.tickbuffer};
		});
		//console.log(Date.now() - excTime,"ms");
		this.tickbuffer = {}
		//console.log(this.state["AMD"])
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
				<Header {...this.state} switchView={this.switchView}/>

				{this.state.showpage === "stocks" && (<Stocks {...this.state} setSelectedWatchlist={this.setSelectedWatchlist} ></Stocks>)}
				{this.state.showpage === "dashboard" && (<Dashboard {...this.state} />)}
				{this.state.showpage === "crypto" && (<div>[Coinbase API page coming soon]</div>)}
				{this.state.showpage === "admin" && (<div>[working on this]</div>)}
				{this.state.showpage === "about" && (<div>[Check back in a few hours]</div>)}
				</Layout >);}
}
export default App;
