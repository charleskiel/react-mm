import { Card , Cascader} from 'antd';
import * as React from 'react';
import * as $ from 'jquery';
import OptionChainHeatmap from './Heatmap'


export default class Stock extends React.Component {
	constructor(props) {
		super(props);
		this.tick = this.tick.bind(this);
		console.log(`Created`)
		console.log(this)
	}
	
	tick(data){
		console.log(data.key);
		this.setState({data : data})
		this.forceUpdate()
	}


    state = {
        data: [],
    };
    options = [
	{
	  value: 'zhejiang',
	  label: 'Zhejiang',
	  children: [
	    {
		 value: 'hangzhou',
		 label: 'Hangzhou',
	    },
	  ],
	},
	{
	  value: 'jiangsu',
	  label: 'Jiangsu',
	  children: [
	    {
		 value: 'nanjing',
		 label: 'Nanjing',
	    },
	  ],
	},
   ];

	// tick = (data) =>{
	// 	console.log(`${this.props.key}`)
	// 	this.setState({data : data})
	// }


    cas = () => {
	    return <Cascader options={this.options} onChange={this.onChange}>
		<a href="#">{this.props.id}</a>
		</Cascader>
    }

	render() {
		//console.log(this.props.key)
		//if(this.props.id === "TSLA") console.log(this.props)
		//if(!this.props.id) console.log(this.props)

		return(
			<Card
				className="stockCard"
				size="small"
				title={this.cas()}
				
				extra={<a onClick={() => this.props.setSelectedStock(this.state.data.id)} href="#">Chart</a>} >

			<div>{this.state.data['1']} : {this.state.data['2']}</div>
			<div>{this.state.data['3']} : {this.state.data['4']}</div>
			</Card>
		)
	}
}
