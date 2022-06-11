import { Text, View, StyleSheet, Dimensions, SafeAreaView } from "react-native";
import React, { PureComponent } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import moment from "moment";
import CircularProgress from "react-native-circular-progress-indicator";
const { width, height } = Dimensions.get("window");

const radius = 100;
const padding = 10;
type MonitorProps = {
     distance: number,
     pace: number,
};

type MonitorState = {
     duration: number,
};

const formatDuration = (duration: number) =>
     moment
          .utc(moment.duration(duration, "s").asMilliseconds())
          .format("mm:ss");

export class Monitor extends PureComponent<MonitorProps, MonitorState> {
     constructor(props) {
          super(props);
          this.state = { duration: 0 };
     }

     componentDidMount() {
          this.interval = setInterval(
               () => this.setState({ duration: this.state.duration + 1 }),
               1000
          );
     }

     componentWillUnmount() {
          clearInterval(this.interval);
     }

     render() {
          const { distance, pace } = this.props;
          const { duration } = this.state;

          return (
               <SafeAreaView style={styles.container}>
                    <View style={styles.progres}>
                         <CircularProgress
                              radius={90}
                              value={distance}
                              textColor="white"
                              fontSize={20}
                              valueSuffix={" m"}
                              inActiveStrokeColor={"#2ecc71"}
                              inActiveStrokeOpacity={0.2}
                              inActiveStrokeWidth={4}
                              duration={duration}
                              onAnimationComplete={() => distance}
                         />
                    </View>
                    {/*<View style={styles.progresLabel}>
                         <Text style={{ fontSize: 34, color: "white" }}>
                              {distance}
                         </Text>
          </View>*/
     }
                    <View style={styles.rows}>
                         <View style={styles.row}>
                              <Icon name="watch" color="#ffac2d" size={36} />
                              <Text style={styles.label}>
                                   {formatDuration(pace)}
                              </Text>
                         </View>
                         <View style={styles.row}>
                              <Icon name="clock" color="#ffac2d" size={36} />
                              <Text style={styles.label}>
                                   {" "}
                                   {formatDuration(duration)}
                              </Text>
                         </View>
                    </View>
               </SafeAreaView>
          );
     }
}

export default Monitor;

const styles = StyleSheet.create({
     container: { backgroundColor: "#29252b", height: 294 },
     map: {
          width: width,
          // height: 50,
          backgroundColor: "#29252b",
     },
     row: {
          flexDirection: "row",
          justifyContent: "space-evenly",
     },
     rows: {
          flexDirection: "row",
          justifyContent: "space-evenly",
          height: 64,
     },
     label: {
          color: "white",
     },
     progres: {
          width: "100%", //radius * 2 + padding * 2,
          height: radius * 2, //;// + padding * 2,
          justifyContent: "center",
          alignItems: "center",
     },
     progresLabel: {
          ...StyleSheet.absoluteFillObject,
          justifyContent: "center",
          alignItems: "center",
     },
});
