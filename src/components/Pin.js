import { Text, StyleSheet, View, Animated } from "react-native";
import React, { Component } from "react";

type PinState = {
     animation: Animated.value,
};
/// https://stackoverflow.com/questions/31578069/repeat-animation-with-new-animated-api
///https://www.codedaily.io/tutorials/Creating-Animated-Rings-with-React-Native-Reanimated
///https://reactscript.com/react-native/
export default class Pin extends Component<{}, PinState> {
     constructor(props) {
          super(props);
          this.state = { animation: new Animated.Value(0) };
     }
     componentDidMount() {
          const { animation } = this.state;
          Animated.loop(
               Animated.sequence([
                    Animated.timing(animation, {
                         toValue: 1,
                         duration: 1000,
                         useNativeDriver: true,
                    }),
                    Animated.timing(animation, {
                         toValue: 0,
                         duration: 1000,
                         useNativeDriver: true,
                    }),
               ]),
               {
                    useNativeDriver: true,
               }
          ).start();
     }
     render() {
          const { animation } = this.state;
          const scale = animation.interpolate({
               inputRange: [0, 1],
               outputRange: [0.5, 1.5],
          });
          return (
               <View style={styles.outerPin}>
                    <View style={styles.pin}>
                         <Animated.View
                              style={[
                                   {
                                        width: 10,
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: "#f2b659",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        transform: [{ scale }],
                                   },
                              ]}
                         />
                    </View>
               </View>
          );
     }
}

const styles = StyleSheet.create({
     outerPin: {
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: "rgba(242,182,89,0.25)",
          justifyContent: "center",
          alignItems: "center",
     },
     pin: {
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
     },
     innerPin: {
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: "#f2b659",
          justifyContent: "center",
          alignItems: "center",
     },
});
