import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { styles } from '../constants/Styles';
import { Text, View } from '../components/Themed';
import Colors from '../constants/Colors';
import React, { useEffect, useState, Component } from 'react'
import { Pressable } from 'native-base';
import { background, color } from 'native-base/lib/typescript/theme/styled-system';
import colors from 'native-base/lib/typescript/theme/base/colors';
import { useIsPressed } from 'native-base/lib/typescript/components/primitives';
import getFromStorage, { saveToStorage } from '../components/Functions';
import { storageKeys } from '../constants/Storage';
import { CheckmarkCircle } from '../components/Components';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CalibrationModal() {
  const [titleText, setTitleText] = useState("Secure Your Prosthetic");
  const [buttonText, setButtonText] = useState("Prosthetic Secured");
  const [filler, setFiller] = useState(<View style={{ height: 375 }} />);
  let calibrationArray: number[] = []

  const buttonHandler = () => {
    if (titleText === "Secure Your Prosthetic") {
      console.log('Stand Up');
      setTitleText("Stand Up");
      setButtonText("I am Standing");
    } else if (titleText === "Stand Up") {
      console.log('Calibrating');
      setTitleText("Calibrating");
      setButtonText("Please Wait...");
      setFiller(<ActivityIndicator size={300} style={{ marginVertical: 37.5 }} color={Colors.primary.text} />);
    }
  }

  useEffect(() => {
    if (titleText === "Calibrating") {
      const endTime = Date.now() + 10000;

      const fetchData = async () => {
        if (Date.now() <= endTime) {
          try {
            getFromStorage(storageKeys.pressure).then((dataArray) => {
              if (dataArray) {
                if (calibrationArray.length === 0) {
                  calibrationArray = JSON.parse(dataArray);
                } else {
                  const array = JSON.parse(dataArray);
                  calibrationArray.push(array[array.length - 1]);
                }
              }
            })
          } catch (e) {
            console.log(e);
          }
        } else {
          const average = Math.round(calibrationArray.reduce((p, c) => p + c) / calibrationArray.length);
          setTitleText("Calibration")
          setButtonText("Done");
          setFiller(<View style={{ marginVertical: 62.5, backgroundColor: Colors.grey.text }}><CheckmarkCircle /></View>)
          saveToStorage(storageKeys.calibration, 1);
          saveToStorage(storageKeys.baseline, average)
        }
      }
      const interval = setInterval(fetchData, 1000);
      return () => clearInterval(interval);
    }
  }, [titleText]);

  return (
    <View style={[styles.container.plainContainer]}>
      <Text style={styles.text.title}>{titleText}</Text>
      <View style={styles.seperator.seperator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {filler}
      <Pressable style={[{ backgroundColor: Colors.primary.text, marginTop: 25, width:200 }, styles.button.button]} onPress={buttonHandler}>
        <Text style={styles.text.whiteTexts}>{buttonText}</Text>
      </Pressable>
    </View>
  );
}