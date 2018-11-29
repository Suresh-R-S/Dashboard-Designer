import React, {Component} from 'react';
import {Grid, IconButton, Icon, Tooltip} from '@material-ui/core';
import RGL, { WidthProvider } from 'react-grid-layout';
import {cloneDeep} from 'lodash';

import {PieChart, BarChart, ChartData} from '../../components';

import './style.css';

const ReactGridLayout = WidthProvider(RGL);

const defaultChartData = {
    labels: ['One', 'Two'],
    datasets: [{
        data : [ 50, 50 ],
        backgroundColor: [ '#FF6384', '#36A2EB' ],
        hoverBackgroundColor: [ '#FF6384', '#36A2EB' ]
    }]
};

export default class Dashboard extends Component {

    state = {
        layout: this.initialLayout(),
        open: false,
        modalData: cloneDeep(defaultChartData),
        openedChartIndex: 0,
        clickedChart: 'pie'
    }

    initialLayout () {
        const layoutData = JSON.parse(localStorage.getItem('layout'));
        return layoutData ? cloneDeep(layoutData) : [];
    }

    toggleModal = (itemData, index, type) => {
        const { open } = this.state;
        this.setState({
            open: !open,
            modalData: itemData ? cloneDeep(itemData) : cloneDeep(defaultChartData),
            openedChartIndex: !open ? index : 0,
            clickedChart: itemData ? type : 'pie'
        });
    }
    
    generateDOM = () => {
        return this.state.layout.map( (item, index) => (
            <div key={item.i} className="chart-container">
                { item.type === 'pie' ? <PieChart data={cloneDeep(item.data)}/> : <BarChart data={cloneDeep(item.data)}/>}
                <div className="chart-name-container">
                    <span className="chart-name">{item.name}</span>
                </div>
                <div className="edit-button-container" >
                <Tooltip title="Edit chart">
                    <IconButton onClick={() => this.toggleModal(item.data, index, item.type)}>
                        <Icon color='primary'>edit</Icon>
                    </IconButton>
                </Tooltip>
                </div>
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
            name:`${type}_chart_${i}`,
            data: cloneDeep(defaultChartData)
        });
        this.setState({
            layout: newLayout
        });
    }
    
    onLayoutChange = (newLayout) => {
        const layout = cloneDeep(this.state.layout);
        newLayout.forEach( item => {
            layout.x = item.x;
            layout.y = item.y;
        } )
        this.setState({layout});
    }

    widgetSelected = (type) => {
        this.generateLayout(type);
    }

    changeChartData = (indexArr,data) => {
        const layout = cloneDeep(this.state.layout);
        indexArr.forEach((item) => {
            layout[item].data =  cloneDeep(data);
        })
        this.setState({layout, open: false, modalData: cloneDeep(defaultChartData), openedChartIndex:0});
    }

    removeChartData = () => {
        const layout = cloneDeep(this.state.layout);
        layout.splice(this.state.openedChartIndex, 1);
        this.setState({layout, open: false, modalData: cloneDeep(defaultChartData), openedChartIndex:0});
    }

    saveDashboard = () => {
        localStorage.setItem('layout',JSON.stringify(this.state.layout));
    }

    clearDashboard = () => {
        localStorage.removeItem('layout');
        this.setState({
            layout: [],
            open: false,
            modalData: cloneDeep(defaultChartData),
            openedChartIndex: 0,
            clickedChart: 'pie'
        })
    }

    render() {
        return (
            <Grid container>
                <Grid container item spacing={24}>
                    <Grid item xs={12} className="widgets-container">
                        <div className="widgets-options">
                        <Tooltip title="Pie Chart">
                            <IconButton onClick={() => this.widgetSelected('pie')}>
                                <Icon color='primary'>pie_chart</Icon>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Bar Chart">
                            <IconButton onClick={() => this.widgetSelected('bar')}>
                                <Icon color='primary'>bar_chart</Icon>
                            </IconButton>
                        </Tooltip>
                        </div>
                        <Tooltip title="Save to local storage">
                            <IconButton disabled={!this.state.layout.length} onClick={this.saveDashboard}>
                                <Icon color={ this.state.layout.length ? 'primary' : 'disabled'}>save</Icon>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Clear dashboard">
                            <IconButton disabled={!this.state.layout.length} onClick={this.clearDashboard}>
                                <Icon color={ this.state.layout.length ? 'secondary' : 'disabled'}>delete</Icon>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12}>
                    <ReactGridLayout
                        layout={this.state.layout}
                        onLayoutChange={this.onLayoutChange}
                        className="layout"
                        rowHeight={30}
                        cols={6}
                    >
                        {this.generateDOM()}
                    </ReactGridLayout>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <ChartData
                        open={this.state.open}
                        modalData={this.state.modalData}
                        onClose={() => this.toggleModal(0)}
                        saveData={this.changeChartData}
                        removeData={this.removeChartData}
                        chart={this.state.clickedChart}
                        layout={this.state.layout}
                        chartIndex={this.state.openedChartIndex}
                    />
                </Grid>
            </Grid>
        );
    }
}