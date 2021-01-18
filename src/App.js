import React, { Component } from "react";
import EventEmitter from "eventemitter3";
//import moment from "moment"
import "./App.scss";
import Header from "./components/Header"
import Home from "./components/dashboard/Home";
import _ from "lodash"
import { Table, Layout, Menu, Breadcrumb,Row, Col, Card } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import Stocks from "./components/Stocks";
import Dashboard from "./components/dashboard/Dashboard";
import "./App.less";

import Data from "./GetData"
import { data } from "jquery";



//import { changeConfirmLocale } from "antd/lib/modal/locale";
//import {	MenuUnfoldOutlined,	MenuFoldOutlined,	VideoCameraOutlined,	UploadOutlined,} from "@ant-design/icons";
//import { responsiveMap } from "antd/lib/_util/responsiveObserve";

class App extends Component {
	ws = WebSocket
	rid = 0;
	requestid = () => { this.rid += 1; return this.rid; }

	sessionid = 0;
	nowplayingId = 0;
	packetcount = 0;
	casparpacketcount = 0;
	broadcastpacketcount = 0;
	controllerpacketcount = 0;

	event = new EventEmitter()

	settings = {
		serverStatus: {},
		packetcount: 0,
	};

	state = {
		settings: {
			commandKey: this.commandKey,
			commandKeyStatus: "denied",
			commandKeyStyle: "commandKeyStyle",
		},
		equities: {},
		watchlists: {},
		selectedWatchlist: "stocks",
		systemTime: 0,
		selectedStock: "",
		subStocks: {},
		tickerStocks: {},
		status: {},
		pps: 0,
		actives: {
			ACTIVES_NASDAQ: {},
			ACTIVES_NYSE: {},
			ACTIVES_OPTIONS: {},
			ACTIVES_OTCBB: {}
		},
		showpage: "home",
		masking: true,
	};


	componentWillMount() {
		// this.event.on("connected",() =>{
		// 	console.log("Connected")
		// })
	}

	loadSocket = () => {
		this.ws = new WebSocket("ws://192.168.1.102:7999");
		this.ws.onopen = (event) => {
			console.log("Connected to Server ", event.target.url);
			//this.functions.getWatchLists();
			let login = JSON.stringify({
				service: "ADMIN",
				command: "LOGIN",
				requestid: this.requestid(),
				username: "demo",
				password: "password",
			});

			this.ws.send(login);
			this.functions.subscribe("STATS")
			this.ws.onmessage = (event) => {this.msgRec(JSON.parse(event.data))};
			this.ws.onclose = (event) => {setTimeout(this.loadSocket, 2000);console.log("Disconnected ", event)};
		}
		this.ws.onerror = (event) => { console.log("Error ", event);setTimeout(this.loadSocket, 2000)};
	}
	componentDidMount() {
		this.loadSocket()
		setInterval(this.sendMsgBuffer, 200);
		setInterval(this.updateRxBuffer, 200);
		setInterval(this.getStatus, 2000);

		// fetch("http://192.168.1.102:8000/state", {
		// 	method: "GET",
		// 	//mode: 'cors',
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// })
		// .then((response) => response.json())
		// 	.then((response) => {
		// 	console.log(response)
		// 	this.setState((prevState) => {
		// 		return { ...prevState, ...response };
		// 	});
		// 	//console.log(this.state)
		// 	this.getStatus();

		// })
		// .catch((error) => {
		// 	console.error("Error:", error);
		// });
	}
	
	tickcount = 0;
	tickbuffer = {};

