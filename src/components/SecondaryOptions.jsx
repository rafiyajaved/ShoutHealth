/* jslint node: true, esnext: true */
'use strict';

import React from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import ActionSearch from 'material-ui/svg-icons/action/search';
import SelectField from 'material-ui/SelectField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionHome from 'material-ui/svg-icons/action/home';
import ActionPregnantWoman from 'material-ui/svg-icons/action/pregnant-woman';
import ActionVisibility from 'material-ui/svg-icons/action/visibility';
import PlacesChildCare from 'material-ui/svg-icons/places/child-care';

const styles = {
    wrapper:{
        zIndex:'0',
        display:'flex',
        flexDirection:'row',
        padding:8,
        flexShrink: 0,
        overflow:'auto',
    },
    secondaryButton: {
        color: '#F06292',
        display:'flex',
        marginRight:10,
        border: '1px solid #BEBEBE',
    },
    label: {
        fontSize:12
    },
    text: {
      paddingLeft:10,
      paddingRight:10
    },
};


export default class SecondaryOptions extends React.Component {
    constructor(props) {
        super(props);
    }

    getOptions(index){
    var adultIndices=[0, 7, 8, 9];
    var womensIndices=[10, 11, 12, 13, 14];
    var childrenIndices=[20, 21, 22, 23];
    var emergencyIndices=[90];
    var mentalIndices=[30, 31, 32, 33];
    var dentalIndices=[40, 41, 42, 43];
    var visionIndices=[50, 51, 52];
    var housingIndices=[60, 61, 62, 63];
    var foodIndices=[70, 71, 72];
    var utilityIndices=[80, 81, 82];
    var educationIndices=[110, 111];

    if(index==100){
        return(
        <div style={styles.wrapper}>
          <FlatButton
                          style={styles.secondaryButton}
 labelStyle={styles.label}
                backgroundColor={index===7?"#E8E8E8":"#FFFFFF"} label=" Showing All Results "/>
        </div>
        )
    }
    else if(adultIndices.includes(index)){
        return(
        <div style={styles.wrapper}>
            <FlatButton
                    style={styles.secondaryButton}
                    labelStyle={styles.label}
                    onClick={() => this.onSelect(7)}
                    backgroundColor={index===7?"#E8E8E8":"#FFFFFF"}
                    label="Check-up" />
            <FlatButton
                    style={styles.secondaryButton}
                    labelStyle={styles.label}
                    onClick={() => this.onSelect(8)}
                    backgroundColor={index===8?"#E8E8E8":"#FFFFFF"}
                    label="Emergency rooms"/>
            <FlatButton
                    style={styles.secondaryButton}
                    labelStyle={styles.label}
                    onClick={() => this.onSelect(9)}
                    backgroundColor={index===9?"#E8E8E8":"#FFFFFF"} label="Chronic Disease Management"/>
            <FlatButton
                  style={styles.secondaryButton}
                  labelStyle={styles.label}
                    onClick={() => this.onSelect(10)}
                    backgroundColor={index===10?"#E8E8E8":"#FFFFFF"} label="STD Testing"/>
        </div>);
    }
    else if(womensIndices.includes(index)){
      return(
      <div style={styles.wrapper}>
          <FlatButton
                  style={styles.secondaryButton}
                  labelStyle={styles.label}
                  onClick={() => this.onSelect(11)}
                  backgroundColor={index===11?"#E8E8E8":"#FFFFFF"} label="Pregnancy Test"/>
          <FlatButton
                  style={styles.secondaryButton}
                  labelStyle={styles.label}
                  onClick={() => this.onSelect(12)}
                  backgroundColor={index===12?"#E8E8E8":"#FFFFFF"} label="Pap Smear"/>
          <FlatButton
                  style={styles.secondaryButton}
                  labelStyle={styles.label}
                  onClick={() => this.onSelect(13)}
                  backgroundColor={index===13?"#E8E8E8":"#FFFFFF"} label="Mammogram"/>
          <FlatButton
                  style={styles.secondaryButton}
                  labelStyle={styles.label}
                  onClick={() => this.onSelect(14)}
                  backgroundColor={index===14?"#E8E8E8":"#FFFFFF"} label="Birth Control"/>
      </div>);
    }else if(childrenIndices.includes(index)){
      return(
      <div style={styles.wrapper}>
          <FlatButton
                  style={styles.secondaryButton}
                  labelStyle={styles.label}
                  onClick={() => this.onSelect(21)}
                  backgroundColor={index===21?"#E8E8E8":"#FFFFFF"} label="Immunization"/>
          <FlatButton
                  style={styles.secondaryButton}
                  labelStyle={styles.label}
                  onClick={() => this.onSelect(22)}
                  backgroundColor={index===22?"#E8E8E8":"#FFFFFF"} label="Check-up"/>
          <FlatButton
                  style={styles.secondaryButton}
                  labelStyle={styles.label}
                  onClick={() => this.onSelect(23)}
                  backgroundColor={index===23?"#E8E8E8":"#FFFFFF"} label="Emergency"/>
      </div>);
    }else if(mentalIndices.includes(index)){
      return(
      <div style={styles.wrapper}>
          <FlatButton
                  style={styles.secondaryButton}
                  labelStyle={styles.label}
                  onClick={() => this.onSelect(31)}
                  backgroundColor={index===31?"#E8E8E8":"#FFFFFF"} label="Behavioral Health"/>
          <FlatButton
                  style={styles.secondaryButton}
                  labelStyle={styles.label}
                  onClick={() => this.onSelect(32)}
                  backgroundColor={index===32?"#E8E8E8":"#FFFFFF"} label="Counseling"/>
          <FlatButton
                  style={styles.secondaryButton}
                  labelStyle={styles.label}
                  onClick={() => this.onSelect(33)}
                  backgroundColor={index===33?"#E8E8E8":"#FFFFFF"} label="Psychiatric Emergency"/>
      </div>);
    }else if(dentalIndices.includes(index)){
      return(
      <div style={styles.wrapper}>
          <FlatButton
                  style={styles.secondaryButton}
                  labelStyle={styles.label}
                  onClick={() => this.onSelect(41)}
                  backgroundColor={index===41?"#E8E8E8":"#FFFFFF"} label="Basic filling/extraction"/>
          <FlatButton
                  style={styles.secondaryButton}
                  labelStyle={styles.label}
                  onClick={() => this.onSelect(42)}
                  backgroundColor={index===42?"#E8E8E8":"#FFFFFF"} label="Cleaning"/>
          <FlatButton
                  style={styles.secondaryButton}
                  labelStyle={styles.label}
                  onClick={() => this.onSelect(43)}
                  backgroundColor={index===43?"#E8E8E8":"#FFFFFF"} label="Advanced dental"/>
      </div>);
    }else if(visionIndices.includes(index)){
      return(
      <div style={styles.wrapper}>
          <FlatButton
                  style={styles.secondaryButton}
                  labelStyle={styles.label}
                  onClick={() => this.onSelect(51)}
                  backgroundColor={index===51?"#E8E8E8":"#FFFFFF"} label="Vision testing"/>
          <FlatButton
                  style={styles.secondaryButton}
                  labelStyle={styles.label}
                  onClick={() => this.onSelect(52)}
                  backgroundColor={index===52?"#E8E8E8":"#FFFFFF"} label="Retina"/>
      </div>);
    }else if(housingIndices.includes(index)){
      return(
      <div style={styles.wrapper}>
          <FlatButton
                  style={styles.secondaryButton}
                  labelStyle={styles.label}
                  onClick={() => this.onSelect(61)}
                  backgroundColor={index===61?"#E8E8E8":"#FFFFFF"} label="Affordable Housing"/>
          <FlatButton
                  style={styles.secondaryButton}
                  labelStyle={styles.label}
                  onClick={() => this.onSelect(62)}
                  backgroundColor={index===62?"#E8E8E8":"#FFFFFF"} label="Domestic Violence Shelters"/>
          <FlatButton
                  style={styles.secondaryButton}
                  labelStyle={styles.label}
                  onClick={() => this.onSelect(63)}
                  backgroundColor={index===63?"#E8E8E8":"#FFFFFF"} label="Youth Housing"/>
      </div>);
    }else if(foodIndices.includes(index)){
      return(
      <div style={styles.wrapper}>
          <FlatButton
                  style={styles.secondaryButton}
                  labelStyle={styles.label}
                  onClick={() => this.onSelect(71)}
                  backgroundColor={index===62?"#E8E8E8":"#FFFFFF"} label="Food Pantries"/>
          <FlatButton
                  style={styles.secondaryButton}
                  labelStyle={styles.label}
                  onClick={() => this.onSelect(72)}
                  backgroundColor={index===62?"#E8E8E8":"#FFFFFF"} label="Utilities Assistance"/>
      </div>);
    }
    else if(educationIndices.includes(index)){
      return(
      <div style={styles.wrapper}>
        <FlatButton
                style={styles.secondaryButton}
                labelStyle={styles.label}
                onClick={() => this.onSelect(81)}
                backgroundColor={index===63?"#E8E8E8":"#FFFFFF"} label="Employment Assistance"/>
      </div>);
    }
    }


    render() {
        const {getselectedIndex, onSelect } = this.props;
        this.onSelect = onSelect;
        var index = getselectedIndex();



        return (
        <div style={styles.wrapper}>
          {this.getOptions(index)}
        </div>
        );
    }
}
