/**

The main component with the app's actions and 'store.'

**/

import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Drawer from 'material-ui/Drawer';

import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';

import {resources} from '../lib/resources.js';

//import other components & pages
import Search from './Search.jsx';
import SearchInputs from './SearchInputs.jsx';
import Footer from './Footer.jsx';
import LeftMenu from './LeftMenu.jsx';
import ClinicPage from './ClinicPage.jsx';
import AddResource from './AddResource.jsx';
import About from './About.jsx';


// all of the CSS styles for this component defined here
const styles = {
  appbarTitle: {
    fontSize: '30',
  },

  appbarsubtitle: {
    fontSize: '15',
    color: '#ffffff',
    divAlign:'left',
    textAlign:'center',
    width: '60%'
  },

  stylemenu:{
      position: 'fixed',
      height: '100%',
  },
};

//begin Component definition

export default class App extends React.Component {

  constructor () {
    super();

    // this component's state acts as the overall store for now
    this.state = {
        allResources: [...resources],
        filteredResources: resources,
        showMenu: false,
        searchString: '',
        appbarState: false,
        selectedFooterIndex: 0,
        appbarTitle: 'Shout',
        appbarSubtitle: 'Find Accessible Healthcare.',
        appbarIcon: <NavigationMenu />,
        hoveredMapRowIndex: '-1',
        userLat: '33.7490',
        userLng: '-84.3880',
    };


  }
  // Add a resource to the collection
  addResource (res) {
      this.setState({allResources: [...this.state.allResources, res]});
      this.filterResources(this.state.searchString);
  }


  // onClick function for toggling menu state
  appbarClick () {
       if (!this.state.appbarState) {
           this.setState({showMenu: !this.state.showMenu});
       } else {
          this.displaySearch();
       }
    }

  componentDidMount () {
    this.displaySearch();
  }
    // these are the app's actions, passed to and called by other components

  displayAddResource() {
    this.setState({appbarIcon:<NavigationChevronLeft />});
    this.setState({appbarTitle:"Add Resource"});
    this.setState({appbarSubtitle:' '});
    this.setState({appbarState:true});
    this.setState({showMenu: false});
    this.setState({screen: <AddResource container={this.refs.content} footer={this.refs.footer} displaySearch={(result) => this.displaySearch()} />});
  }

  displayFeedback () {
    this.setState({screen: <Feedback displaySearch={(result)=>this.displaySearch()} />});
    this.setState({showMenu: !this.state.showMenu});
  }

  displayResult (result) {
    const clinicname=result.name;
    this.setState({appbarIcon:<NavigationChevronLeft />});
    this.setState({appbarTitle:clinicname});
    this.setState({appbarSubtitle:' '});
    this.setState({appbarState:true});
    this.setState({screen: <ClinicPage container={this.refs.content} footer={this.refs.footer} displaySearch={(result) => this.displaySearch()} result={result} />});
  }
  displaySearch () {
    this.setState({screen: <Search container={this.refs.content} footer={this.refs.footer} displayResult={(result) => this.displayResult(result)} filterResources={(string) => this.filterResources(string)} searchString={this.state.searchString} getFilteredResources={() => this.state.filteredResources} userLat={this.state.userLat} userLng={this.state.userLng} />});
    this.setState({appbarTitle:'Shout'});
    this.setState({appbarSubtitle:'Find Accessible Healthcare.'});
    this.setState({appbarState:false});
    this.setState({appbarIcon:<NavigationMenu />});
    this.requestCurrentPosition();
  }

  filterResources (searchString) {
    if (!searchString || searchString.length < 1) {
      this.setState({filteredResources: this.state.allResources, searchString});
      return;
    }
    const filteredResources = this.state.allResources.filter(resource => {
                                                                            if(resource.name.toLowerCase().includes(searchString.toLowerCase())||resource.tags.includes(searchString.toLowerCase())){
                                                                              return resource;
                                                                            }
                                                                          });
    this.setState({filteredResources, searchString});
  }

  /*Change the selected bottom navigation index (this function is passed as a prop to the footer)*/
  footerSelect(index) {
      this.setState({selectedFooterIndex: index});
      if(index===0) {
        this.filterResources('');
      } else if(index===1){
        this.filterResources('children');
      }else if(index===2){
        this.filterResources('mental health');
      }else if(index===3){
        this.filterResources('pregnancy');
      }else if(index===4){
        this.filterResources('');
      }
  }

  hoverTableRow(index) {
       hoveredMapRowIndex: 'index';
  }



  error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
  }

  requestCurrentPosition(){
      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }

      if (navigator.geolocation)
      {
        navigator.geolocation.getCurrentPosition((pos)=>{
                                                      var crd=pos.coords;
                                                      const x=crd.latitude;
                                                      const y=crd.longitude;
                                                      this.setState({userLat:x});
                                                      this.setState({userLng:y});
                                                      console.log(x,y);
                                                      }, this.error, options);
      }
  }



// end of actions

render () {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div id='wrapper'>

          <div id='header'>
              <AppBar iconElementLeft={<IconButton>{this.state.appbarIcon}</IconButton>} onLeftIconButtonTouchTap={() => this.appbarClick()} title={this.state.appbarTitle} titleStyle={styles.appbarTitle}>
                <div style={styles.appbarsubtitle}><h4>{this.state.appbarSubtitle}</h4></div>
              </AppBar>
          </div>


          <div ref='content' id='content'>
          <CSSTransitionGroup transitionName='push' transitionEnterTimeout={ 300 } transitionLeaveTimeout={ 300 }>
            {this.state.screen}
          </CSSTransitionGroup>
          </div>

          <div id='menu'>
             <Drawer
             open={this.state.showMenu}
             style={styles.stylemenu}
             docked={false}
             onRequestChange={(showMenu) => this.setState({showMenu})}>
               <LeftMenu displayAddResource={() => this.displayAddResource()} displayAbout={() => this.displayAbout()}/>
            </Drawer>
         </div>


          <div ref='footer' id='footer'>
            <Footer displayAddResource={() => this.displayAddResource()} selectedIndex={this.state.selectedFooterIndex} onSelect={(index) => this.footerSelect(index)}/>
          </div>

        </div>
      </MuiThemeProvider>

    );
  }
}
