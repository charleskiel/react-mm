import React, { Component } from "react";
import "./App.css";

class App extends Component {

  sessionId = ""
  nowplayingId = 0
  packetcount = 0
  casparpacketcount = 0
  broadcastpacketcount = 0
  controllerpacketcount = 0


  state = {
    account: {},
    principals: {},
    refresh_token: {},
    access_token: {},
    auth: {},
    insturments: new Map(),
    playlists: [],
    broadcastList: [],
    broadcastStatus: {},
    controllerStatus: {},
    serverStatus: {},

    packetcount: 0,

    status: {
      nowPlaying: "Video"
      //nowPlaying: new Object()
    }
  }



  ws = new Object()
  rid = 0
  requestid = () => {
    return this.rid = + 1
  }
  
  credentials = () => {
    var tokenTimeStampAsDateObj = new Date(this.state.principals.streamerInfo.tokenTimestamp);
    var tokenTimeStampAsMs = tokenTimeStampAsDateObj.getTime();
    
    return {

      "userid": this.state.principals.accounts[0].accountId,
      "token": this.state.principals.streamerInfo.token,
      "company": this.state.principals.accounts[0].company,
      "segment": this.state.principals.accounts[0].segment,
      "cddomain": this.state.principals.accounts[0].accountCdDomainId,
      "usergroup": this.state.principals.streamerInfo.userGroup,
      "accesslevel": this.state.principals.streamerInfo.accessLevel,
      "authorized": "Y",
      "timestamp": tokenTimeStampAsMs,
      "appid": this.state.principals.streamerInfo.appId,
      "acl": this.state.principals.streamerInfo.acl
    }
  }

  jsonToQueryString = (json) => {
    return Object.keys(json).map(function (key) {
      return encodeURIComponent(key) + '=' +
        encodeURIComponent(json[key]);
    }).join('&');
  }


  componentDidMount() {
    fetch('https://charleskiel.dev:8000/accountinfo')
      .then(response => response.json())
      .then(response => {
        console.log(response.principals)
        this.setState({refresh_token : response.refresh_token })
        this.setState({access_token : response.access_token })
        this.setState({ account_info: response.account_info })
        this.setState({ principals: response.principals })
        
        this.ws = new WebSocket('wss://streamer-ws.tdameritrade.com/ws');

        this.ws.onopen = (event) => {
          console.log(this.state.principals.accounts)
          console.log('Connected to Server ', event);
        
          let login = JSON.stringify({
            "requests": [
              {
                "service": "ADMIN",
                "command": "LOGIN",
                "requestid": 0,

                "account": this.state.principals.accounts[0].accountId,
                "source": this.state.principals.streamerInfo.appId,
                "parameters": {
                  "credential": this.jsonToQueryString(this.credentials()),
                  "token": this.state.principals.streamerInfo.token,
                  "version": "1.0",
                  "qoslevel": 0
                }
              }
            ]
          })
          //console.log(login)
          this.ws.send(login)

          this.ws.onerror = (event) => {
            console.log('Error ', event)
          }

          this.ws.onclose = (event) => {
            console.log('Disconnected ', event)
          }


          // Listen for messages
          this.ws.onmessage = (event) => {
            //console.log('Message from server ', event.data);
            this.msgRec(JSON.parse(event.data))

            this.setState({ packetcount: this.state.packetcount += 1 })
            //console.log(msg)
          }


        }   
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      

  }

  msgRec = (msg) => {
    if (msg.notify) {
      //console.log(`Heartbeat: ${msg.notify[0].heartbeat}`)
    } else {
      if (msg.data) {

        msg.data.forEach(m => {
          //console.log(m);

          switch (m.service) {
            case "QUOTE":
              m.content.forEach(eq => this.equityTick(eq))
              
              break
            default:
            console.log(`Default Message ${msg}`)
          }
        }
        )
      }

      if (msg.response) {
        msg.response.forEach(m => {
          switch (m.service) {

            case "ADMIN":
              if (m.content.code === 0) {
                console.log(`Login Sucuess! [code: ${m.content.code} msg:${m.content.msg}`)
                this.tickerSubscribe("GLD,SPY,QQQ,TSLA,AAPL,ACB,ADBE,AMD,AMTD,AMZN,BA,BBY,BYND,C,CAT,COKE,COST,CRM,CRSP,CVS,DIS,DKS,DLRT,DNKN,EA,ENPH,FDX,GRUB,HAL,HAS,")
                //sendMessage(initStream)
                //getAccount()
                //getWatchLists()
                //getInsturment("TSLA")
              }
              else { console.log(`LOGIN FAILED!! [code: ${m.content.code} msg:${m.content.msg}`) }
              break
            case "CHART_EQUITY":
              break

            default:
            //console.log(`Default Message ${msg}`)
          }
        })
      }
    }
  }

  sendMsg = (c) => {
    console.log(`Sending: ${JSON.stringify(c)}`)
    this.ws.send(JSON.stringify(c))
  }


  

  tickerSubscribe = (key) => { 
   this.sendMsg({
    "requests": [
      {
        "service": "QUOTE",
        "requestid": this.requestid(),
        "command": "SUBS",
        "account": this.state.principals.accounts[0].accountId,
        "source": this.state.principals.streamerInfo.appId,
        "parameters": {
          "keys": key,
          "fields": "0,1,2,3,4,5,6,7,8"
        }
      }]
    })
}



  toHHMMSS = (time) => {
    var sec_num = parseInt(time, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
  }





  equityTick = (tick) => {
    //console.log(tick)
    console.log(this.state.insturments)
    this.state.insturments.set(tick.key,tick)
  }



  render() {
    return (
      <div className="App">



      </div>
    );
  }
}

export default App;
