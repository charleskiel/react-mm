import React from 'react';
import moment from 'moment'

import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis, VictoryLine } from 'victory';
import ReactDOM from 'react-dom';
import * as V from 'victory';
import * as $ from 'jquery';


// import { Group } from '@vx/group';
// import { scaleTime, scaleLinear } from '@vx/scale';
// import { AreaClosed } from '@vx/shape';
// import { AxisLeft, AxisBottom } from '@vx/axis';
// import { LinearGradient } from '@vx/gradient';
// import { extent, max } from 'd3-array';


export default class StockChart extends React.Component {
    state = {data : []}
    

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.symbol){
      //console.log(`Checking chart for ${this.props.symbol}`)
      if (prevProps.symbol !== this.props.symbol){
        console.log(`Stock Changed Getting chart for ${this.props.symbol}`)
        console.log(this.props)
        console.log(this.prevProps)
        let tempdata = []
          tempdata =  this.props.chartData.candles.map(_tick => {
            if (Math.min(_tick.open, _tick.close, _tick.high, _tick.low) < this.min) this.min = Math.min(_tick.open, _tick.close, _tick.high, _tick.low)
            if (Math.max(_tick.open, _tick.close, _tick.high, _tick.low) < this.max) this.max = Math.max(_tick.open, _tick.close, _tick.high, _tick.low)
            //console.log({x: _tick.datetime, y: _tick.close})
            this.tickValues.push(_tick.datetime)
            return {x: _tick.datetime, y: _tick.close}
          })
          console.log(tempdata)
          this.setState({data: tempdata})
      }
    }
  }



  x = "datetime"
  y = "close"
  width = 1000;
  height = 500;
  min = 0.02
  max = 0.1
  tickValues = []


  render () {
    //console.log(this.props)
    return(
      <VictoryChart width={1000} height={400} theme={VictoryTheme.material}>
        <VictoryLine
          data={this.state.data}
          padding={{ top: 20, bottom: 60 }}
            style={{
            data: { stroke: "#c43a31" , width: 1},
            parent: { border: "1px solid #ccc"}
          }}
        />
        
        <VictoryAxis dependentAxis
            //domain={[-10, 15]}
            offsetX={50}
            tickFormat={ (t) => `$${t}`}

            orientation="left"
            standalone={false}
            
          />
        
        <VictoryAxis independentAxis
            //domain={[-10, 15]}
            offsetX={50}
            tickFormat={ (t) => {moment(t).toString()}}
            orientation="bottom"
            standalone={false}
            
          />


      </VictoryChart>
    )
  }

}