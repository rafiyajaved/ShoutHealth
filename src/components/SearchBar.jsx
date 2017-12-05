/* jslint node: true, esnext: true */
'use strict';

// JavaScript source code
import React from 'react';
import PrimaryOptions from './PrimaryOptions.jsx';
import SecondaryOptions from './SecondaryOptions.jsx';

export default class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
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

    render() {
        return (
            <div>
                <PrimaryOptions container={this.refs.content}
                              getselectedIndex={()=>this.state.selectedIndex}
                              onSelect={(index) => this.selectOption(index)}/>
                <SecondaryOptions container={this.refs.content}
                              getselectedIndex={()=>this.state.selectedIndex}
                              onSelect={(index) => this.selectOption(index)}/>
            </div>
        );
    }
}
