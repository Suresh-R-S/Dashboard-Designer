import React, {Component, Fragment} from 'react';
import AppBar from '@material-ui/core/AppBar';

import './style.css';

export default class Dashboard extends Component {
    render() {
        return (
            <Fragment>
                <AppBar>
                    <h2 className="title">Dashboard Designer</h2>
                </AppBar>
            </Fragment>
        );
    }
}