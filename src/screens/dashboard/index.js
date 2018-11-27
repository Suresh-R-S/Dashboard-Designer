import React, {Component} from 'react';
import {Grid} from '@material-ui/core';
import RGL, { WidthProvider } from 'react-grid-layout';

import {PieChart, BarChart} from '../../components';

import './style.css';

const ReactGridLayout = WidthProvider(RGL);

export default class Dashboard extends Component {

    static defaultProps = {
        className: "layout",
        rowHeight: 30,
        cols: 6,
    };

    state = {
        layout: [],
    }
    
    generateDOM() {
        return this.state.layout.map( (item, index) => (
            <div key={index}>
                { item.type === 'pie' ? <PieChart/> : <BarChart/>}
            </div>
        ) );
    }
    
    generateLayout(type) {
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
            type
        });
        this.setState({
            layout: newLayout
        });
    }
    
    onLayoutChange(layout) {
        // this.props.onLayoutChange(layout);
    }

    widgetSelected(type){
        this.generateLayout(type);
    }

    render() {
        return (
            <Grid container>
                {/* <Grid item xs={12}>
                    <AppBar>
                        <h3 className="title">Dashboard Designer</h3>
                    </AppBar>
                </Grid> */}
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
            </Grid>
        );
    }
}