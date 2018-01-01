/**

The main component with the app's actions and 'store.'

**/
import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import injectTapEventPlugin from 'react-tap-event-plugin';

/*Material-UI theme*/
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

/*Material-UI components*/
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Drawer from 'material-ui/Drawer';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

import {Switch, Route, Link, withRouter, BrowserRouter} from 'react-router-dom';

//import other components
import Main from './Main.jsx';
import PrimaryOptions from './PrimaryOptions.jsx';
import SecondaryOptions from './SecondaryOptions.jsx';
import Footer from './Footer.jsx';
import LeftMenu from './LeftMenu.jsx';
import Logout from './Logout.jsx';
import ApproveDocs from './ApproveDocs.jsx';
import ClinicPage from './ClinicPage.jsx';
import AddResource from './AddResource.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import UpdateDocs from './UpdateDocs.jsx';
import MyAccount from './MyAccount.jsx';
import AddressBar from './AddressBar.jsx';
import About from './About.jsx';
import Blog from './Blog.jsx';
import Help from './Help.jsx';
import LandingPage from './LandingPage.jsx';

import {
    geocodeByAddress,
    geocodeByPlaceId
} from 'react-places-autocomplete'

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

const pathToLogoSmall = require('../img/logo.png');

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

const styles = {

    appbar: {
      backgroundColor:'transparent',
      overflow:'hidden',
    },
    appbarTitle: {
        display: 'flex',
        flexDirection: 'row',
        position: 'absolute',
        color: 'black',
        marginLeft:30,
        fontSize:20
    },
    row: {
        display: 'flex',
        flexDirection: 'row'
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    headermenu: {
        position: 'absolute',
        right:5,
        paddingTop:7,
        display: 'flex',
        flexDirection: 'row',
        fontColor: '#FFFFFF'
    },
    headerlinks: {
        color: '#FFFFFF'
    },
    wrapper: {
        backgroundPosition: 'center',
        backgroundAttachment:'fixed'
    }
};

export default class App extends React.Component {

    constructor(props) {
        super(props);
        console.log("app props are: ", props)
        // this component's state acts as the overall store for now
        this.state = {
            allResources: [],
            address: "Atlanta, GA",
            filteredResources: [],
            showMenu: false, //toggles left-hand menu
            searchString: '',
            appbarState: false,
            selectedIndex: 0,
            appbarTitle: 'ShoutHealth',
            appbarIcon: <NavigationMenu />,
            searchBar: "",
            searchBar2: "",
            pageLoading: 'true', //true if page has not loaded yet
            userLat: '33.7490',
            userLng: '-84.3880',
            clinicpageTags: [],
            clinicpageFeedbacks: [],
            loggedin: false,
            pendingData: [],
            userinfo:"",
            shouldShowSearchMenu: false,
            shouldShowHeaderAndDrawer: true
        };
    }

    // This method is called by the AddResource component. For now, adds a new
    // document directly to the "resourcesnew" database on the couchdb server.
    // Later, this database should be migrated to a "pending" database where we
    // store items before they are approved/moderated
    addResource(res) {
        //create object to add
        var resource = Object.assign({}, res);
        resource._id="Resource" + "_" + res.resourcetype + "_" + res.name;
        resource.numberreviews='0';
        resource.accessibilityrating="";
        resource.availabilityrating="";

        db_pending.put(resource, function callback(err, result) {
            if (!err) {
                console.log('Added resource');
            } else {
                console.log('Error adding resource' + err);
            }
        });

        db_pending.replicate.to(remoteCouchPending, {
            live: true,
            retry: true,
            back_off_function: function (delay) {
                if (delay === 0) {
                    return 1000;
                }
                return delay * 3;
            }
        });
    }

    // This method is called by ClinicPage, and submits a new "Feedback_"
    // document to the PouchDB database
    addFeedback(rev,result) {
        var review = Object.assign({}, rev);
        review._id="Feedback" + "_" + rev.name + "_" + new Date().toISOString();
        review.type="feedback";
        review.date=new Date().toISOString();
        review.upvotes='0';
        review.downvotes='0';

        feedback.put(review, function callback(err, result) {
            if (!err) {
                console.log('Added review');
            } else {
                console.log('Error adding feedback' + err);
            }
        });
        feedback.replicate.to(remoteFeedback, {
            live: true,
            retry: true,
            back_off_function: function (delay) {
                if (delay === 0) {
                    return 1000;
                }
                return delay * 3;
            }
        });

        this.incrementReviews(result)

    }

    incrementReviews(res){
                //create a new doc with properties of this
                var mod = Object.assign({}, res);
                mod.numberreviews=res.numberreviews+1;
                mod._rev=res._rev;
                db.put(mod, function callback(err, result) {
                    if (!err) {
                        console.log('Modified this doc');
                    } else {
                        console.log('Error modifying this doc');
                    }
                });
                //create new doc and replace old one
                //delete tags object

                db.replicate.to(remoteCouch, {
                    live: true,
                    retry: true,
                    back_off_function: function (delay) {
                        if (delay === 0) {
                            return 1000;
                        }
                        return delay * 3;
                    }
                });

    }

        updateDoc(res) {
            //create a new doc with properties of this
            var mod = Object.assign({}, res);
            mod._id="Resource" + "_" + res.resourcetype + "_" + res.name;
            db.put(mod, function callback(err, result) {
                if (!err) {
                    console.log('Modified this doc');
                } else {
                    console.log('Error modifying this doc');
                }
            });
            //create new doc and replace old one
            //delete tags object
            db.replicate.to(remoteCouch, {
                live: true,
                retry: true,
                back_off_function: function (delay) {
                    if (delay === 0) {
                        return 1000;
                    }
                    return delay * 3;
                }
            });

        }

    // This function is called when the left-hand icon in the AppBar is clicked.
    // the action depends on whether the user is currently on the main/landing
    // page or a clinic page result
    appbarClick() {
        if (this.state.shouldShowSearchMenu) {
            this.setState({
                showMenu: !this.state.showMenu
            });
        }
    }

    changeDoc(res) {
      this.updateDoc(res.doc);
      db_pending.remove(res.doc);
      var tempPendingData = this.state.pendingData;
      console.log("res is: ", res);
      tempPendingData = tempPendingData.filter(function(element) {
        return element != res;
      })
      console.log("after delete: ", tempPendingData);
    }

    displayApproveDocs() {
      if(this.state.loggedin) {
        db_pending.allDocs({
            startkey: 'Resource_',
            endkey: 'Resource_\uffff',
            include_docs: true
        }, (err, doc) => {
            if (err) {
                return this.error(err);
            }
            console.log("doc is: ", doc)
            var numRows = doc.total_rows;
            var tempPending = [];
            console.log("doc length is: ", numRows);
            if (numRows > 0) {
              for (var i = 0; i < numRows; i++) {
                tempPending.push(doc.rows[i]);
              }
            }
            console.log("tempPending is: ", tempPending);
            this.setState({
              pendingData: tempPending
            })
        });
        }
    }

    // This function basically updates the single page app to now display the
    // main component (App.js) with all results and no filter. State variables
    //are changed as needed in order to modify the title and layout of the page.
    displaySearch() {
        //first retrieve all docs again, to reverse any filters
        db.allDocs({
            include_docs: true
        }, (err, doc) => {
            if (err) {
                return this.error(err);
            }
            if (doc.rows.length > 0) {
                this.setState({
                    pageLoading: false
                });
                this.redrawResources(doc.rows);
            }
        });
        this.setState({
            appbarTitle: 'ShoutHealth'
        });
        this.setState({
            appbarState: false
        });
        this.setState({
            appbarIcon: <NavigationMenu />
        });
        this.setState({
            searchBar: <div>
                        <PrimaryOptions container={this.refs.content}
                                      getselectedIndex={()=>this.state.selectedIndex}
                                      onSelect={(index) => this.selectOption(index)}/>
                        <SecondaryOptions container={this.refs.content}
                                      getselectedIndex={()=>this.state.selectedIndex}
                                      onSelect={(index) => this.selectOption(index)}/>
                        </div>
        });

    }

    //Error method
    error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
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

    //This function allows user to filter resources based on the selected icon in the footer
    selectOption(index) {
        //first, go back to the main screen
        this.setState({
            selectedIndex: index
        });
        if (index === 100) {
            this.filterResources('', "all");
        } else if (index === 0) {
            this.filterResources('Adults', "population");
        } else if (index === 1) {
            this.filterResources('Women', "population");
        } else if (index === 2) {
            this.filterResources('Children', "population");
        } else if (index === 3) {
            this.filterResources('mental health', "services");
        } else if (index === 4) {
            this.filterResources('dental', "services");
        } else if (index === 5) {
            this.filterResources('vision', "services");
        } else if (index === 6) {
            this.filterResources('housing', "any");
        }

         else if (index === 7) {
            this.filterResources('check-up', "services");
        }  else if (index === 8) {
            this.filterResources('emergency', "any");
        }  else if (index === 9) {
            this.filterResources('chronic disease', "services");
        }  else if (index === 9) {
            this.filterResources('STD testing', "services");
        }

         else if (index ===11) {
            this.filterResources('pregnancy', "services");
        } else if (index ===11) {
           this.filterResources('pap smear', "services");
       } else if (index ===11) {
          this.filterResources('mammogram', "services");
      } else if (index ===11) {
         this.filterResources('birth control', "services");
     }

     else if (index ===21) {
        this.filterResources('immunization', "services");
     }else if (index ===22) {
        this.filterResources('pediatric check-up', "services");
     }

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


    getUser(){

        var dbs = new PouchDB('http://shouthealth.org:6984/resourcespending', {
            skip_setup: true
        });

        dbs.getSession().then((response)=>{
          return dbs.getUser(response.userCtx.name);
        }).then((response)=>{
            return this.setState({userinfo:response});
        }).catch((err)=>{
            console.log(err);
            this.setState({loggedin:false});
            this.setState({userinfo:""});
        })

    }

    // Function that is called by event listeners attached when we called
    // "db.changes. It should refresh the resources when we initially sync the
    // database, but should do nothing otherwise.
    handleChanges(change, changesObject) {
        this.displaySearch();
        changesObject.cancel();
    }

    getSearchMenu() {
        if (this.state.shouldShowSearchMenu) {
            return (
              <div>
                <AddressBar submit={()=>this.addressSearchSubmit()}
                            address={this.state.address}
                            onChange={(address)=>this.setState({address})}/>
                {this.state.searchBar}
              </div>
                )
        }else {
          return (
            <div>
            </div>
              )
        }
    }

    // quick fix to remove header and drawer from the landing page.
    // definitely not the best way to do this though
    getHeaderAndDrawer() {
        if (this.state.shouldShowHeaderAndDrawer) {
            return (
                <div>
                    <div>
                       <Drawer
                       open={this.state.showMenu}
                       docked={false}
                       onRequestChange={(showMenu) => this.setState({showMenu})}>
                         <LeftMenu addResource={(res)=>this.addResource(res)}
                                   displayApproveDocs={()=>this.displayApproveDocs()}
                                   getUserinfo={()=>this.state.userinfo}/>
                      </Drawer>
                   </div>

                    <div id='header'>
                        <AppBar iconElementLeft={this.state.appbarIcon}
                                onLeftIconButtonTouchTap={() => this.appbarClick()}
                                style={styles.appbar}>
                          <div style={styles.appbarTitle}>
                              <Link to="/"><img src={pathToLogoSmall}/></Link>
                          </div>
                          <div style={styles.headermenu}>
                            {this.getMenuOptions()}
                          </div>
                    </AppBar>

                    </div>
                </div>
            )
        }
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
          this.filterNearMe(this.state.filteredResources);
          }).catch((error)=>{
            console.log("error getting geocode response");
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
        this.filterNearMe(this.state.filteredResources);
    }

    //Register a new user to the database
    registerNew(user, metadata) {
        var dbs = new PouchDB('http://shouthealth.org:6984/resourcespending', {
            skip_setup: true
        });

        return dbs.signup(user.username, user.password, metadata)
        .then((response)=>{
        return true;
        })
        .catch((err)=>{
          return false;
        });
    }

    loginUser(user) {
        var dbs = new PouchDB('http://shouthealth.org:6984/resourcespending', {
            skip_setup: true
        });

        return dbs.login(user.username, user.password)
        .then((response)=>{
          this.setState({loggedin:true});
          })
        .then((response)=>{
          this.getUser();
          return true;
        })
        .catch((err)=>{
          console.log(err)
          this.setState({loggedin:false});
          return false;
          });;
    }

    getMenuOptions(){
        let loginButton = null;
        const isLoggedIn = this.state.loggedin;
        if (isLoggedIn) {
            return
            <IconMenu
                  iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                >
              <MenuItem primaryText="About"
                        containerElement={<Link to="/About" />} />
              <MenuItem primaryText="Blog"
                        containerElement={<Link to="/Blog" />}/>
              <MenuItem primaryText ={"My Account ("+this.state.userinfo.name+")"} />
              <MenuItem primaryText ="Help"
                        containerElement={<Link to="/Help" />} />
              <MenuItem primaryText="Logout"/>
            </IconMenu>
        } else {
            return <IconMenu
                  iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                >
              <MenuItem primaryText="About"
                        containerElement={<Link to="/About" />} />
              <MenuItem primaryText="Blog"
                        containerElement={<Link to="/Blog" />}/>
              <MenuItem primaryText ="Login"
                        containerElement={<Link to="/Login" />} />
              <MenuItem primaryText ="Register"
                        containerElement={<Link to="/Register" />} />
              <MenuItem primaryText ="Help"
                        containerElement={<Link to="/Help" />} />
            </IconMenu>
        }
    }


    logoutUser() {
      var dbs = new PouchDB('http://shouthealth.org:6984/resourcespending', {
          skip_setup: true
      });

      dbs.logout(function (err, response) {
        if (err) {
          console.log(err)
          console.log("ERROR when logging out");
        }
      }).then((response)=>{
        this.setState({ loggedin: false });
        this.setState({userinfo:""});
      }).catch((err)=>{
        console.log(err)
        this.setState({ loggedin:true });
      });;
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

    // Since all state is stored in App.jsx, each clinicpage that is rendered
    // must update the current page feedback that's currently stored in the
    // state of App.jsx
    updateFeedbacks(name) {
        feedback.allDocs({
            startkey: 'Feedback_' + name,
            endkey: 'Feedback_' + name + '_\uffff',
            include_docs: true
        }, (err, doc) => {

            if (err) {
                return this.error(err);
            }
            var feedbacks = [];
            doc.rows.forEach(function (feedback) {
                feedbacks.push(feedback.doc);
            });
            this.setState({
                clinicpageFeedbacks: feedbacks
            });
        });
    }

    //Function called from ClinicPage to upvote a tag.
    vouchFor(tagsdoc, index) {
        var tag = tagsdoc.tags[index];
        var modified_tag = {
            value: tag.value,
            count: tag.count + 1,
        };
        tagsdoc.tags[index] = modified_tag;
        db_pending.put({
            _id: tagsdoc._id,
            _rev: tagsdoc._rev,
            type: "tag",
            tags: tagsdoc.tags,
        }, function (err, response) {
            if (err) {
                console.log(err);
            }
            console.log("successfully upvoted");
        });
    }

    //Function called from ClinicPage to downvote a tag
    vouchAgainst(tagsdoc, index) {
        var tag = tagsdoc.tags[index];
        if (tag.count > 0) {
            var modified_tag = {
                value: tag.value,
                count: tag.count - 1,
            };
            tagsdoc.tags[index] = modified_tag;

            db_pending.put({
                _id: tagsdoc._id,
                _rev: tagsdoc._rev,
                type: "tag",
                tags: tagsdoc.tags,
            }, function (err, response) {
                if (err) {
                    return console.log(err);
                }
                console.log("success");
            });
        } else {
            tagsdoc.tags.splice(index, 1);
            db_pending.put({
                _id: tagsdoc._id,
                _rev: tagsdoc._rev,
                type: "tag",
                tags: tagsdoc.tags,
            }, function (err, response) {
                if (err) {
                    return this.error(err);
                }
                console.log("successfully downvoted");
            });
        }
    }

    setAppbarIcon(appbarIcon) {
        this.setState({appbarIcon: appbarIcon})
    }

    setShouldShowSearchMenu(shouldShowSearchMenu) {
        this.setState({shouldShowSearchMenu: shouldShowSearchMenu})
    }

    setShouldShowHeaderAndDrawer(shouldShowHeaderAndDrawer) {
        this.setState({shouldShowHeaderAndDrawer: shouldShowHeaderAndDrawer})
    }

    componentDidMount() {
        // may be the wrong place to call these. Might be better to call in
        // component will mount
        console.log("component did mount")
        PouchDB.sync(db, remoteCouch).on('complete',() => this.displaySearch());
        PouchDB.sync(db_pending, remoteCouchPending);
        this.requestCurrentPosition();
    }

    render() {

        const ClinicPageWithRouter = withRouter(ClinicPage);

        return (

            <MuiThemeProvider muiTheme={getMuiTheme()}>
          <div id='wrapper' style={styles.wrapper}>

          {this.getHeaderAndDrawer()}

          {this.getSearchMenu()}

          <div ref='content' id='content'>
          <CSSTransitionGroup transitionName='slide'
                              transitionEnterTimeout={ 100 }
                              transitionLeaveTimeout={ 300 }>
            <Switch>
              <Route exact path="/About" render={(props) => (
                <About {...props}/>
              )} />
              <Route exact path="/Help" render={(props) => (
                <Help {...props}/>
              )} />
              <Route exact path="/Blog" render={(props) => (
                <Blog {...props} container={this.refs.content}/>
              )} />
              <Route exact path="/Login" render={(props) => (
                <Login {...props} container={this.refs.content}
                                       displaySearch={() => this.displaySearch()}
                                       registerNew={(user,metadata)=>this.registerNew(user,metadata)}
                                       loginUser={(user,callback)=>this.loginUser(user,callback)}
                                       getLoggedIn={()=>this.state.loggedin}
                                       getRegistered={()=>this.state.registered}/>
              )} />
              <Route exact path="/Register" render={(props) => (
                <Register {...props} container={this.refs.content}
                                       displaySearch={() => this.displaySearch()}
                                       registerNew={(user,metadata)=>this.registerNew(user,metadata)}
                                       loginUser={(user,callback)=>this.loginUser(user,callback)}
                                       getLoggedIn={()=>this.state.loggedin}
                                       getRegistered={()=>this.state.registered}/>
              )} />
              <Route exact path="/AddResource" render={(props) => (
                <AddResource {...props} container={this.refs.content}
                             addResource={(x) => this.addResource(x)}
                             displaySearch={()=>this.displaySearch()}/>
              )} />
              <Route path="/ClinicPage/:rowNumber/:resultName" render={(props) => (
                <ClinicPageWithRouter {...props} container={this.refs.content}
                            footer={this.refs.footer}
                            displaySearch={(result) => this.displaySearch()}
                            addFeedback={(x, result) => this.addFeedback(x, result)}
                            getFeedbacks={()=>this.state.clinicpageFeedbacks}
                            getFilteredResources={() => this.state.filteredResources}
                            vouchFor={(a,b,c)=>this.vouchFor(a,b,c)}
                            vouchAgainst={(a,b,c)=>this.vouchAgainst(a,b,c)}
                            setAppbarIcon={(appbarIcon)=>this.setAppbarIcon(appbarIcon)}
                            addFlag={()=>this.addFlag(a,b)}/>
              )} />
              <Route exact path="/home" render={(props) => (
                  <Main {...props} container={this.refs.content}
                                             footer={this.refs.footer}
                                             displayResult={(result) => this.displayResult(result)}
                                             displaySearch={() => this.displaySearch()}
                                             filterResources={(string) => this.filterResources(string)}
                                             getFilteredResources={() => this.state.filteredResources}
                                             getPageLoading={() => this.state.pageLoading}
                                             userLat={this.state.userLat}
                                             userLng={this.state.userLng}
                                             getSearchstring={()=>this.state.searchString}
                                             setShouldShowSearchMenu={(shouldShowSearchMenu)=>this.setShouldShowSearchMenu(shouldShowSearchMenu)}/>
                      )} />
              <Route path='/referred' render={(props) => (
                  <Main {...props} container={this.refs.content}
                                             footer={this.refs.footer}
                                             displayResult={(result) => this.displayResult(result)}
                                             displaySearch={() => this.displaySearch()}
                                             filterResources={(string) => this.filterResources(string)}
                                             getFilteredResources={() => this.state.filteredResources}
                                             getPageLoading={() => this.state.pageLoading}
                                             userLat={this.state.userLat}
                                             userLng={this.state.userLng}
                                             getSearchstring={()=>this.state.searchString}
                                             setShouldShowSearchMenu={(shouldShowSearchMenu)=>this.setShouldShowSearchMenu(shouldShowSearchMenu)}/>
                      )} />
              <Route exact path="/" render={(props) => (
                  <LandingPage {...props} submit={()=>this.addressSearchSubmit()}
                                          address={this.state.address}
                                          onChange={(address)=>this.setState({address})}
                                          setShouldShowHeaderAndDrawer={(shouldShowHeaderAndDrawer)=>this.setShouldShowHeaderAndDrawer(shouldShowHeaderAndDrawer)} />
                )} />
              <Route render={(props) => (
                  <LandingPage {...props} submit={()=>this.addressSearchSubmit()}
                                          address={this.state.address}
                                          onChange={(address)=>this.setState({address})}
                                          setShouldShowHeaderAndDrawer={(shouldShowHeaderAndDrawer)=>this.setShouldShowHeaderAndDrawer(shouldShowHeaderAndDrawer)} />
                )} />
              )} />

            </Switch>
          </CSSTransitionGroup>
          </div>

        </div>
      </MuiThemeProvider>
        );
    }
}
