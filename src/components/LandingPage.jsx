/* jslint node: true, esnext: true */
'use strict';

// JavaScript source code
import React from 'react';
import AddressBar from './AddressBar.jsx';

export default class LandingPage extends React.Component {

    render() {

        const { submit, address, onChange }= this.props;

        return (
            <div>
              <AddressBar submit={()=>submit()}
                          address={address}
                          onChange={onChange}/>
            </div>
        );
    }
}
