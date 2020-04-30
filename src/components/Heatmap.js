import * as React from 'react';
import * as $ from 'jquery';
import _ from 'lodash'

export default class OptionChainHeatmap
    extends React.Component {
    state = {
        data: [],
        dates: [],
        strikes: []
    };

    list = []
    dates = []
    strikes = []
    componentDidMount() {
    }



    render() {
        const { data } = this.state;
        const scale = [{
            dataKey: 'strike',
            type: 'cat',
            values: this.state.strikes
        }, {
            dataKey: 'Date',
            type: 'cat',
            values: this.state.dates,
        }];

        const axis1Opts = {
            dataKey: 'strike',
            tickLine: null,
            grid: {
                align: 'center',
                lineStyle: {
                    lineWidth: 1,
                    lineDash: null,
                    stroke: '#f0f0f0',
                },
            },
        };

        const axis2Opts = {
            dataKey: 'day',
            title: null,
            grid: {
                align: 'center',
                lineStyle: {
                    lineWidth: 1,
                    lineDash: null,
                    stroke: '#f0f0f0',
                },
                showFirstLine: true,
            },
        };

        const seriesOpts = {
            color: ['sales', '#BAE7FF-#1890FF-#0050B3'],
            position: 'name*day',
            label: ['sales', {
                offset: -2,
                textStyle: {
                    fill: '#fff',
                    shadowBlur: 2,
                    shadowColor: 'rgba(0, 0, 0, .45)',
                }
            }],
            style: {
                lineWidth: 1,
                stroke: '#fff',
            },
        };

        return (
            <div>
            </div>
        );
    }
}








