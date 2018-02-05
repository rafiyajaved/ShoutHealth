/* jslint node: true, esnext: true */
'use strict';

import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {Switch, Route, Link, withRouter, BrowserRouter} from 'react-router-dom';


export default class Logout extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      dialogOpen: false
    }
  }

  logout() {
    this.setState({
      dialogOpen: true
    })
  }

  handleClose() {
    this.setState({
      dialogOpen: false
    })
    this.props.handleLogout()
  }

  render() {

    const actionButton = <Link to="/home"><FlatButton
                            label="OK"
                            primary={true}
                            onTouchTap={()=>this.handleClose()}
                          /></Link>

    return (

      <div>
        <Dialog
           title="Logout Successful!"
           actions={actionButton}
           modal={false}
           open={true}
           onRequestClose={()=>this.handleClose()}
       >
         Logout completed Successfully!
       </Dialog>

      </div>
    )

  }

}
