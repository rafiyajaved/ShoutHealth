/* jslint node: true, esnext: true */
'use strict';

import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';

export default class SwitchViewButton extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {

    const {switchView, getView}=this.props;
    var view=getView();
        return (
                <RaisedButton
                  secondary={true}
                  label={view? "Map View" : "List View"}
                  onTouchTap={()=>switchView()}
                  />
        )
    }

}
