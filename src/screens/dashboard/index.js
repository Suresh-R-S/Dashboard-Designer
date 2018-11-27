import React, {Component} from 'react';
import {Grid} from '@material-ui/core';
import RGL, { WidthProvider } from 'react-grid-layout';
import {cloneDeep} from 'lodash';

import {PieChart, BarChart, ChartData} from '../../components';

import './style.css';

const ReactGridLayout = WidthProvider(RGL);

const defaultChartData = {
    labels: ['One', 'Two'],
    datasets: [{
        data : [ 50, 50 ]
    }]
};

export default class Dashboard extends Component {

    static defaultProps = {
        className: "layout",
        rowHeight: 30,
        cols: 6,
    };

    state = {
        layout: [],
        open: false,
        modalData: defaultChartData,
        openedChartIndex: 0,
    }

    toggleModal = (itemData, index) => {
        const { open } = this.state;
        this.setState({
            open: !open,
            modalData: itemData ? itemData : defaultChartData,
            openedChartIndex: !open ? index : 0
        });
    }
    
    generateDOM = () => {
        return this.state.layout.map( (item, index) => (
            <div key={index} onClick={() => this.toggleModal(item.data, index)}>
                { item.type === 'pie' ? <PieChart data={item.data}/> : <BarChart data={item.data}/>}
            </div>
        ) );
    }
    
    generateLayout = (type) => {
        const { layout } = this.state;
        const newLayout = [ ...layout ];
        const y = Math.ceil(Math.random() * 4) + 1;
        const i = newLayout.length;
        newLayout.push({
            x: (i * 2) % 6,
            y: Math.floor(i / 3) * y,
            w: 2,
            h: 5,
            i: i.toString(),
            type,
            data: defaultChartData
        });
        this.setState({
            layout: newLayout
        });
    }
    
    onLayoutChange = (layout) => {
        // this.props.onLayoutChange(layout);
    }

    widgetSelected = (type) => {
        this.generateLayout(type);
    }

    changeChartData = (data,index) => {
        console.log('data', data);
        console.log('index', index);
        console.log('this.state.layout', this.state.layout);
        const layout = cloneDeep(this.state.layout);
        layout[index].data = data;
        this.setState({layout});
    }

    render() {
        console.log('this.state:::::::::::::', this.state);
        return (
            <Grid container>
                <Grid container item spacing={24}>
                    <Grid item xs={1} className="widgets-container">
                        <h3 className="title">Widgets</h3>
                        <p className="widget-options" onClick={() => this.widgetSelected('pie')}>Pie chart</p>
                        <p className="widget-options" onClick={() => this.widgetSelected('bar')}>Bar chart</p>
                    </Grid>
                    <Grid item xs={11}>
                    <ReactGridLayout
                        layout={this.state.layout}
                        onLayoutChange={this.onLayoutChange}
                        {...this.props}
                    >
                        {this.generateDOM()}
                    </ReactGridLayout>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <ChartData
                        open={this.state.open}
                        modalData={this.state.modalData}
                        chartIndex={this.state.openedChartIndex}
                        onClose={this.toggleModal}
                        saveData={this.changeChartData}
                    />
                </Grid>
            </Grid>
        );
    }
}