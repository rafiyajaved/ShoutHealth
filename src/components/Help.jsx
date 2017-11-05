/* jslint node: true, esnext: true */
'use strict';

// JavaScript source code
import React from 'react';
import Paper from 'material-ui/Paper';

const styles = {
    main: {
        padding:15,
        opacity:0.8,
        width:'100%',
        alignment: 'right',
        overflow: 'auto'
    },
};

export default class About extends React.Component {
    render() {
        return (
            <Paper style={styles.main}>
                <img src={require('../img/help.jpg')} ></img>
            </Paper>
        );
    }
}
