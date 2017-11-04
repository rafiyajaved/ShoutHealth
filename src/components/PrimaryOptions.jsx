/* jslint node: true, esnext: true */
'use strict';

import React from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import ActionSearch from 'material-ui/svg-icons/action/search';
import IconButton from 'material-ui/IconButton';
import SelectField from 'material-ui/SelectField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionHome from 'material-ui/svg-icons/action/home';
import ActionPregnantWoman from 'material-ui/svg-icons/action/pregnant-woman';
import ActionVisibility from 'material-ui/svg-icons/action/visibility';
import PlacesChildCare from 'material-ui/svg-icons/places/child-care';
import SocialPerson from 'material-ui/svg-icons/social/person';
import MapsRestaurant from 'material-ui/svg-icons/maps/restaurant';
import ActionExtension from 'material-ui/svg-icons/action/extension';
import SvgIcon from 'material-ui/SvgIcon';


const HomeIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </SvgIcon>
);

const styles = {
    hint: {
        color: '#A9A9A9',
    },
    button: {
        marginTop: 7,
        justifyContent:"center",
        marginRight:10,
        display:'flex',
        flexDirection:'column',
        padding:'5'

    },
    wrapper:{
        zIndex:'0',
        display:'flex',
        flexDirection:'row',
        padding:8,
        justifyContent: "left",
        overflow: 'auto'
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
        const { container} = this.props;
        const { offsetHeight, offsetWidth } = container;
        this.setState({ offsetHeight, offsetWidth });
    }


    render() {
        const {container, getselectedIndex, onSelect } = this.props;
        this.onSelect = onSelect;
        var index = getselectedIndex();
        var { offsetWidth, offsetHeight } = this.state;
        if (offsetWidth=== undefined) {
            return null;
        }



        return (

        <div style={{width:offsetWidth}}>
        <div style={styles.wrapper}>
            <div style={styles.button}>
              <FlatButton
                backgroundColor={index===100?"#707070":"#000000"}
                hoverColor='#707070'
                onTouchTap={()=>onSelect(100)}
                style={styles.raisedButton}
                label="View All"
                icon={<ActionHome />}
                />
            </div>
            <div style={styles.button}>
              <FlatButton
                backgroundColor={index===0?"#707070":"#000000"}
                hoverColor='#707070'
                onTouchTap={()=>onSelect(0)}
                icon={<SocialPerson />}
                label="Adult"
                style={styles.raisedButton}/>
            </div>
            <div style={styles.button}>
              <FlatButton
                backgroundColor={index===1?"#707070":"#000000"}
                hoverColor='#707070'
                onTouchTap={()=>onSelect(1)}
                icon={<ActionPregnantWoman />}
                style={styles.raisedButton}
                label="Women's Health"/>
            </div>
            <div style={styles.button}>
              <FlatButton
                backgroundColor={index===2?"#707070":"#000000"}
                hoverColor='#707070'
                onTouchTap={()=>onSelect(2)}
                icon={<PlacesChildCare />}
                style={styles.raisedButton}
                label="Child"/>
            </div>
            <div style={styles.button}>
              <FlatButton
                backgroundColor={index===3?"#707070":"#000000"}
                hoverColor='#707070'
                onTouchTap={()=>onSelect(3)}
                icon={<ActionExtension />}
                label="Mental Health"
                style={styles.raisedButton}/>
            </div>
            <div style={styles.button}>
              <FlatButton
                backgroundColor={index===4?"#707070":"#000000"}
                onTouchTap={()=>onSelect(4)}
                hoverColor='#707070'
                style={styles.raisedButton}
                label="Dental"/>
            </div>
            <div style={styles.button}>
              <FlatButton
                backgroundColor={index===5?"#707070":"#000000"}
                hoverColor='#707070'
                onTouchTap={()=>onSelect(5)}
                icon={<ActionVisibility />}
                style={styles.raisedButton}
                label="Vision"/>
            </div>
            <div style={styles.button}>
              <FlatButton
                backgroundColor={index===6?"#707070":"#000000"}
                hoverColor='#707070'
                onTouchTap={()=>onSelect(6)}
                icon={<MapsRestaurant />}
                style={styles.raisedButton}
                label="Food"/>
            </div>
            <div style={styles.button}>
              <FlatButton
                backgroundColor={index===6?"#707070":"#000000"}
                hoverColor='#707070'
                icon={<ActionHome />}
                onTouchTap={()=>onSelect(6)}
                style={styles.raisedButton}
                label="Housing"/>
            </div>
        </div>
        </div>
        );
    }
}
