//import React from 'react';
import{ EventEmitter }from 'events';

class Socket {
	static ws = new WebSocket('ws://192.168.1.102:7999')
	static rid = 0;
	static requestId = () => { Socket.rid += 1; return Socket.rid; }
	static event = new EventEmitter();


	static load = () => {
		setInterval(Socket.sendMsgBuffer() ,200)
		Socket.ws.onopen = (event) => {
			//console.log(Socket.settings.principals.accounts);
			console.log("Connected to Server ", event);
			Socket.event.emit("connected")

			let login = {
				requests: [
					{
						service: "ADMIN",
						command: "LOGIN",
						requestId: Socket.requestId(),
						username: "demo",
						password: "password",
					},
				],
			};
			console.log(login)
			Socket.sendMsg(login);
		};
		Socket.ws.onmessage = (msg) => {
			console.log(msg)
			Socket.msgRec(JSON.parse(msg.data));
		};
		Socket.ws.onerror = (event) => { console.log("Error ", event)};
		Socket.ws.onclose = (event) => { console.log("Disconnected ", event)};
	}
	static msgBuffer = []
	static sendMsg = (c) => {
		console.log(c)
		Socket.msgBuffer.push(c)
	};
	
	static sendMsgBuffer = () => {
		if (Socket.ws.readyState === 1) {
			console.log(Socket.msgBuffer)
			Socket.ws.send(JSON.stringify(Socket.msgBuffer.shift()));
		}
	}

	static msgRec = (msg) => {
		//console.log(msg)
		if (msg.notify) {
			Socket.setState({ heartbeat: msg.notify[0].heartbeat });
		}

		if (msg.content) {
			//console.log(m);
			switch (msg.service) {
				case "CHART_EQUITY":
					msg.content.forEach((eq) => {
						if (Socket.ticktimestamp >= Date.now() - 1000) {
							Socket.setState({ pps: (Socket.tickcount / (Date.now() - Socket.ticktimestamp)) * 1000 });
							Socket.ticktimestamp = Date.now();
							Socket.tickcount = 0;
						}
						if (Socket.tickbuffer[eq.key]) Socket.tickbuffer[eq.key] = { ...Socket.tickbuffer[eq.key], spark: [...Socket.state[eq.key].spark, eq] };
						Socket.tickcount += 1;
					});
					break;
				case "QUOTE":
					//console.log(m)
					msg.content.forEach((eq) => {
						Socket.tickbuffer[eq.key] = { ...Socket.tickbuffer[eq.key], ...eq };
						Socket.tickcount += 1;
					});

					break;
				case "TIMESALE_FUTURES":
					break;
				case "ACTIVES_NASDAQ":
				case "ACTIVES_NYSE":
				case "ACTIVES_OPTIONS":
				case "ACTIVES_OTCBB":
					break;
				default:
					break;
				//console.log(m);
			}
		}

		if (msg.response) {
			msg.response.forEach((m) => {
				console.log(m)
				// if (msg.content.code === 0) {
				// 	console.log(`Login Sucuess!`, msg.content.code, msg.content.msg);
				// 	Socket.initStream();
				// } else {
				// 	console.log(`LOGIN FAILED!!`, msg.content.code, msg.content.msg);
				// }
				switch (m.service) {
					
					case "ADMIN":
						switch (m.command){
							case "SETTING":
								Socket.setState((prevState) => {return {settings : {...prevState.settings, ...m.setting} }})				
								break;
							default:
								break;
						}
						console.log(Socket.state.settings);
						break;
					default:
						console.log(`Default Message`, msg);
						break;
				}
			});
		}
	};

	static tickcount = 0;
	static tickbuffer = {};

	static subscribe = (keys) => {
		Socket.sendMsg(JSON.stringify({
			requests: [
				{
					service: "STREAM",
					command: "SUBSCRIBE",
					requestId: Socket.requestId(),
					content: [...keys].toString()
				},
			],
		}))
	}

	static updateState = () => {
		let buffer = Socket.tickbuffer
		Socket.tickbuffer = {};
		return buffer
		//console.log(Date.now() - excTime,"ms");
		//console.log(Socket.state["AMD"])
	};

	static setCommandkey = (key) => {
		console.log(key);
		Socket.setState((prevState) => { return {settings : {...prevState.settings,...{commandKey: key} }}} );
		let m = {
			requests: [
				{
					service: "ADMIN",
					command: "SETCOMMANDKEY",
					commandKey: key,
					requestId: Socket.requestId(),
				},
			],
		}

		console.log(m);
		Socket.sendMsg(JSON.stringify(m))
		console.log(Socket.state);
	};

}
export default Socket;
