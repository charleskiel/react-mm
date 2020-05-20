import { Card , Cascader, Row, Col} from 'antd';
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
				//title={this.props[25].replace(" - Common Stock","") + " : $" + this.props[3]}
				
				extra={<a onClick={() => this.props.setSelectedStock(this.props.id)} href="#">Chart</a>} >
				{this.props[29]}
				<small>
					<Row>
						<Col span={12}>Bid: {this.props['1']}</Col>
						<Col span={12}>Ask: {this.props['2']}</Col>
					</Row>
					<Row>
						<Col span={12}>Vol: {this.props['8']}</Col>
						<Col span={12}>{this.props['4']}</Col>
					</Row>
				</small>
			</Card>
		)
	}
}
