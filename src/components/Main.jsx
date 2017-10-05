/* jslint node: true, esnext: true */
'use strict';

import React from 'react';
import Map from './Map.jsx';
import Results from './Results.jsx';
import { cyan300, indigo900 } from 'material-ui/styles/colors';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';

const styles={

  wrapper:{
    display:'flex',
    flexDirection:'row',
    position:'absolute'
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
        this.state = {};

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
        var resultWidth, mapWidth;
        if(offsetWidth<500){
          resultWidth=0;
          mapWidth=offsetWidth;
        }else{
         mapWidth=offsetWidth*0.60;
         resultWidth=offsetWidth*0.40;
        }
        this.setState({ mapWidth, resultWidth, offsetHeight, offsetWidth});
    }

    render() {
        const { displayResult, displayAddResource, displaySearch, filterResources, onGoogleApiLoad, getSearchstring, getFilteredResources, getPageLoading, userLat, userLng } = this.props;
        var { mapWidth, resultWidth, offsetHeight, offsetWidth} = this.state;
        if (mapWidth=== undefined) {
            return null;
        }
        var filteredResources = getFilteredResources();

        return (
          <div style={styles.wrapper}>
            <div style={{width: resultWidth, height: offsetHeight, overflow: 'auto', paddingLeft:10, paddingRight:5}}>
              <Results height={offsetHeight} getFilteredResources={getFilteredResources} displayResult={displayResult} displaySearch={displaySearch} displayAddResource={displayAddResource} getPageLoading={getPageLoading} getSearchstring={getSearchstring}  userLat={userLat} userLng={userLng}/>
            </div>

            <div style={styles.map}>
              <Map width={mapWidth} height={offsetHeight} getFilteredResources={getFilteredResources} displayResult={displayResult} onGoogleApiLoad={onGoogleApiLoad} userLat={userLat} userLng={userLng} center={[userLat,userLng]}/>
            </div>
            <div style={{zIndex:1, bottom:10, right:10, position:'absolute'}}>
                        <FloatingActionButton
                          backgroundColor='#000000'
                          onTouchTap={()=>displayAddResource()}>
                          <ContentAdd />
                        </FloatingActionButton>
            </div>
          </div>
        );
    }

}