/* jslint node: true, esnext: true */
'use strict';

import React from 'react';
import AppBar from 'material-ui/AppBar';
import {Switch, Route, Link, withRouter, BrowserRouter} from 'react-router-dom';
import ActionAccountCircle from 'material-ui/svg-icons/action/account-circle';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';

const pathToLogo = require('../img/transparent-logo.png');



const styles = {
    appbar: {
      backgroundColor:'transparent',
      height:60
    },
    appbarTitle: {
        display: 'flex',
        flexDirection: 'row',
        position: 'absolute',
        color: 'black',
        marginLeft:30,
        fontSize:20
    },
    headermenu: {
        position: 'absolute',
        right:5,
        paddingTop:7,
        display: 'flex',
        flexDirection: 'row',
        fontColor: '#FFFFFF'
    },

};


export default class AppBarCustom extends React.Component {

    getMenuOptions(){
        if (this.props.loggedin) {
            return <IconMenu
                  iconButtonElement={<IconButton><ActionAccountCircle /></IconButton>}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                >
              <MenuItem primaryText ="My Account"
                        containerElement={<Link to="/MyAccount" />}/>
              <MenuItem primaryText="Logout"
                        containerElement={<Link to="/Logout" />}/>
              <MenuItem primaryText ="Help"
                        containerElement={<Link to="/Help" />} />
              <MenuItem primaryText="About"
                        containerElement={<Link to="/About" />} />
              <MenuItem primaryText="Blog"
                        containerElement={<Link to="/Blog" />}/>
            </IconMenu>
        } else {
            return <IconMenu
                  iconButtonElement={<IconButton><ActionAccountCircle /></IconButton>}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                >
              <MenuItem primaryText ="Login"
                        containerElement={<Link to="/Login" />} />
              <MenuItem primaryText ="Register"
                        containerElement={<Link to="/Register" />} />
              <MenuItem primaryText="About"
                        containerElement={<Link to="/About" />} />
              <MenuItem primaryText="Blog"
                        containerElement={<Link to="/Blog" />}/>
              <MenuItem primaryText ="Help"
                        containerElement={<Link to="/Help" />} />
            </IconMenu>
        }
    }

    render() {

        const {loggedin} = this.props;

        return (

          <AppBar style={styles.appbar}>
            <div style={styles.appbarTitle}>
                <Link to="/"><img src={pathToLogo} height="60"/></Link>
            </div>
            <div style={styles.headermenu}>
                {this.getMenuOptions()}
            </div>
        </AppBar>
        );
    }
}
