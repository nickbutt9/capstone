import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { styles, chartConfig } from '../constants/Styles';
import { LineChart, BarChart } from "react-native-chart-kit";
import { Dimensions, ScrollView, SafeAreaView, Image } from "react-native";
import Colors from '../constants/Colors';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useSelector } from 'react-redux';
// import { RootState } from '../store/store';

const screenWidth = Dimensions.get("window").width;
const chartWidth = 0.8 * screenWidth;
const chartHeight = 200;
// interface BleState {
//   bluetoothData: Array<number>; // Replace with the appropriate type of your Bluetooth data
// }

// const bluetoothData = useSelector((state: RootState) => (state as unknown as BleState).bluetoothData);

export default function PressureScreen() {
  const [pressureData, setPressureData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@PressureKey');
        if (jsonValue) {
          const dataArray = JSON.parse(jsonValue);
          dataArray
          setPressureData(dataArray);
        } else {
          console.log("Can't set pressure data")
        }
      } catch (e) {
        console.log(e);
      }
    };

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const lineData = {
    labels: ["12pm", "1pm", "2pm", "3pm", "4pm"],
    datasets: [
      {
        // data: [20, 45, 28, 80, 99, 43, 54, 30, 67, 97],
        data: pressureData.slice(-5),
        // color: (opacity = 1) => `rgba(57, 99, 220, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
  };

  return (
    <SafeAreaView style={styles.container.scrollContainer}>
      <ScrollView style={styles.container.scrollView}>
        <Text style={styles.text.title}>Today's Data</Text>
        <View style={styles.seperator.seperator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <View style={styles.container.chartsContainer}>
          <Text style={styles.text.subtitle}>Pressure</Text>
          <Text style={styles.text.plain}>Today</Text>
          <LineChart data={lineData} width={chartWidth + 30} height={chartHeight} chartConfig={chartConfig} bezier verticalLabelRotation={0} fromZero withVerticalLines={false} style={{ marginLeft: -10 }} />
        </View>
        <View style={styles.container.chartsContainer}>
          <Text style={styles.text.subtitle}>Steps Walked</Text>
          <BarChart data={stepsData} width={chartWidth + 70} height={chartHeight} withInnerLines={false} yAxisSuffix="" yAxisLabel="" chartConfig={chartConfig} verticalLabelRotation={0} showValuesOnTopOfBars fromZero withHorizontalLabels={false} style={{ marginLeft: -70 }} />
        </View>
        <View style={styles.container.chartsContainer}>
          <Text style={styles.text.subtitle}>Today's Activities</Text>
          <View style={styles.container.horizontalContainer}>
            <View style={styles.container.circlesContainers}>
              <View style={styles.shape.circles}>
                <Text style={styles.text.whiteTexts}>3.0 hrs</Text>
              </View>
              <Text style={styles.text.labels}>Stand</Text>
            </View>
            <View style={styles.container.circlesContainers}>
              <View style={styles.shape.circles}>
                <Text style={styles.text.whiteTexts}>4.3 hrs</Text>
              </View>
              <Text style={styles.text.labels}>Sit</Text>
            </View>
            <View style={styles.container.circlesContainers}>
              <View style={styles.shape.circles}>
                <Text style={styles.text.whiteTexts}>2.1 hrs</Text>
              </View>
              <Text style={styles.text.labels}>Walk</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const stepsData = {
  labels: ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"],
  datasets: [
    {
      data: [512, 240, 480, 360, 440, 640, 230],
    }
  ]
};