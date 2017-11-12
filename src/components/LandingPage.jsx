/* jslint node: true, esnext: true */
'use strict';

// JavaScript source code
import React from 'react';
import AddressBar from './AddressBar.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import MapsPlace from 'material-ui/svg-icons/maps/place';
import PlacesAutocomplete from 'react-places-autocomplete'
import {Link} from 'react-router-dom';

const pathToBackground = require('../img/background.jpeg');
const pathToLogo = require('../img/transparent-logo.png');

const style = {

    wrapper: {
        backgroundImage: 'url(' + pathToBackground + ')',
        backgroundPosition: 'center',
        backgroundAttachment:'fixed'
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

    addressBarWrapper: {
        display:"flex",
        flexDirection:"row",
        justifyContent: "center"
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
        props.setShouldShowHeaderAndDrawer(false);
        this.state = {
            address: 'Atlanta, GA',
            queryString: encodeURIComponent('Atlanta, GA')
        }
    }

    componentWillUnmount() {
        this.props.setShouldShowHeaderAndDrawer(true);
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

        const { submit, address, onChange, setShouldShowHeaderAndDrawer }= this.props;

        const inputProps = {
          value: this.state.address,
          onChange: (newAddress)=>this.setState({address: newAddress}),
        }

        return (
            <div id='wrapper' style={style.wrapper}>

                <img src={pathToLogo} style={style.logo} />
                <div style={style.addressBarWrapper}>
                    <div style={style.places}>
                        <PlacesAutocomplete inputProps={inputProps}
                                            onSelect={(address, placeID)=>this.placesAutocompleteOnChange(address, placeID)} />
                    </div>
                    <RaisedButton label ="Search"
                                  onTouchTap={()=>this.handleSearchClick()}
                                  style={style.button}
                                  containerElement={<Link to={"/?query=" + this.state.queryString} />}/>
                </div>

            </div>
        );
    }
}
