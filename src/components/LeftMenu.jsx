import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import Menu from 'material-ui/Menu';
import Divider from 'material-ui/Divider';


import ContentAdd from 'material-ui/svg-icons/content/add';
import SocialShare from 'material-ui/svg-icons/social/share';
import ActionSearch from 'material-ui/svg-icons/action/search';
import ActionBook from 'material-ui/svg-icons/action/book';
import ContentMail from 'material-ui/svg-icons/content/mail';
import MapsEditLocation from 'material-ui/svg-icons/maps/edit-location';
import SocialPerson from 'material-ui/svg-icons/social/person';


import AddResource from './AddResource.jsx';
import UpdateDocs from './UpdateDocs.jsx';


export default class LeftMenu extends React.Component {
    constructor() {
        super()

        this.state = {
            changelocationOpen: false,
        };

    }

    getAdminOptions(){

      var userinfo=this.getUserinfo();
      if(userinfo){
          const role=userinfo.roles.indexOf("admin");
          if(role<0){
            return "";
          }else{
            return (<div><MenuItem primaryText="Update Resources" onTouchTap={() => displayUpdateDocs()}/>
            <MenuItem primaryText="View Pending Resources" onTouchTap={() => displayApproveDocs()}/></div>);
            }
        }else{
          return ""
        }
    }

    render() {

        const { displayAddResource, addResource, displayAbout, displayUpdateDocs, displayApproveDocs, getUserinfo} = this.props;
        this.displayUpdateDocs=displayUpdateDocs;
        this.displayApproveDocs=displayApproveDocs;
        this.getUserinfo=getUserinfo;



        return (
            <div id='menu'>
            <MenuItem primaryText="" />
            <MenuItem primaryText="Add New Resource" leftIcon={<ContentAdd />} onTouchTap={() => displayAddResource()}/>
            <MenuItem primaryText="About" leftIcon={<SocialPerson />} onTouchTap={() => displayAbout()}/>
            {this.getAdminOptions()}
            </div>
        )
    }
}
