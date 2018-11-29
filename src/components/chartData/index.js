import React, {Component} from 'react';
import {cloneDeep} from 'lodash';
import { CompactPicker } from 'react-color'
import {
    Grid,
    Modal, 
    TextField, 
    Button, 
    Icon, 
    FormControl, 
    FormControlLabel, 
    FormGroup, 
    FormLabel, 
    Checkbox,
    Tooltip,
    IconButton,
} from '@material-ui/core';

import './style.css';

export default class ChartData extends Component {

    state = {
        data : cloneDeep(this.props.modalData),
        layoutData: []
    }

    componentDidMount () {
        this.setState({
            layoutData: this.createLayoutData(this.props.layout)
        });
    }

    componentWillReceiveProps = (newProps) => {
        if( !this.props.open && newProps.open ) {
            this.setState({
                data : cloneDeep(newProps.modalData),
                layoutData: this.createLayoutData(newProps.layout, newProps.chartIndex)
            })
        }

        if( this.props.chartIndex !== newProps.chartIndex ) {
            this.setState({
                layoutData: this.createLayoutData(newProps.layout)
            })
        }
    }

    createLayoutData = (data) => {
        return data.map( item => {
            return {
                name: item.name,
                index: parseInt(item.i),
                checked: false
            }
        } );
    }

    handleDataChange = (type, index, textVal) => {
        const data = cloneDeep(this.state.data);
        if (type === 'labels') {
            const labels = cloneDeep(data.labels);
            labels[index] = textVal;
            data.labels = cloneDeep(labels);
        }
        else {
            const value = cloneDeep(data.datasets[0].data);
            value[index] = parseInt(textVal);
            data.datasets[0].data = cloneDeep(value);
        }
        this.setState({
            data
        })
    }

    handleColorChange = (color, index) => {
        const data = cloneDeep(this.state.data);
        const backgroundColor = [...data.datasets[0].backgroundColor];
        const hoverBackgroundColor = [...data.datasets[0].hoverBackgroundColor];
        backgroundColor[index] = color;
        hoverBackgroundColor[index] = color;
        data.datasets[0].backgroundColor = [...backgroundColor];
        data.datasets[0].hoverBackgroundColor = [...hoverBackgroundColor];
        this.setState({data});
    }

    addNewData = () => {
        const data = cloneDeep(this.state.data);
        data.labels = [ ...this.state.data.labels, 'Label'];
        data.datasets[0].data = [ ...this.state.data.datasets[0].data, 100];
        data.datasets[0].backgroundColor = [ ...this.state.data.datasets[0].backgroundColor, '#FFFFF'];
        data.datasets[0].hoverBackgroundColor = [ ...this.state.data.datasets[0].hoverBackgroundColor, '#FFFFF'];
        this.setState({data});
    }

    removeData = (index) => {
        const data = cloneDeep(this.state.data);
        data.labels.splice(index,1);
        data.datasets[0].data.splice(index,1);
        data.datasets[0].backgroundColor.splice(index,1);
        data.datasets[0].hoverBackgroundColor.splice(index,1);
        this.setState({data});
    }

    handleCheckBoxChange = (e, index) => {
        const layoutData = cloneDeep(this.state.layoutData);
        layoutData[index].checked = !layoutData[index].checked;
        this.setState({layoutData});
    }

    handleOnSave = () => {
        const indexArr = this.state.layoutData.reduce( (newArr, item) => {
            if(item.checked) {
                newArr.push(item.index);
            }
            return newArr;
        }, [] );
        indexArr.push(this.props.chartIndex);
        this.props.saveData(indexArr, this.state.data);
    }

    renderCheckBoxGroup = () => {
        return (
            <Grid item xs={12}>
                <FormControl component="fieldset" className="checkbox-container">
                    <FormLabel component="legend">Replace chart data</FormLabel>
                    <FormGroup>
                        {
                            this.state.layoutData.map( (item, index) => {
                                return (
                                    <FormControlLabel
                                        key={item.name}
                                        control={
                                            <Checkbox disabled={index === this.props.chartIndex} checked={item.checked} onChange={(e) => this.handleCheckBoxChange(e,index)} />
                                        }
                                        label={item.name}
                                    />
                                )
                            })
                        }
                    </FormGroup>
                </FormControl>
            </Grid>
        )
    };

    renderTextFields = () => {
        return(
            this.state.data.labels.map( (i, index) => (
                <Grid container item xs={12} spacing={16} key={i}>
                    <Grid item xs={2}>
                        <TextField
                            id={`${index}Label`}
                            label="Label"
                            value={this.state.data.labels[index]}
                            onChange={({target:{value}}) => this.handleDataChange('labels', index, value)}
                            margin="normal"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            id={`${index}Value`}
                            type="number"
                            label="Value"
                            value={this.state.data.datasets[0].data[index]}
                            onChange={({target:{value}}) => this.handleDataChange('value', index, value)}
                            margin="normal"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={4} className="color-picker-container">
                        <CompactPicker
                            color={ this.state.data.datasets[0].backgroundColor[index] }
                            onChangeComplete={ ({hex}) => this.handleColorChange(hex, index) }
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <div className="action-button-container">
                            {
                                index > 1 &&
                                <Tooltip title="Remove chart data">
                                    <Button variant="fab" mini color="secondary" aria-label="Remove" onClick={() => this.removeData(index)}>
                                        <Icon>delete</Icon>
                                    </Button>
                                </Tooltip>
                            }
                            {
                                index === this.state.data.labels.length - 1 &&
                                <Tooltip title="Add new chart data">
                                    <Button variant="fab" mini color="primary" aria-label="Add" onClick={this.addNewData}>
                                        <Icon>add</Icon>
                                    </Button>
                                </Tooltip>
                            }
                        </div>
                    </Grid>
                </Grid>
            ) )
        )
    }

    render() {
        return(
            <Modal
                open={this.props.open}
                onClose={this.props.onClose}
                className="modal"
            >
                <div className="container">
                    <Grid container>
                        <Grid item xs={12} className="close-modal-container">
                        <Tooltip title="Close">
                            <IconButton onClick={() => this.props.onClose()}>
                                <Icon color='action'>close</Icon>
                            </IconButton>
                        </Tooltip>
                        </Grid>
                        {this.renderTextFields()}
                        {this.renderCheckBoxGroup()}
                        <Grid container item xs={12} className="button-container">
                            <Button variant="contained" color="primary" onClick={() => this.handleOnSave()}>
                                Save
                            </Button>
                            <Button variant="contained" color="secondary" onClick={() => this.props.removeData()}>
                                Remove
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </Modal>
        )
    }
}