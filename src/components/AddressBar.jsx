/* jslint node: true, esnext: true */
'use strict';

import React from 'react';
/*Modules */
import PlacesAutocomplete from 'react-places-autocomplete'
import RaisedButton from 'material-ui/RaisedButton';
import MapsPlace from 'material-ui/svg-icons/maps/place';

const styles = {

    icon: {
        marginTop: 10
    },
    wrapper: {
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
        marginTop: 10
    },
};

export default class AddressBar extends React.Component {


render() {

  const { submit, address, onChange }= this.props;

    const inputProps = {
      value: address,
      onChange: onChange,
    }
    return (

      <div style={styles.wrapper}>
        <div style={styles.icon}>
          <MapsPlace />
        </div>
        <div style={styles.places}>
            <PlacesAutocomplete inputProps={inputProps} />
        </div>
        <div style={styles.button}>
        <RaisedButton
          label ="Go"
          onTouchTap={()=>submit()}/>
        </div>
      </div>

    );
  }
}
