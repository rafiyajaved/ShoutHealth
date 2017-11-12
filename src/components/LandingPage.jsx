/* jslint node: true, esnext: true */
'use strict';

// JavaScript source code
import React from 'react';
import AddressBar from './AddressBar.jsx';

const pathToBackground = require('../img/background.jpeg');
const style = {

    wrapper: {
        backgroundImage: 'url(' + pathToBackground + ')',
        backgroundPosition: 'center',
        backgroundAttachment:'fixed'
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
              <AddressBar submit={()=>submit()}
                          address={address}
                          onChange={onChange}/>
            </div>
        );
    }
}
