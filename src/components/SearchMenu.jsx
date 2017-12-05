/* jslint node: true, esnext: true */
'use strict';

// JavaScript source code
import React from 'react';
import AddressBar from './AddressBar.jsx';
import SearchBar from './SearchBar.jsx';

export default class SearchMenu extends React.Component {

    render() {
        return (
            <div>
              <AddressBar submit={()=>this.addressSearchSubmit()}
                          address={this.props.address}
                          onChange={(address)=>this.setState({address})}/>
              <SearchBar/>
            </div>
        );
    }
}
