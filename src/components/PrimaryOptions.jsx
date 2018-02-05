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
import MapsLocalHospital from 'material-ui/svg-icons/maps/local-hospital';
import ActionShoppingCart from 'material-ui/svg-icons/action/shopping-cart';
import SocialSchool from 'material-ui/svg-icons/social/school';
import ActionPregnantWoman from 'material-ui/svg-icons/action/pregnant-woman';
import ActionVisibility from 'material-ui/svg-icons/action/visibility';
import PlacesChildCare from 'material-ui/svg-icons/places/child-care';
import Icon from './Icon.jsx';



const styles = {
    hint: {
        color: '#A9A9A9',
    },
    button: {
        marginRight:15,
        display:'flex',
        flexDirection:'column',
        textAlign:'center'
    },
    wrapper:{
        zIndex:'0',
        display:'flex',
        flexDirection:'row',
        padding:8,
        overflow: 'auto',
        flexShrink: 0,
        marginTop:15
    },
    filterButton: {
        color: 'white',
        margin: 5,
        backgroundColor: '#000000',
        border: 'none',
        borderRadius: 8,
        fontSize: 14,
    },
    selected: {
        color: 'white',
        margin: 5,
        backgroundColor: '#707070',
        border: 'none',
        borderRadius: 8,
        fontSize: 14,
    },
    raisedButton: {
        position: 'relative',
        zIndex: 0,
        color:'#FFFFFF',
    }
};


export default class PrimaryOptions extends React.Component {
    constructor(props) {
        super(props);
        this.state={
        offsetWidth:0
        }
    }

    componentDidMount() {
        this.searchSizer();
        window.addEventListener('resize', () => this.searchSizer(), false);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.searchSizer, false);
    }


    searchSizer() {
        var offsetHeight = document.getElementById('content').clientHeight
        var offsetWidth = document.getElementById('content').clientWidth
        this.setState({ offsetHeight, offsetWidth });
    }


    render() {
        const {container, getselectedIndex, onSelect } = this.props;
        var index = getselectedIndex();
        var { offsetWidth, offsetHeight } = this.state;
        if (offsetWidth=== undefined) {
            return null;
        }



        return (

        <div style={{width:offsetWidth}}>
        <div style={styles.wrapper}>
            <div style={styles.button} >
              <FlatButton
                backgroundColor={index===100?"#707070":"#000000"}
                hoverColor='#707070'
                onTouchTap={()=>onSelect(100)}
                icon={<ActionHome />}
                style={styles.raisedButton}/>
                View All
            </div>
            <div style={styles.button}>
              <FlatButton
                backgroundColor="#000000"
                hoverColor='#707070'
                onTouchTap={()=>onSelect(0)}
                icon={<Icon icon='Family' icon2='None'/>}
                style={styles.raisedButton}/>
                Adult
            </div>
            <div style={styles.button} backgroundColor={index===100?"#707070":"#000000"}>
              <FlatButton
                backgroundColor={index===10?"#707070":"#000000"}
                hoverColor='#707070'
                onTouchTap={()=>onSelect(10)}
                icon={<Icon icon='Women' icon2='Women2'/>}
                style={styles.raisedButton}/>
                Women's Health
            </div>
            <div style={styles.button} backgroundColor={index===100?"#707070":"#000000"}>
              <FlatButton
                backgroundColor={index===20?"#707070":"#000000"}
                hoverColor='#707070'
                onTouchTap={()=>onSelect(20)}
                icon={<PlacesChildCare />}
                style={styles.raisedButton}/>
                Children and Youth
            </div>
            <div style={styles.button} backgroundColor={index===100?"#707070":"#000000"}>
              <FlatButton
                backgroundColor={index===90?"#707070":"#000000"}
                hoverColor='#707070'
                onTouchTap={()=>onSelect(90)}
                icon={<MapsLocalHospital />}
                style={styles.raisedButton}/>
                Emergency
            </div>
            <div style={styles.button} backgroundColor={index===100?"#707070":"#000000"}>
              <FlatButton
                backgroundColor={index===30?"#707070":"#000000"}
                hoverColor='#707070'
                onTouchTap={()=>onSelect(30)}
                icon={<Icon icon='Mental' icon2='None'/>}
                style={styles.raisedButton}/>
                Mental Health
            </div>
            <div style={styles.button} backgroundColor={index===100?"#707070":"#000000"}>
              <FlatButton
                backgroundColor={index===40?"#707070":"#000000"}
                onTouchTap={()=>onSelect(40)}
                hoverColor='#707070'
                icon={<Icon icon='Dental' icon2='None'/>}
                style={styles.raisedButton}/>
                Dental
            </div>
            <div style={styles.button} backgroundColor={index===100?"#707070":"#000000"}>
              <FlatButton
                backgroundColor={index===50?"#707070":"#000000"}
                hoverColor='#707070'
                onTouchTap={()=>onSelect(50)}
                icon={<ActionVisibility />}
                style={styles.raisedButton}/>
                Vision
            </div>
            <div style={styles.button} backgroundColor={index===100?"#707070":"#000000"}>
              <FlatButton
                backgroundColor={index===60?"#707070":"#000000"}
                hoverColor='#707070'
                onTouchTap={()=>onSelect(60)}
                icon={<Icon icon='Social' icon2='None'/>}
                style={styles.raisedButton}/>
                Housing
            </div>
            <div style={styles.button} backgroundColor={index===100?"#707070":"#000000"}>
              <FlatButton
                backgroundColor={index===70?"#707070":"#000000"}
                hoverColor='#707070'
                onTouchTap={()=>onSelect(70)}
                icon={<ActionShoppingCart />}
                style={styles.raisedButton}/>
                Food and Utilities
            </div>
            <div style={styles.button} backgroundColor={index===100?"#707070":"#000000"}>
              <FlatButton
                backgroundColor={index===80?"#707070":"#000000"}
                hoverColor='#707070'
                onTouchTap={()=>onSelect(80)}
                icon={<SocialSchool />}
                style={styles.raisedButton}/>
                Adult Education
            </div>
        </div>
        </div>
        );
    }
}
