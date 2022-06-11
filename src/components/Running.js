////https://stackoverflow.com/questions/42032015/react-native-maps-how-to-animate-to-coordinate
///https://www.codedaily.io/tutorials/Build-a-Map-with-Custom-Animated-Markers-and-Region-Focus-when-Content-is-Scrolled-in-React-Native

import * as _ from "lodash";
import * as turf from "@turf/turf";
import { Text, StyleSheet, View, Dimensions } from "react-native";
import React, { Component } from "react";
import MapView, { Circle, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { Monitor } from "./Monitor";
import moment from "moment";
import Pin from "./Pin";
const { width, height } = Dimensions.get("window");
const { Marker, Polyline } = MapView;
type RunProps = {
     distance: number,
     latitude: number,
     longitude: number,
};
type Position = {
     timestamp: number,
     coords: {
          latitude: number,
          longitude: number,
          accuracy: number,
     },
};

type RunState = {
     positions: Position[],
     distance: number,
     pace: number,
};

const timestamp = moment().valueOf();

const distanceBetween = (origin: Position, destination: Position) => {
     const from = turf.point([origin.coords.longitude, origin.coords.latitude]);

     const to = turf.point([
          destination.coords.longitude,
          destination.coords.latitude,
     ]);

     const options = { units: "meters" };

     return _.round(turf.distance(from, to, options));
};

const computePace = (
     delta: number,
     previousPosition: Position,
     position: Position
) => {
     const time = position.timestamp - previousPosition.timestamp; /// / 1000;
     const pace = time / delta;
     //console.log({ pace, time, delta });
     return pace;
};

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922; /////0.001
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO; //0.01

export default class Running extends Component<RunProps, RunState> {
     constructor(props) {
          super(props);
          this.state = { positions: [], distance: 0 };
     }

     map = React.createRef();
     async componentDidMount() {
          const options = {
               accuracy: Location.Accuracy.Highest,
               timeInterval: 1000,
               distanceInterval: 1,
          };
          try {
               this.listener = await Location.watchPositionAsync(
                    options,
                    this.onPositionChange
               );
          } catch (error) {}
     }

     componentWillUnmount = () => {
          this.listener.remove();
     };

     handleChangeRegion = (region) => {
          this.map.animateCamera({ center: region });
     };

     onPositionChange = (position: Position) => {
          //this.map.current.animateToCoordinate(position.coords, 1000);
          const { latitude, longitude } = this.props;

          const lastPosition =
               this.state.positions.length === 0
                    ? {
                           coords: { latitude, longitude },
                           timestamp: position.timestamp,
                      }
                    : this.state.positions[this.state.positions.length - 1];

          const delta = distanceBetween(lastPosition, position);

          const distance = this.state.distance + delta;

          const pace =
               delta > 0 ? computePace(delta, lastPosition, position) : 0;
          //console.log({ position });
          this.setState({
               positions: [...this.state.positions, position],
               distance,
               pace,
          });
     };

     render() {
          const { positions, distance, pace } = this.state;
          const { latitude, longitude } = this.props;
          // console.log(distance, latitude, longitude);

          const currentPosition =
               positions.length == 0
                    ? { coords: { latitude, longitude } }
                    : positions[positions.length - 1];

          return (
               <View style={styles.container}>
                    <Monitor {...{ distance, pace }} />
                    <MapView.Animated
                         provider={
                              Platform.OS === "android"
                                   ? PROVIDER_GOOGLE
                                   : PROVIDER_DEFAULT
                         }
                         ref={this.map}
                         style={styles.map}
                         mapType="mutedStandard"
                         initialRegion={{
                              latitude,
                              longitude: longitude,
                              latitudeDelta: 0.001,
                              longitudeDelta: 0.01,
                         }}
                         // followsUserLocation={true}
                         // showsCompass={true}
                         showsUserLocation={true}
                         onRegionChange={() => this.handleChangeRegion}
                         onRegionChangeComplete={() =>
                              this.handleChangeRegion.bind(this)
                         }
                    >
                         <Marker
                              coordinate={currentPosition.coords}
                              anchor={{ x: 0.5, y: 0.5 }}
                         >
                              <Pin />
                         </Marker>
                         <Polyline
                              coordinates={positions.map(
                                   (position) => position.coords
                              )}
                              strokeWidth={10}
                              strokeColor="#f2b659"
                         />
                    </MapView.Animated>
               </View>
          );
     }
}

const styles = StyleSheet.create({
     container: { flex: 1 },
     map: {
          flex: 1,
          width: width,
          height: height,
     },
});
