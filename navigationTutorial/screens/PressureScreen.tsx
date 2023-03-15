import { Text, View } from '../components/Themed';
import { styles, chartConfig } from '../constants/Styles';
import { LineChart, BarChart } from "react-native-chart-kit";
import { Dimensions, ScrollView, SafeAreaView, Image } from "react-native";
import { useAppSelector } from '../hooks/hooks';
import { selectConnectedDevice } from '../store/ble/bleSlice';
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

async function getFromStorage(key: string) {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue;
  } catch (e) {
    console.log('Error getting' + key);
    return '';
  };
}

export default function PressureScreen() {
  const noData = {
    labels: ["-", "-", "-", "-", "-"],
    datasets: [
      {
        data: [0, 0, 0, 0, 0],
        strokeWidth: 2 // optional
      }
    ],
  };

  const [pressureData, setPressureData] = useState<number[]>([]);
  const [pressureChart, setPressureChart] = useState(
    <View style={styles.container.chartsContainer}>
      <Text style={styles.text.subtitle}>No Pressure Data</Text>
      <Text style={styles.text.plain}>N/A</Text>
      <LineChart data={noData} width={chartWidth + 30} height={chartHeight} chartConfig={chartConfig} bezier verticalLabelRotation={0} withVerticalLines={false} style={{ marginLeft: -10 }} />
    </View>)

  const device = useAppSelector(selectConnectedDevice);
  const pressureKey = "@PressureKey";

  useEffect(() => {
    const fetchData = async () => {
      try {
        getFromStorage(pressureKey).then((dataArray) => {
          if (dataArray) {
            setPressureData(JSON.parse(dataArray));
          }
        })
      } catch (e) {
        console.log(e);
      }
    };
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  // console.log('Pressure Screen Data: ', pressureData);

  const lineData = {
    labels: ["12pm", "1pm", "2pm", "3pm", "4pm", "5pm"],
    datasets: [
      {
        data: pressureData.slice(-6),
        strokeWidth: 2 // optional
      },
      {
        data: [970], // min
        withDots: false,
      },
      {
        data: [1050], // max
        withDots: false,
      },
    ],
  };

  useEffect(() => {
    if (pressureData.length > 5) {
      setPressureChart(
        (<View style={styles.container.chartsContainer}>
          <Text style={styles.text.subtitle}>Pressure</Text>
          <Text style={styles.text.plain}>Today</Text>
          <LineChart data={lineData} width={chartWidth + 30} height={chartHeight} chartConfig={chartConfig} verticalLabelRotation={0} fromZero={false} withVerticalLines={false} style={{ marginLeft: -10 }} />
        </View>))
    }
  }, [pressureData]);

  return (
    <SafeAreaView style={styles.container.scrollContainer}>
      <ScrollView style={styles.container.scrollView}>
        <Text style={styles.text.title}>Today's Data</Text>
        <View style={styles.seperator.seperator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        {pressureChart}
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