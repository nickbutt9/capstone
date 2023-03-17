import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { styles } from '../constants/Styles';
import { Animated, Dimensions, ScrollView, SafeAreaView, Image, Pressable } from "react-native";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Progress from 'react-native-progress'
import Colors from '../constants/Colors'
import { FontAwesome } from '@expo/vector-icons';
import { useAppSelector } from '../hooks/hooks';
import { selectConnectedDevice } from '../store/ble/bleSlice';
import { storageKeys } from '../constants/Storage';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import colors from 'native-base/lib/typescript/theme/base/colors';
import getFromStorage from '../components/Functions';

const screenWidth = Dimensions.get("window").width;
const containerWidth = 0.9 * screenWidth;

const triggerNotification = () => {
  console.log("Notification Sent")
  Notifications.scheduleNotificationAsync({
    content: {
      title: "High Risk Detected",
      body: "Consider adding another sock layer"
    },
    trigger: {
      seconds: 5
    }
  });
}

export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {

  const device = useAppSelector(selectConnectedDevice);

  const alert =
    <View style={styles.container.alertContainer}>
      <FontAwesome name="exclamation-triangle" size={25} color='white' />
      <View style={{ width: 0.6 * containerWidth, backgroundColor: Colors.primary.text }}>
        <Text style={styles.text.whiteTexts}> Device Not Calibrated </Text>
      </View>
      <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? Colors.grey.text : 'white' }, styles.button.alertButton]} onPress={() => { navigation.navigate('Calibration') }}>
        <Text style={{ fontWeight: 'bold' }}>Calibrate</Text>
      </Pressable>
    </View>

  const recalibrate =
    <View style={styles.container.alertContainer}>
      <FontAwesome name="check" size={25} color='white' />
      <View style={{ width: 0.5 * containerWidth, backgroundColor: Colors.primary.text }}>
        <Text style={styles.text.whiteTexts}> Device Calibrated </Text>
      </View>
      <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? Colors.grey.text : 'white' }, styles.button.alertButton]} onPress={() => { navigation.navigate('Calibration') }}>
        <Text style={{ fontWeight: 'bold' }}>Re-Calibrate</Text>
      </Pressable>
    </View>

  let tint = Colors.primary.text;

  const [pressureValue, setPressureValue] = useState<number>(0);
  const [baselinePressure, setBaselinePressure] = useState<number>(1000);
  const [calibrationAlert, setCalibrationAlert] = useState(alert);
  const [gauge, setGauge] = useState(<AnimatedCircularProgress size={200} backgroundWidth={20} width={30} fill={10} tintColor={tint} arcSweepAngle={200} rotation={260} lineCap='round' backgroundColor={Colors.shading.text} style={styles.shape.gauge} />)

  useEffect(() => {
    const fetchData = async () => {
      try {
        getFromStorage(storageKeys.pressure).then((dataArray) => {
          if (dataArray) {
            const array: number[] = JSON.parse(dataArray);
            const value = array[array.length - 1];
            if (value) {
              setPressureValue(value);
            }
          }
        })
        getFromStorage(storageKeys.calibration).then((calibration) => {
          if (calibration) {
            const result = JSON.parse(calibration);
            if (result > 0) {
              setCalibrationAlert(recalibrate);
            } else {
              setCalibrationAlert(alert);
            }
          }
        })
        getFromStorage(storageKeys.baseline).then((baseline) => {
          if (baseline) {
            const value: number = JSON.parse(baseline);
            if (value) {
              setBaselinePressure(Math.round(value));
            } else {
              setBaselinePressure(1000);
            }
          }
        })
      } catch (e) {
        console.log(e);
      }
    };
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // console.log(pressureValue);
    if (pressureValue) {

      const percentage = (pressureValue - (baselinePressure - 5)) / 0.8;
      if (percentage <= 33) { tint = Colors.primary.text; }
      else if (percentage > 33 && percentage <= 66) { tint = 'orange'; }
      else if (percentage > 66) { tint = 'red'; }
      else { tint = Colors.primary.text; }

      setGauge(<AnimatedCircularProgress size={200} backgroundWidth={20} width={30} fill={percentage} tintColor={tint} arcSweepAngle={200} rotation={260} lineCap='round' backgroundColor={Colors.shading.text} style={styles.shape.gauge} />)

    }
  }, [pressureValue]);

  let deviceConnected = false;
  let calibrated = false;

  if (device?.id) { deviceConnected = true }

  if (!deviceConnected) {
    return (
      <View style={[styles.container.plainContainer, { marginTop: 15 }]}>
        <View style={styles.container.alertContainer}>
          <FontAwesome name="exclamation-triangle" size={25} color='white' />
          <View style={{ width: 0.6 * containerWidth, backgroundColor: Colors.primary.text }}>
            <Text style={styles.text.whiteTexts}> Device Not Connected </Text>
          </View>
          {/* <View style={{width:0.4*containerWidth, backgroundColor:Colors.primary.text}}></View> */}
          <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? Colors.grey.text : 'white' }, styles.button.alertButton]} onPress={() => { navigation.navigate('BLE') }}>
            <Text style={{ fontWeight: 'bold' }}>Connect</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (

    <SafeAreaView style={styles.container.plainContainer}>
      <Text style={styles.text.title}>Welcome John!</Text>
      <View style={styles.seperator.seperator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {calibrationAlert}
      <View style={styles.container.homeContainer}>
        <Text style={styles.text.subtitle}>Distal End Pressure</Text>
        {gauge}
        {/* <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? Colors.secondary.text : Colors.primary.text }, styles.button.button]} onPress={() => { [console.log('Notification Button'), triggerNotification ]}}> */}
        <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? Colors.secondary.text : Colors.primary.text }, styles.button.button]} onPress={triggerNotification}>
          <Text style={styles.text.whiteTexts}>Add a sock</Text>
        </Pressable>
      </View>
      <View style={styles.container.homeContainer}>
        <View style={{ width: containerWidth, flexDirection: 'row', alignItems: 'flex-end', borderRadius: 10 }}>
          <Text style={styles.text.subtitle}>Device Battery</Text>
          <View style={{ width: 0.4 * containerWidth }}></View>
          <View style={{ alignSelf: 'center', justifyContent: 'flex-end' }}>
            <Text style={styles.text.labels}>30%</Text>
          </View>
        </View>
        <View style={{ paddingTop: 15 }}>
          <Progress.Bar color={Colors.primary.text} unfilledColor={Colors.shading.text} progress={0.3} width={containerWidth * 0.8} />
        </View>
      </View>
    </SafeAreaView>
  );
}