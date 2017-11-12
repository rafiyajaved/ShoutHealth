/* jslint node: true, esnext: true */
'use strict';

// JavaScript source code
import React from 'react';
import AddressBar from './AddressBar.jsx';

const pathToBackground = require('../img/background.jpeg');
const pathToLogo = require('../img/transparent-logo.png');

const style = {

    wrapper: {
        backgroundImage: 'url(' + pathToBackground + ')',
        backgroundPosition: 'center',
        backgroundAttachment:'fixed'
    },

    logo: {
        height: "auto",
        width: "auto",
        display: "block",
        margin: "0 auto",
        maxWidth: "50%",
        maxHeight: "50%"
    }

}

export default class LandingPage extends React.Component {

    constructor(props) {
        super(props);
        props.setShouldShowHeaderAndDrawer(false);
    }

    componentWillUnmount() {
        this.props.setShouldShowHeaderAndDrawer(true);
    }

    render() {

        const { submit, address, onChange, setShouldShowHeaderAndDrawer }= this.props;

        return (
            <div id='wrapper' style={style.wrapper}>

                <img src={pathToLogo} style={style.logo} />
                <AddressBar submit={()=>submit()}
                            address={address}
                            onChange={onChange}/>
            </div>
        );
    }
}
