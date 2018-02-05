/* jslint node: true, esnext: true */
'use strict';

// JavaScript source code
import React from 'react';
import Formsy from 'formsy-react';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import ContentAddCircle from 'material-ui/svg-icons/content/add-circle';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';
import {Switch, Route, Link, withRouter, BrowserRouter} from 'react-router-dom';


import {
    FormsyCheckbox,
    FormsyDate,
    FormsyRadio,
    FormsyRadioGroup,
    FormsySelect,
    FormsyText,
    FormsyTime,
    FormsyToggle,
    FormsyAutoComplete
} from 'formsy-material-ui/lib';


const styles = {

    main: {
        margin: 'auto',
        padding: '1% 2% 5% 5%',
        width:'50%',
        overflow: 'auto'
    },

    section: {
        padding: '1% 2% 5% 5%',
    },

    input: {
        margin: 10,
        fontColor: 'black',
    },

    button: {
        fontSize: 12,
        padding: '2px'
    }

};

const MIN_PASSWORD_LEN = 8;

export default class Login extends React.Component {


    constructor() {
        super();
        this.state = {

            type: 1,
            canSubmit: false,
            loginSuccess: false,
            loginError: false,
        };

        this.errorMessages = {
            customError: "Incorrect format",
            wordsError: "Please only use letters",
            numericError: "Please provide a number",
            urlError: "Please provide a valid URL",
            passwordError: "Password must be at least " + MIN_PASSWORD_LEN
                                                        + " characters long"
        };
    }



    handleLogin() {

        var user = {
            username: this.state.usernameL,
            password: this.state.passwordL,
        }

        this.loginUser(user)
            .then((response) => {
                if(response){
                  return this.setState({
                      loginSuccess: true
                  });
                }else{
                this.setState({
                    loginError: true
                });
                }
            })
            .catch((err) => {
                console.log(err)
                this.setState({
                    loginError: true
                });
            });
    }

    searchSizer() {
        var offsetHeight = document.getElementById('content').clientHeight
        var offsetWidth = document.getElementById('content').clientWidth
        this.setState({
            offsetHeight,
            offsetWidth
        });
    }

    componentDidMount() {
        this.searchSizer();
        window.addEventListener('resize', () => this.searchSizer(), false);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.searchSizer, false);
    }

    render() {

        const {
            customError,
            wordsError,
            numericError,
            urlError,
            passwordError
        } = this.errorMessages;
        const {
            addResource,
            displaySearch,
            registerNew,
            loginUser,
            getLoggedIn,
            getRegistered
        } = this.props;

        this.registerNew = registerNew;
        this.loginUser = loginUser;
        this.displaySearch = displaySearch;
        this.getLoggedIn = getLoggedIn;
        this.getRegistered = getRegistered;

        const {
            offsetWidth,
            offsetHeight
        } = this.state;
        if (offsetHeight === undefined) {
            return null;
        }

        Formsy.addValidationRule('isCustom', (values, value) => {

            var regobj = /^[a-zA-Z0-9,.!?')( ]*$/;
            return regobj.test(value);
        });

        Formsy.addValidationRule('isPassword', (values, value) => {

          if (value) {
            return value.length > MIN_PASSWORD_LEN;
          }
        });

        return (


      <Formsy.Form
          onValid={()=>this.setState({ canLogin: true })}
          onInvalid={()=>this.setState({ canLogin: false })}
          onValidSubmit={()=>this.submitForm}
          onInvalidSubmit={()=>this.notifyFormError}
        >
    <div style={styles.main}>


            <div style={styles.section}>
            <h3> Login</h3>


              <div>
              <b>Username</b>
                <Paper style={styles.input}>

                  <FormsyText
                    name="name"
                    validations="isCustom"
                    validationError={customError}
                    required
                    hintText="Username"
                    hintStyle={styles.hint}
                    onChange={(event) => this.setState({usernameL: event.target.value})}
                  />
                </Paper>


                  <b>Password</b>
                      <Paper style={styles.input}>

                        <FormsyText
                          name="password"
                          type="password"
                          validations="isPassword"
                          required
                          hintText="Password"
                          hintStyle={styles.hint}
                          onChange={(event) => this.setState({passwordL: event.target.value})}
                        />
                      </Paper>
              </div>


                  <br />
                  <br />
                    <RaisedButton
                        label="Login"
                        type="Submit"
                        primary={true}
                        disabled={!this.state.canLogin}
                        onClick={()=>this.handleLogin()}/>
                      {this.state.canLogin? "":<b> Please fill out required fields to login</b>}
          </div>

                              <Dialog
                                title="Login Successful"
                                  actions={<Link to="/home"><FlatButton
                                  label="Close"
                                  primary={true}
                                  onTouchTap={() => { this.setState({loginSuccess: false});
                                                      displaySearch();
                                                      }}/></Link>}
                                  modal={false}
                                  open={this.state.loginSuccess}
                                  onRequestClose={()=>{this.setState({loginSuccess: false})}}>
                                Successfully logged in.
                              </Dialog>

                              <Dialog
                                title="Error"
                                  actions={<FlatButton
                                  label="Close"
                                  primary={true}
                                  keyboardFocused={true}
                                  onTouchTap={() => this.setState({loginError: false})}/>}
                                  modal={false}
                                  open={this.state.loginError}
                                  onRequestClose={()=>this.setState({loginError:false})}
                                  >
                                Wrong username or password {this.state.error}
                              </Dialog>

      </div>
  </Formsy.Form>
        );
    }
}
