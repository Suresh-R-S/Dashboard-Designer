import React, {Component} from 'react';
import {Pie} from 'react-chartjs-2';

export default class PieChart extends Component {
    render() {
        return (
            <Pie data={this.props.data} />
        )
    }
}