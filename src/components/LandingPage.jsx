/* jslint node: true, esnext: true */
'use strict';

// JavaScript source code
import React from 'react';
import AddressBar from './AddressBar.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import MapsPlace from 'material-ui/svg-icons/maps/place';
import PlacesAutocomplete from 'react-places-autocomplete'
import {Link} from 'react-router-dom';
import IconButton from 'material-ui/IconButton';
import AppBar from 'material-ui/AppBar';


const pathToAndroidBadge = require('../img/googlebadge.png');
const pathToBackground = require('../img/background2.jpg');
const pathToLogo = require('../img/transparent-logo.png');
const pathToLogoSmall = require('../img/logo.png');

const style = {

    appbar: {
      backgroundColor:'#B9D9E6',
      overflow:'hidden',
    },
    appbarTitle: {
        display: 'flex',
        flexDirection: 'row',
        position: 'absolute',
        color: 'black',
        overflow: 'hidden',
        marginLeft:10,
        fontSize:20
    },
    background:{
      backgroundColor:'black',
      height:'100%'
    },
    wrapper: {
        height:'530',
        backgroundImage: 'url(' + pathToBackground + ')',
        backgroundPosition: 'top',
        backgroundAttachment:'fixed',
        justifyContent: "center"
    },
    appstore: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: "center",
      padding:30,
      marginBottom:30,
    },
    logo: {
        height: "auto",
        width: "auto",
        display: "block",
        margin: "0 auto",
        maxWidth: "50%",
        maxHeight: "50%",
        marginTop: 50
    },

    titleText: {
        margin:50,
        color:'black',
        fontSize:40,
        maxWidth:'60%',
        textShadow: '2px 2px #d3d3d3',
    },
    addressBarWrapper: {
        marginLeft:50,
        display:"flex",
        flexDirection:"row",
        justifyContent: "left"
    },

    places: {
        zIndex:'10',
        marginTop: 10,
        marginRight: 30
    },

    button: {
        marginTop: 11,
        marginBottom: 1
    },

}

var queryString = encodeURIComponent('Atlanta, GA');

export default class LandingPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            address: 'Atlanta, GA',
            queryString: encodeURIComponent('Atlanta, GA')
        }
    }


    placesAutocompleteOnChange(newAddress, placeID) {
        this.setState({address: newAddress});
        this.state.queryString = encodeURIComponent(newAddress);
        console.log("queryString is: " + this.state.queryString + " and placeID is: " + placeID);
    }

    handleSearchClick() {
        console.log("address is: "+ this.state.address)
        this.state.queryString = encodeURIComponent(this.state.address);
    }

    render() {

        const { submit, address, onChange}= this.props;

        const inputProps = {
          value: this.state.address,
          onChange: (newAddress)=>this.setState({address: newAddress}),
        }

        return (
        <div style={style.background}>
        <div id='wrapper' style={style.wrapper}>
            <div>
                <div style={style.titleText}> Data-Driven Navigation of Community Health and Social Resources </div>
            <div style={style.addressBarWrapper}>
                <div style={style.places}>
                    <PlacesAutocomplete inputProps={inputProps}
                                        onSelect={(address, placeID)=>this.placesAutocompleteOnChange(address, placeID)} />
                </div>
                <RaisedButton label ="Search"
                              onTouchTap={()=>this.handleSearchClick()}
                              style={style.button}
                              containerElement={<Link to={"/home/?query=" + this.state.queryString} />}/>
            </div>
            <div style={style.appstore}>
            <div>
            <a href="https://play.google.com/store/apps/details?id=com.shouthealth.reacthotloadingtemplate"><img src={pathToAndroidBadge} height="60"/></a>
            </div>
            <div>
            <p>Coming soon to iOS</p>
            </div>
            </div>
          </div>
          </div>
          </div>

        );
    }
}
