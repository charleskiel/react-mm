import { Card , Cascader} from 'antd';
import * as React from 'react';
import * as $ from 'jquery';
import OptionChainHeatmap from './Heatmap'


export default class StockCard
    extends React.Component {
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
				
				extra={<a onClick={() => this.props.setSelectedStock(this.props.id)} href="#">Chart</a>} >

			<div>{this.props['1']} : {this.props['2']}</div>
			<div>{this.props['3']} : {this.props['4']}</div>
			</Card>
		)
	}
}