	msgRec = (msg) => {
		console.log(msg)
		if (msg.notify) {
			this.setState({ heartbeat: msg.notify[0].heartbeat });
		}

		if (msg.content) {
			//console.log(m);
			switch (msg.service) {
				case "CHART_EQUITY":
					msg.content.forEach((eq) => {
						if (this.ticktimestamp >= Date.now() - 1000) {
							this.setState({ pps: (this.tickcount / (Date.now() - this.ticktimestamp)) * 1000 });
							this.ticktimestamp = Date.now();
							this.tickcount = 0;
						}
						if (this.tickbuffer[eq.key]) this.tickbuffer[eq.key] = { ...this.tickbuffer[eq.key], spark: [...this.state[eq.key].spark, eq] };
						this.tickcount += 1;
					});
					break;
				case "QUOTE":
					//console.log(m)
					msg.content.forEach((eq) => {
						this.tickbuffer[eq.key] = { ...this.tickbuffer[eq.key], ...eq };
						this.tickcount += 1;
					});

					break;
				case "TIMESALE_FUTURES":
					break;
				case "ACTIVES_NASDAQ":
				case "ACTIVES_NYSE":
				case "ACTIVES_OPTIONS":
				case "ACTIVES_OTCBB":
					msg.content.forEach((eq) => {this.activesBuffer[eq.key] = { ...this.activesBuffer[eq.key]}});
					break;
				case "ADMIN":
					switch(msg.type){}
					break;
				default:
					break;
				//console.log(m);
			}
		}

		if (msg.response) {
			msg.response.forEach((m) => {
				console.log(m)
				switch (m.service) {
					case "ADMIN":
						switch (m.command){
							case "SETTING":
								this.setState((prevState) => {return {settings : {...prevState.settings, ...m.setting} }})				
								break;
							case "LOGIN":
								if (m.content === "OK") { console.log(`Login Sucuess!`, m.sessionid); this.sessionid = m.sessionid;}
								else { console.log(`LOGIN FAILED!!`, msg.content.code, msg.content.msg); }
								break;
							default:
								break;
						}
						console.log(this.state.settings);
						break;
					case "SERVICE":
						console.log(msg);
						switch (m.command){
							case "SETTING":
								this.setState((prevState) => {return {settings : {...prevState.settings, ...m.setting} }})				
								break;
							case "SUB":
								break;
							default:
								break;
						}
						console.log(this.state.settings);
						break;
					default:
						console.log(`Default Message`, msg);
						break;
				}
			});
		}
	};

	msgTxBuffer = []
	sendMsg = (c) => {
		this.msgTxBuffer.push(c)
	};
	
	sendMsgBuffer = () => {
		// console.log(this.msgTxBuffer)
		// console.log(this.ws.readyState === 1)
		if (this.ws.readyState === 1 && this.msgTxBuffer.length > 0 && this.sessionid > 0) {
			this.ws.send(JSON.stringify(this.msgTxBuffer.shift()));
		}
	}


	toHHMMSS = (time) => {
		var sec_num = parseInt(time, 10); // don't forget the second param
		var hours = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - hours * 3600) / 60);
		var seconds = sec_num - hours * 3600 - minutes * 60;
		if (hours < 10) {hours = "0" + hours;}
		if (minutes < 10) {minutes = "0" + minutes;}
		if (seconds < 10) {seconds = "0" + seconds;}
		return hours + ":" + minutes + ":" + seconds;
	};

	ticktimestamp = Date.now();
	activesBuffer = {}
	tickbuffer = {};
	
	msgRxBuffer = []

	updateRxBuffer = () => {
		let excTime = Date.now();
		let buffer = {subStocks: this.tickbuffer,actives : this.activesBuffer}
		this.tickbuffer = {};
		this.activesBuffer = {}

		this.setState((prevState) => {return { ...prevState, ...buffer }});
		//this.setState((prevState) => {return { ...prevState, ...this.tickbuffer }});
		//console.log(Date.now() - excTime,"ms");
	};


	functions = {
		setSelectedWatchlist : (list) => { console.log(`Setting Watchlist to ${list}`); this.setState({ selectedWatchlist: list }); console.log(this.state)},
		setSelectedStock: (stock) => { console.log(`Setting Chart to ${stock}`); this.setState({ selectedStock: stock }) },
		subscribe: (command, keys = [], dataTypes = []) => { this.sendMsg({"service": "SUB", "command" : command, "keys" :keys, "dataTypes": dataTypes })}, 
		getWatchLists : () => { this.setState({ watchlists: Data.getWatchLists() })},
		switchView : (page) => {this.setState({ showpage: page })},
		setCommandkey : (key) => {
			console.log(key);
			this.setState((prevState) => { return {settings : {...prevState.settings,...{commandKey: key} }}})
			this.ws.send(JSON.stringify({requests: [{service: "ADMIN",command: "SETCOMMANDKEY",commandKey: key,requestid: this.requestid()}]}))
		}
	}

	events = {

	}


	render() {
		return (
			<Layout>
				<Header {...this.state}/>
				{this.state.showpage === "home" && <Home functions={this.functions} state={this.state}/>}
				{this.state.showpage === "stocks" && <Stocks functions={this.functions} state={this.state}/>}
				{this.state.showpage === "crypto" && <div>[Coinbase API page coming soon]</div>}
				{this.state.showpage === "admin" && <div>[working on this]</div>}
				{this.state.showpage === "about" && <div>[Check back in a few hours]</div>}
			</Layout>
		);
	}
}
export default App;
