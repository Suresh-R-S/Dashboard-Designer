import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';
   
export default class BarChart extends Component {
    render() {
        return (
            <Bar
                data={this.props.data}
                options={{
                    maintainAspectRatio: false
                }}
                legend={{
                    display:false
                }}
            />
        )
    }
}