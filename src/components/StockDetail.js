import { Card , Cascader} from 'antd';
import { Row, Col} from 'antd';
import * as React from 'react';
import * as $ from 'jquery';
import OptionChainHeatmap from './Heatmap'
import StockChart from './StockChart'
import _ from 'lodash'


export default class StockDetail extends React.Component {
    state = {
        selectedCall: {},
        chartData: [],
        frequency: "1",
        frequencyType: "daily",
        period: "6",
        periodType: "month",
    };

    periodOptions = [
        {
            value: 1,
            label: "1",
        },
        {
            value: 2,
            label: "2",
        },
        {
            value: 3,
            label: "3",
        },
        {
            value: 6,
            label: "6",
        },
    ];

    componentDidMount() {
        console.log("DidMount")
        this.getChart()
        this.loadchain()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.selectedStock !== this.props.selectedStock){
            //console.log(`Stock Changed Getting chart for ${this.props.selectedStock}`)
            this.getChart()
            this.loadchain()
            //console.log(this.state)
        }
        //this.getChart()
    }
    
    getChart = () => {
        console.log("getChart")
        let str = ""
        console.log(this.props.selectedStock);
        str = `https://charleskiel.dev:8000/pricehistory?symbol=${this.props.selectedStock}&frequency=${this.state.frequency}&frequencyType=${this.state.frequencyType}&period=${this.state.period}&periodType=${this.state.periodType}`
        console.log(str)
		fetch(str, {
            method: "GET",
			mode: "cors",
			headers: { "Content-Type": "application/json" },
		})
        .then((response) => response.json())
        .then((response) => {
            this.setState({ chartData: response });
        })
        .catch((error) => {
            console.log(error);
        });
    }
    
    
    loadchain = () => {
        console.log("getChain")
        let str = ""
        console.log(this.props.selectedStock);
        str = `https://charleskiel.dev:8000/chains?symbol=${this.props.selectedStock}`
        console.log(str)
		fetch(str, {
            method: "GET",
			mode: "cors",
			headers: { "Content-Type": "application/json" },
		})
        .then((response) => response.json())
        .then((chain) => {
            console.log(chain)
            //console.log(_.values(chain.callExpDateMap["2020-05-29:4"]))
            this.chains = [chain.callExpDateMap,chain.putExpDateMap]
        
        })

    }
    //onChange = (value, selectedOptions) => { }
    
    render() {
        const { chartData } = this.state;
        //console.log(this.props)
        if (this.props.selectedStock) {
            return (
                <div>
                    <h1>{this.props.selectedStock}</h1>
                    Chart Range:
                    <Cascader options={this.periodOptions} onChange={this.onChange}>
                        <a href="#">{this.props.selectedStock}</a>
                    </Cascader>
                    
                    <small>
                        <Row>
                            <Col span={12}>Bid: {this.props.stock['1']}</Col>
                            <Col span={12}>Ask: {this.props.stock['2']}</Col>
                        </Row>
                        <Row>
                            <Col span={12}>Vol: {this.props.stock['8']}</Col>
                            <Col span={12}>{this.props.stock['4']}</Col>
                        </Row>
                    </small>
                    <StockChart chartData={this.state.chartData} symbol={this.props.selectedStock}/>
                    <div style={{width: 500, height: 200}}>
                        {this.state.selectedCall.description && 
                            <div>
                                Call:
                                <p>{this.state.selectedCall.description}</p>
                                <p>{this.state.selectedCall.putCall}</p>
                                <p>{this.state.selectedCall.bid}</p>
                                <p>{this.state.selectedCall.ask}</p>
                                <p>{this.state.selectedCall.bid}</p>
                            </div>
                        }
                    </div>
                    <div>{this.chains.map(chain =>{
                        return <div><table style={{width: "1200px"}}>{
                            _.map(chain, (exp , x)=> {
                                //console.log(chain)
                                //console.log(exp)
                                //console.log(x)
                                return (<tr>
                                    <td style={{fontSize:"10px" , padding: "1px", width: "60px"}}>{x }</td>
                                    {_.values(exp).map( strike => {
                                        return (<td
                                        style={{width: "10px", height: "10px", backgroundColor: "#F00", border: "1px solid #000",
                                        margin: "0px"}}
                                        onMouseLeave={this.leave}
                        
                                        onMouseOver={this.hover = (e) => {this.setState({selectedCall : strike[0]}) } }>
                                        {strike.bid}
                                        </td>)
                                    })}
                                </tr>)
                            })
                        }</table></div>
                    })}
                    </div>
                </div>
            );
        } else {
            return <div>Select a stock</div>;
        }
    }






}
