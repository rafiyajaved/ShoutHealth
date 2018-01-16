/* jslint node: true, esnext: true */
'use strict';

import React from 'react';

const K_WIDTH = 15;
const K_HEIGHT = 15;

const style = {
    // initially any map object has left top corner at lat lng coordinates
    // it's on you to set object origin to 0,0 coordinates
    margin: '11px 0px 0px -12px',
    background: '#ff0000',
    display: 'inline-block',
    borderRadius: '14px 14px 14px 14px',
    width: '8px',
    height: '8px',
    border: '5px solid #ff0000',
    position: 'absolute',
};

export default class UserLocation extends React.Component {

  constructor(props) {
      super(props);

  }

    render() {

        return (
        <div style={style}></div>
        );
    }
};
