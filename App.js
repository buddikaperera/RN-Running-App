import React, { useState, useEffect, Fragment as Fragment } from "react";
import { StatusBar } from "expo-status-bar";
import {
      Platform,
      ActivityIndicator,
      Text,
      View,
      StyleSheet,
} from "react-native";
import * as Location from "expo-location";

export default function App() {
      const [errorMsg, setErrorMsg] = useState(null);

      const [values, setValues] = useState({
            latitude: "",
            longitude: "",
            ready: false,
      });

      useEffect(() => {
            (async () => {
                  let { status } =
                        await Location.requestForegroundPermissionsAsync();
                  if (status !== "granted") {
                        setErrorMsg("Permission to access location was denied");
                        return;
                  }

                  //let location = await Location.getCurrentPositionAsync({});
                  //setLocation(location);
                  const {
                        coords: { latitude, longitude },
                  } = await Location.getCurrentPositionAsync({});

                  setValues({
                        ...values,
                        latitude: latitude,
                        longitude: longitude,
                        ready: true,
                  });
            })();
      }, []); ////<Text>{JSON.stringify(values, null, 4)}</Text>

      const { latitude, longitude, ready } = values;

      return (
            <Fragment>
                  {!ready ? (
                        <View style={[styles.container, styles.horizontal]}>
                              <ActivityIndicator size="large" color="#CB3837" />
                        </View>
                  ) : (
                        <View style={styles.container}>
                              <Text>{JSON.stringify(values, null, 4)}</Text>
                        </View>
                  )}
            </Fragment>
      );
}

const styles = StyleSheet.create({
      container: {
            flex: 1,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
      },
      horizontal: {
            flexDirection: "row",
            justifyContent: "space-around",
            padding: 10,
      },
});
