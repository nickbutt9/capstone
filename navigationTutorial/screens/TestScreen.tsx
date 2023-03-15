import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { styles } from '../constants/Styles';
import { useAppSelector } from '../hooks/hooks';
import { selectConnectedDevice } from '../store/ble/bleSlice';
import { storageKeys} from '../constants/bleServices';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface BleState {
    bluetoothData: Array<number>; // Replace with the appropriate type of your Bluetooth data
  }

async function getFromStorage(key: string) {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue;
    } catch (e) {
        console.log('Error getting' + key);
        return '';
    };
}

export const TestScreen = (props: { navigation: any }) => {
    const device = useAppSelector(selectConnectedDevice);
    const [pressureData, setPressureData] = useState<number[]>([])
    const [magFieldData, setMagFieldData] = useState<number[][]>([])
    const [accelerationData, setAccelerationData] = useState<number[][]>([])
    const [angVelData, setAngularVelData] = useState<number[][]>([])

    useEffect(() => {
        const fetchData = async () => {
          try {
            getFromStorage(storageKeys.pressure).then((dataArray) => {
                if (dataArray) {
                    setPressureData(JSON.parse(dataArray));
                }
            })
            getFromStorage(storageKeys.magField).then((dataArray) => {
                if (dataArray) {
                    setMagFieldData(JSON.parse(dataArray));
                    // console.log("Magnetic Field: ", magFieldData)
                }
            })
            getFromStorage(storageKeys.acceleration).then((dataArray) => {
                if (dataArray) {
                    setAccelerationData(JSON.parse(dataArray));
                }
            })
            getFromStorage(storageKeys.angVel).then((dataArray) => {
                if (dataArray) {
                    setAngularVelData(JSON.parse(dataArray));
                }
            })
          } catch (e) {
            console.log(e);
          }
        };
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
      }, []);      

    if (device?.id) {
        
        return (
            <View style={styles.container.plainContainer}>

                <Text style={styles.text.plain}> Hello World </Text>
                <Text style={styles.text.plain}> {pressureData.join(', ')} </Text>
                <Text style={styles.text.plain}>{magFieldData.map(row => row.map(ele => ele.toFixed(0)).join(", ")).join('\n')}</Text>
                <View style={styles.seperator.seperator}></View>
                <Text style={styles.text.plain}>{accelerationData.map(row => row.map(ele => ele.toFixed(0)).join(", ")).join('\n')}</Text>
                <View style={styles.seperator.seperator}></View>
                <Text style={styles.text.plain}>{angVelData.map(row => row.map(ele => ele.toFixed(2)).join(", ")).join('\n')}</Text>
            </View>
        )
    }
    // console.log("No device connected")
    return (
        <View style={styles.container.plainContainer}>
            <Text style={styles.text.emptyText}>No device connected</Text>
        </View>
    );
};