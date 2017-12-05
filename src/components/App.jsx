/**

The main component with the app's actions and 'store.'

**/
import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';

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

import {Switch, Route, Link, withRouter} from 'react-router-dom';

//import other components
import Main from './Main.jsx';
import LeftMenu from './LeftMenu.jsx';
import Logout from './Logout.jsx';
import ApproveDocs from './ApproveDocs.jsx';
import ClinicPage from './ClinicPage.jsx';
import AddResource from './AddResource.jsx';
import LoginRegister from './LoginRegister.jsx';
import UpdateDocs from './UpdateDocs.jsx';
import MyAccount from './MyAccount.jsx';
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

const pathToLogo = require('../img/logo.png');

const styles = {

    appbar: {
      backgroundColor:'transparent',
      overflow:'hidden',
      maxHeight:65
    },
    appbarTitle: {
        paddingTop: 7,
        paddingLeft:5,
        color: '#000000',
        fontSize: 40,
        overflow: 'hidden'
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
        fontColor: '#FFFFFF',
        flexWrap:'wrap'
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
            // filteredResources: [],
            showMenu: false, //toggles left-hand menu
            searchString: '',
            appbarState: false,
            // selectedIndex: 0,
            appbarTitle: 'Shout',
            appbarIcon: <NavigationMenu />,
            // searchBar: "",
            pageLoading: 'true', //true if page has not loaded yet
            // userLat: '33.7490',
            // userLng: '-84.3880',
            clinicpageTags: [],
            clinicpageFeedbacks: [],
            loggedin: false,
            pendingData: [],
            userinfo:"",
            // shouldShowSearchMenu: false,
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
        if (!this.state.appbarState) {
            this.setState({
                showMenu: !this.state.showMenu
            });
        } else {
            this.displaySearch();
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
                // this.redrawResources(doc.rows);
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
    }

    //Error method
    error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
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
                        <div style={styles.column}>
                        <div style={styles.row}>
                          <Link to="/"><img src={pathToLogo} height="60"/> </Link>
                          <div style={styles.headermenu}>
                          {this.getMenuOptions()}
                        </div>
                        </div>
                        </div>
                    </AppBar>

                    </div>
                </div>
            )
        }
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
              <MenuItem primaryText ="Login/Register"
                        containerElement={<Link to="/LoginRegister" />} />
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


    setShouldShowHeaderAndDrawer(shouldShowHeaderAndDrawer) {
        this.setState({shouldShowHeaderAndDrawer: shouldShowHeaderAndDrawer})
    }

    render() {

        const ClinicPageWithRouter = withRouter(ClinicPage);

        return (

            <MuiThemeProvider muiTheme={getMuiTheme()}>
          <div id='wrapper' style={styles.wrapper}>

          {this.getHeaderAndDrawer()}

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
              <Route exact path="/LoginRegister" render={(props) => (
                <LoginRegister {...props} container={this.refs.content}
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
              <Route path="/ClinicPage/:rowNumber" render={(props) => (
                <ClinicPageWithRouter {...props} container={this.refs.content}
                            footer={this.refs.footer}
                            displaySearch={(result) => this.displaySearch()}
                            addFeedback={(x, result) => this.addFeedback(x, result)}
                            getFeedbacks={()=>this.state.clinicpageFeedbacks}
                            vouchFor={(a,b,c)=>this.vouchFor(a,b,c)}
                            vouchAgainst={(a,b,c)=>this.vouchAgainst(a,b,c)}
                            addFlag={()=>this.addFlag(a,b)}/>
              )} />
              <Route exact path="/" render={(props) => (
                  <Main {...props} container={this.refs.content}
                                             footer={this.refs.footer}
                                             displayResult={(result) => this.displayResult(result)}
                                             displaySearch={() => this.displaySearch()}
                                             filterResources={(string) => this.filterResources(string)}
                                             getPageLoading={() => this.state.pageLoading}
                                             userLat={this.state.userLat}
                                             userLng={this.state.userLng}
                                             getSearchstring={()=>this.state.searchString}
                                         />
                      )} />
              <Route exact path="/LandingPage" render={(props) => (
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
