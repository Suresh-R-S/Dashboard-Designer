import React, {Component} from 'react';
import {cloneDeep} from 'lodash';
import {Grid, Modal, TextField, Button} from '@material-ui/core';

import './style.css';

export default class ChartData extends Component {

    state = {
        data : this.props.modalData
    }

    handleDataChange = (type, index, textVal) => {
        const data = cloneDeep(this.state.data);
        if (type === 'labels') {
            const labels = cloneDeep(data.labels);
            labels[index] = textVal;
            data.labels = labels;
        }
        else {
            const value = cloneDeep(data.datasets[0].data);
            value[index] = parseInt(textVal);
            data.datasets[0].data = value;
        }
        this.setState({
            data
        })
    }

    renderTextFields = () => {
        return(
            this.state.data.labels.map( (i, index) => (
                <Grid container item xs={12} spacing={16}>
                    <Grid item xs={4}>
                        <TextField
                            id={`${index}Label`}
                            label="Label"
                            value={this.state.data.labels[index]}
                            onChange={({target:{value}}) => this.handleDataChange('labels', index, value)}
                            margin="normal"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={4}>
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
                </Grid>
            ) )
        )
    }

    render() {
        return(
            <Modal
                open={this.props.open}
                onClose={this.props.onClose}
            >
                <div className="container">
                    <Grid container>
                        {this.renderTextFields()}
                        <Grid container item xs={12}>
                            <Button variant="contained" color="primary" onClick={() => this.props.saveData(this.state.data,this.props.chartIndex)}>
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </Modal>
        )
    }
}