/* jslint node: true, esnext: true */
'use strict';

// JavaScript source code
import React from 'react';
import Paper from 'material-ui/Paper';

import AddressBar from './AddressBar.jsx';

const styles = {
    main: {
        padding:15,
        opacity:0.8,
        width:'100%',
        alignment: 'right',
        overflow: 'auto'
    },
};

export default class LandingPage extends React.Component {

    render() {

        const { submit, address, onChange }= this.props;

        const inputProps = {
          value: address,
          onChange: onChange,
        }

        return (
            <div>
              <AddressBar submit={()=>submit()}
                          address={address}
                          onChange={(address)=>onChange({address})}/>
            </div>
        );
    }
}
