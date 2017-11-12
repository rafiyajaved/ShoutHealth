/* jslint node: true, esnext: true */
'use strict';

import React from 'react';
import GoogleMap from 'google-map-react';

import Place from './Place.jsx';

export default class Map extends React.Component {

    constructor(props) {
        super(props);

        console.log(props)
        let userLat = Number(props.userLat);
        let userLng = Number(props.userLng);
        this.defaults = {
            center: { lat: userLat, lng: userLng },
            zoom: 10,
        };

        this.state = {
            center: { lat: userLat, lng: userLng },
            clicked:-10
        }
    }

    componentWillReceiveProps(newProps) {
        let userLat = Number(newProps.userLat);
        let userLng = Number(newProps.userLng);
        this.setState({center: { lat: userLat, lng: userLng }})
    }

    onChildClick(key, childProps) {
      this.setState({clicked:key});
    }

    onClickResult(result){
      console.log(result);
      this.props.displayResult(result);
    }

    render() {
        const { width, height } = this.props;
        const { getFilteredResources, displayResult, userLat, userLng } = this.props;
        const filteredResources = getFilteredResources();

        const map = (
            <div style={{height,width}}>
         <GoogleMap
            defaultCenter={this.defaults.center}
            center={this.state.center}
            defaultZoom={this.defaults.zoom}
            hoverDistance={20}
            onChildClick={(key, childProp)=>this.onChildClick(key, childProp)}
            yesIWantToUseGoogleMapApiInternals>

            {filteredResources.map((result, i) =>
                  <Place
                          index={i}
                          getClicked={()=>this.state.clicked}
                          onClickResult={(res)=>this.onClickResult(res)}
                          resource={filteredResources[i]}
                          lat={result.lat}
                          lng={result.lng}
                          text={i+1}
                          placename={result.name}
                          address={result.civic_address}/>
                          )}

            <Place getClicked={()=>this.state.clicked}
                   onClickResult={()=>console.log("do nothing")}
                  resource={" "}
                  lat={userLat}
                  lng={userLng}
                  text={"You"}
                  key={-1}
                  placename={"current location"} />

        </GoogleMap>
      </div>
        );
        return map;
    }
}
