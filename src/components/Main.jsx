/* jslint node: true, esnext: true */
'use strict';

import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import { cyan300, indigo900 } from 'material-ui/styles/colors';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import Map from './Map.jsx';
import Results from './Results.jsx';
import SwitchViewButton from './SwitchViewButton.jsx';
import SearchMenu from './SearchMenu.jsx';

const queryString = require('query-string');

import PouchDB from 'pouchdb';
import PouchDBQuickSearch from 'pouchdb-quick-search';
PouchDB.plugin(PouchDBQuickSearch);
PouchDB.plugin(require('pouchdb-authentication'));

/*PouchDB server*/
//Create local & remote server, and then sync these. See PouchDB docs at http://pouchdb.com/api.html

var db = new PouchDB('quality_resources');
var remoteCouch = 'https://shouthealth.org/couchdb/quality_resources';
PouchDB.replicate(remoteCouch,db);

var db_pending = new PouchDB('resourcespending');
var remoteCouchPending = 'https://shouthealth.org/couchdb/resourcespending';
PouchDB.sync(db_pending, remoteCouchPending);

var feedback= new PouchDB('feedback');
var remoteFeedback = 'https://shouthealth.org/couchdb/feedback';
PouchDB.sync(feedback, remoteFeedback);

const styles={

  wrapper:{
    display:'flex',
    flexDirection:'row',
    position:'absolute',
    overflow: 'hidden',
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

        PouchDB.sync(db, remoteCouch).on('complete',() => this.displaySearch());
        PouchDB.sync(db_pending, remoteCouchPending);

        const parsedQueries = queryString.parse(props.location.search);

        this.state = {
          viewList: false,
          switchButton: false,
          searchString: parsedQueries.query,
          userLat: '33.7490',
          userLng: '-84.3880',
          filteredResources: [],
        };
    }

    componentDidMount() {
        this.searchSizer();
        window.addEventListener('resize', () => this.searchSizer(), false);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.searchSizer, false);
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

    searchSizer() {
        var offsetHeight = document.getElementById('content').clientHeight
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
        this.setState({ mapWidth, resultWidth, offsetHeight, offsetWidth});
    }

    getSearchString() {
        return this.state.searchString;
    }

    addressSearchSubmit() {
        console.log("address is: " + this.state.address);
        var getCoords= new Promise((resolve, reject) =>{
          geocodeByAddress(this.state.address, (err, latLng) => {
                if (err) {
                    console.log('error geocoding by address:', err)
                    reject(err);
                }else{
                    console.log(latLng)
                  this.setState({
                      userLat: latLng.lat
                  });
                  this.setState({
                      userLng: latLng.lng
                  });
                  resolve();
                }
              });
        });
        getCoords.then((result)=>{
          filterNearMe(this.state.filteredResources);
          }).catch((error)=>{
            console.log("error getting geocode response");
          });
    }

    //This function sorts resources based on the distance
    filterNearMe(resourcestoFilter) {

        var originalArray = resourcestoFilter;

        // split original array into 2 arrays, one for locations with coordinates
        // one for without it
        var validCoordination = [],
            invalidCoordination = [];
        for (var i = 0; i < originalArray.length; i++) {
            if (originalArray[i].lat && originalArray[i].lng) {
                validCoordination.push(originalArray[i]);
            } else {
                invalidCoordination.push(originalArray[i]);
            }
        }

        validCoordination.sort((a, b) => {
            if (a.lat && b.lat && b.lng && a.lng) {
                var a_distance = Math.pow((this.state.userLat - a.lat), 2) +
                                 Math.pow((this.state.userLng - a.lng), 2);
                var b_distance = Math.pow((this.state.userLat - b.lat), 2) +
                                 Math.pow((this.state.userLng - b.lng), 2);
                var diff = a_distance - b_distance;
                return diff;
            } else {
                return 10000;
            }
        });

        // append back those 2 arrays
        var arrSorted = [];
        for (var i = 0; i < validCoordination.length; i++) {
            arrSorted.push(validCoordination[i]);
        }
        for (var i = 0; i < invalidCoordination.length; i++) {
            arrSorted.push(invalidCoordination[i]);
        }
        this.setState({
            filteredResources: arrSorted
        });
    }

    //Update the rows of the results table on main page
    redrawResources(resources) {
        var results = [];
        resources.forEach(function (res) {
            results.push(res.doc);
        });
        this.setState({
            filteredResources: results
        });
        this.filterNearMe();
    }

    //This filter method uses the Pouchdb-Quick-Search library
    //See:  http://github.com/nolanlawson/pouchdb-quick-search
    filterResources(searchString, searchType) {
      var matches = [];
      this.setState({
            searchString: searchString
      });
        if (searchType==="all") {
            db.allDocs({
                include_docs: true
            }, (err, doc) => {
                if (err) {
                    return console.log(err);
                }
                doc.rows.forEach(function (res) {
                      matches.push(res);
                });
            this.redrawResources(matches);
            });
        } else if(searchType==="any"){
            db.search({
                query: searchString,
                fields: ['resourcetype', 'description'],
                include_docs: true,
                highlighting: true,
            }, (err, list) => {
                if (err) {
                    this.error(err);
                }
                list.rows.forEach(function (res) {
                            matches.push(res);

                });
            this.redrawResources(matches);
            });
        } else if(searchType==="services"){

            db.allDocs({
                include_docs: true
            }, (err, doc) => {
                  if (err) {
                      return this.error(err);
                  }
                  doc.rows.forEach(function (res) {
                    for (var category in res.doc.services) {
                      var arrayLength = res.doc.services[category].length;
                      var arrItems=res.doc.services[category];
                      for (var i = 0; i < arrayLength; i++) {
                          if(arrItems[i]['label'].indexOf(searchString)!==-1&&arrItems[i]['adminvotes']!="0"){
                            matches.push(res);
                          }
                      }
                    }
                  });
            this.redrawResources(matches);
            });
        } else if(searchType==="population"){

            db.allDocs({
                include_docs: true
            }, (err, doc) => {
                  if (err) {
                      return this.error(err);
                  }
                  doc.rows.forEach(function (res) {
                      var arrItems=res.doc.population;
                      for (var i = 0; i < arrItems.length; i++) {
                          if(arrItems[i]['label'].indexOf(searchString)!==-1&&arrItems[i]['adminvotes']!="0"){
                            matches.push(res);
                          }
                      }

                  });
            this.redrawResources(matches);
            });
        }
    }

    //user gets prompt to allow browser to access current position
    requestCurrentPosition() {

        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                var crd = pos.coords;
                const x = crd.latitude;
                const y = crd.longitude;
                this.setState({
                    userLat: x
                });
                this.setState({
                    userLng: y
                });
            }, this.error, options);
        }

    }

    render() {
        const ResultsWithRouter = withRouter(Results);
        const { displayResult,
                displayAddResource,
                displaySearch,
                filterResources,
                getSearchstring,
                getPageLoading } = this.props;
        var { mapWidth, resultWidth, offsetHeight, offsetWidth} = this.state;
        if (mapWidth=== undefined) {
            return null;
        }

        return (

          <div style={styles.wrapper}>

            <SearchMenu address={this.state.searchString}/>
            <div style={{width: resultWidth, height: offsetHeight, overflow: 'auto', paddingLeft:10, paddingRight:5}}>
              <ResultsWithRouter height={offsetHeight}
                                 filteredResources={this.state.filteredResources}
                                 displayAddResource={displayAddResource}
                                 getPageLoading={getPageLoading}
                                 getSearchstring={getSearchstring}
                                 userLat={this.state.userLat}
                                 userLng={this.state.userLng}/>

            </div>

            <div style={styles.map}>
              <Map width={mapWidth}
                   height={offsetHeight}
                   getFilteredResources={()=> this.state.filteredResources}
                   displayAddResource={displayAddResource}
                   displayResult={displayResult}
                   userLat={this.state.userLat}
                   userLng={this.state.userLng}
                   center={[this.state.userLat, this.state.userLng]}/>
            </div>
            {this.state.switchButton ? <SwitchViewButton switchView={()=>this.switchView()} getView={()=>this.state.viewList}/>:" "}
            <div style={{zIndex:1, bottom:'2%', right:'10%', position:'absolute', padding:'10px'}}>
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
