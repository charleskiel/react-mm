import * as React from 'react';
import * as $ from 'jquery';
import _ from 'lodash'

export default class OptionChainHeatmap
    extends React.Component {
    state = {
        data: [],
        dates: [],
        strikes: [],
        selectedCall: {}
    };

    list = []
    dates = []
    strikes = []
    componentDidMount() {
    }
    
    hover = (e) => {
    }
    
    leave = (e) => {
        //console.log("leave")
        //console.log(e)
        e.target.style.backgroundColor = '#000';
    }
    
    
          
        
          
    

}








