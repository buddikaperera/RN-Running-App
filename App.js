// import React, { useState, useEffect, Fragment as Fragment } from "react";
// import { StatusBar } from "expo-status-bar";
// import {
//       Platform,
//       ActivityIndicator,
//       Text,
//       View,
//       StyleSheet,
// } from "react-native";
// import * as Location from "expo-location";
// import Running from "./src/components/Running";

// export default function App() {
//       const [errorMsg, setErrorMsg] = useState(null);

//       const [values, setValues] = useState({
//             latitude: "",
//             longitude: "",
//             ready: false,
//       });

//       useEffect(() => {
//             (async () => {
//                   let { status } =
//                         await Location.requestForegroundPermissionsAsync();
//                   if (status !== "granted") {
//                         setErrorMsg("Permission to access location was denied");
//                         return;
//                   }

//                   //let location = await Location.getCurrentPositionAsync({});
//                   //setLocation(location);
//                   const {
//                         coords: { latitude, longitude },
//                   } = await Location.getCurrentPositionAsync({});

//                   setValues({
//                         ...values,
//                         latitude: latitude,
//                         longitude: longitude,
//                         ready: true,
//                   });
//             })();
//       }, []); ////<Text>{JSON.stringify(values, null, 4)}</Text>

//       const { latitude, longitude, ready } = values;

//       return (
//             <Fragment>
//                   {!ready ? (
//                         <View style={[styles.container, styles.horizontal]}>
//                               <ActivityIndicator size="large" color="#CB3837" />
//                         </View>
//                   ) : (
//                         <View style={styles.container}>
//                               <Running
//                                     distance={200}
//                                     {...{ latitude, longitude }}
//                               />
//                         </View>
//                   )}
//             </Fragment>
//       );
// }

// const styles = StyleSheet.create({
//       container: {
//             flex: 1,
//             backgroundColor: "#fff",
//             alignItems: "center",
//             justifyContent: "center",
//       },
//       horizontal: {
//             flexDirection: "row",
//             justifyContent: "space-around",
//             padding: 10,
//       },
// });

import {
     StyleSheet,
     StatusBar,
     Text,
     View,
     ActivityIndicator,
} from "react-native";
import React, { Component } from "react";

import * as Location from "expo-location";
import Running from "./src/components/Running";
type AppState = {
     ready: boolean,
     latitude: number,
     longitude: number,
};

export default class App extends Component<{}, AppState> {
     constructor(props) {
          super(props);
          this.state = { ready: false, latitude: "", longitude: "" };
     }
     async componentDidMount() {
          console.log("Hi");

          try {
               const { status } =
                    await Location.requestForegroundPermissionsAsync();

               if (status === "granted") {
                    console.log("locationStatus granted");
                    const {
                         coords: { latitude, longitude },
                    } = await Location.getCurrentPositionAsync({});
                    this.setState({ ready: true, latitude, longitude });
               }
          } catch (error) {
               console.log("Could not get the location", error);
          }
     }
     render() {
          const { ready, latitude, longitude } = this.state;
          return (
               <React.Fragment>
                    <StatusBar barStyle="light-content" />
                    {ready && (
                         <Running distance={200} {...{ latitude, longitude }} />
                    )}
                    {!ready && (
                         <View style={[styles.container, styles.horizontal]}>
                              <ActivityIndicator size="large" color="#CB3837" />
                         </View>
                    )}
               </React.Fragment>
          );
     }
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: "#29252b",
          alignItems: "center",
          justifyContent: "center",
     },
     horizontal: {
          flexDirection: "row",
          justifyContent: "space-around",
          padding: 10,
     },
});
