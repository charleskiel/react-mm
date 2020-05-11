import { Card , Cascader} from 'antd';

import * as React from 'react';
import * as $ from 'jquery';
import OptionChainHeatmap from './Heatmap'
import StockChart from './StockChart'


export default class StockDetail extends React.Component {
    state = {
        data: [],
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
    }
    componentDidUpdate() {
        //console.log("DidUpdate")
        //this.getChart()
    }
    
    getChart = () => {
        console.log("getChart")
        let str = ""
        console.log(this.props.selectedStock);
        console.log(this.props.selectedStock);
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
            this.setState({ response: response });
        })
        .then(() => {
            console.log(this.state.response);
        })
        .catch((error) => {
            console.log(error);
        });
    }
    
    
    
    onChange = (value, selectedOptions) => {
        console.log("onChange")
        console.log(value)
        console.log(selectedOptions)
        //this.setState({period: value})
        this.getChart()
        
    }
    
    render() {
        const { data } = this.state;
        if (this.props.selectedStock) {
            return (
                <div>
                        <h1>{this.props.selectedStock}</h1>
                        Chart Range:
                        <Cascader options={this.periodOptions} onChange={this.onChange}>
                            <a href="#">{this.props.selectedStock}</a>
                        </Cascader>
                        <StockChart/>
                        <OptionChainHeatmap />
                    
                </div>
            );
        } else {
            return <div></div>;
        }
    }






}




// var j = JSON.parse(fs.readFileSync("./data/ROKU_chain.json", (err) => { if (err) console.error(err); }))
// debugger
// [j.callExpDateMap, j.putExpDateMap].map(call => _.values(call).map(_week => {
//     //console.log((_week))
//     _.values(_week).map(_strike => {
//         _strike.map(_price => {
//             //console.log(price.bid)

//             //console.log(`${_week},${(_strike)},${_price.description}`)
//             console.log(`${_price.description}`)
//         })
//     })
// })
// )

