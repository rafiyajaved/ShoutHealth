/* jslint node: true, esnext: true */
'use strict';

import React from 'react';
import Map from './Map.jsx';
import Results from './Results.jsx';
import SwitchViewButton from './SwitchViewButton.jsx';
import { cyan300, indigo900 } from 'material-ui/styles/colors';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';

const queryString = require('query-string');

import {withRouter, Link} from 'react-router-dom';
const styles={

  wrapper:{
    display:'flex',
    flexDirection:'row',
  },
  results:{
    display:'flex',
    overflow: 'auto',
  },
  map:{
  }
};


//Begin class definition
export default class Main extends React.Component {
    constructor(props) {
        super(props);
        props.setShouldShowSearchMenu(true);
        const parsedQueries = queryString.parse(props.location.search);
        this.state = {
          viewList: false,
          switchButton: false,
          searchString: parsedQueries.query
        };
    }

    switchView() {
        var promise=new Promise((resolve, reject) =>{
          this.setState({viewList:!this.state.viewList});
          resolve();
          });
        promise.then((result)=>{
          this.searchSizer();
          }).catch((error)=>console.log(error));
    }

    componentDidMount() {
        this.searchSizer();
        window.addEventListener('resize', () => this.searchSizer(), false);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.searchSizer, false);
        this.props.setShouldShowSearchMenu(false);
    }

    searchSizer() {
        var offsetWidth = document.getElementById('content').clientWidth

        var resultWidth, mapWidth;
        if(offsetWidth<500){
          this.setState({switchButton:true})
          if(this.state.viewList){
            resultWidth=offsetWidth;
            mapWidth=0;
          }else{
            resultWidth=0;
            mapWidth=offsetWidth;
          }
        }else{
         this.setState({switchButton:false})
         mapWidth=offsetWidth*0.60;
         resultWidth=offsetWidth*0.40;
        }
        this.setState({ mapWidth, resultWidth, offsetWidth});
    }

    getSearchString() {
        return this.state.searchString;
    }

    render() {
        const ResultsWithRouter = withRouter(Results);
        const { displayResult,
                displayAddResource,
                displaySearch,
                filterResources,
                getSearchstring,
                getFilteredResources,
                getPageLoading,
                userLat,
                userLng } = this.props;
        var { mapWidth, resultWidth, offsetWidth} = this.state;
        var offsetHeight = document.getElementById('content').clientHeight;
        if (mapWidth=== undefined) {
            return null;
        }
        var filteredResources = getFilteredResources();

        return (
          <div style={styles.wrapper}>
            <div style={{width: resultWidth, height: offsetHeight, overflow: 'auto'}}>
              <ResultsWithRouter height={offsetHeight}
                                 getFilteredResources={getFilteredResources}
                                 displayAddResource={displayAddResource}
                                 getPageLoading={getPageLoading}
                                 getSearchstring={getSearchstring}
                                 userLat={userLat}
                                 userLng={userLng}/>

            </div>

            <div style={styles.map}>
              <Map width={mapWidth}
                   height={offsetHeight}
                   getFilteredResources={getFilteredResources}
                   displayResult={displayResult}
                   userLat={userLat}
                   userLng={userLng}
                   center={[userLat,userLng]}/>
            </div>
            <div style={{zIndex:1, margin:'auto', position:'absolute'}}>
            {this.state.switchButton ? <SwitchViewButton switchView={()=>this.switchView()} getView={()=>this.state.viewList}/>:" "}
            </div>
            <div style={{zIndex:1, bottom:'2%', right:'2%', position:'absolute', padding:'10px'}}>
                        <FloatingActionButton
                          backgroundColor='#000000'
                          containerElement={<Link to="/AddResource" />}>
                          <ContentAdd />
                        </FloatingActionButton>
            </div>
          </div>
        );
    }

}
