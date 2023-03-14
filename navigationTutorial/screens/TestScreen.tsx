import React, { useEffect, useState } from 'react';
import { Text, View, Button } from 'react-native';
import Colors from '../constants/Colors';
import { styles, screenWidth } from '../constants/Styles';
import { useAppSelector } from '../hooks/hooks';
import { selectConnectedDevice } from '../store/ble/bleSlice';
import { BleError, BleManager, Characteristic, Subscription } from 'react-native-ble-plx';
import { useToast } from 'native-base';
import bleServices from '../constants/bleServices';
import { Buffer } from 'buffer';
import { ImageFormat } from '@shopify/react-native-skia';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';


interface BleState {
    bluetoothData: Array<number>; // Replace with the appropriate type of your Bluetooth data
  }


// const bleManager = new BleManager();
// let MAX_WEIGHT = 2; // Maximum expected weight in kg. Used for visuals only
// MAX_WEIGHT = MAX_WEIGHT * 1000;
// interface WeightWidgetProps {
//     pressure: number | null
// }
// const WeightWidget = (props: WeightWidgetProps) => {
//     const { pressure: pressure } = props;
//     const [renderedWeight, setRenderedWeight] = useState<string>('');
//     const [ratio, setRatio] = useState(0);
//     const MAX_SIZE = screenWidth * 0.8
//     useEffect(() => {
//         if (pressure) {
//             setRatio(pressure / MAX_WEIGHT);
//             setRenderedWeight(Math.round(pressure).toString())
//         }
//     }, [pressure]);
//     return (
//         <View style={{
//             alignItems: 'center', justifyContent: 'center', backgroundColor: `rgba(25,180,${ratio * 255}, ${ratio})`,
//             height: ratio * MAX_SIZE, width: ratio * MAX_SIZE, borderRadius: (ratio * MAX_SIZE) / 2,
//             minHeight: 20, minWidth: 20
//         }}>
//             <View style={{ ...styles.div.centered, height: 30, width: 50, backgroundColor: Colors.primary.text, borderRadius: 5 }}>
//                 <Text style={{ ...styles.text.plain, color: 'white', textAlign: 'center' }}>{renderedWeight} mBar</Text>
//             </View>
//         </View>
//     )
// }

async function getFromStorage(key: string) {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        // alert(jsonValue);
        return jsonValue;
        //     if (jsonValue !== null) {
        //         let arrayValue = await JSON.parse(jsonValue);
        //         let object = Object.fromEntries(arrayValue);
        //         let array = Array.from(jsonValue);
        //         // alert(value)
        //         return object;
        //     }
        //     // console.log('Got' + key);
        //     // return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log('Error getting' + key);
        return '';
    };
}

export const TestScreen = (props: { navigation: any }) => {
    // const [pressure, setPressure] = useState<number | null>(null)
    // const [magField, setmagField] = useState<number[] | null>(null)
    // const [acceleration, setAcceleration] = useState<number[] | null>(null)
    // const [angularVel, setAngularVel] = useState<number[] | null>(null)
    const device = useAppSelector(selectConnectedDevice);

    // const bluetoothData = useSelector((state: RootState) => (state as unknown as BleState).bluetoothData);
    
    // const dataMaxLength = 5;
    // let pressureSubscription: Subscription;
    // let magSubscription: Subscription;
    // let accSubscription: Subscription;
    // let gyrSubscription: Subscription;
    // let pressureArray: number[] = [];
    // let magFieldArray: number[][] = [];
    // let accelerationArray: number[][] = [];
    // let angularVelArray: number[][] = [];
    const pressureKey = "@PressureKey";
    // const magFieldKey = "@MagFieldKey";
    // const accelerationKey = "@AccelerationKey";
    // const angularVelKey = "@AngularVelKey";
    const [pressureData, setPressureData] = useState<number[]>([])
    // const [magFieldResult, setMagFieldResult] = useState<number[][]>([])
    // const [accelerationResult, setAccelerationResult] = useState<number[][]>([])
    // const [angularVelResult, setAngularVelResult] = useState<number[][]>([])
    // const [averageArray, setAverageArray] = useState([]);
    // const [counter, setCounter] = useState(0);

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
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
      }, []);

    console.log('Pressure Data: ', pressureData);

    // const savetoStorage = async (key: string, array: any) => {
    //     try {
    //         await AsyncStorage.setItem(key, JSON.stringify(array));
    //         // console.log('Stored' + key);
    //     } catch (e) {
    //         console.log('Error saving' + key);
    //     }
    // }

    // const pressureMonitorCallbackHandler = (bleError: BleError | null, characteristic: Characteristic | null) => {
    //     if (characteristic?.value) {
    //         // console.log("Characteristics: " + characteristic.value)
    //         const res = Buffer.from(characteristic.value, 'base64').readFloatLE();
    //         // console.log("Pressure: " + res)
    //         // setPressure(res);
    //         if (pressureArray.length > 5) {
    //             // console.log("Pressure Array: " + pressureArray)
    //             pressureArray.shift();
    //         } else {
    //             pressureArray.push(res);
    //         }
    //         // console.log(pressureArray);
    //         savetoStorage(pressureKey, pressureArray);
    //     } else { console.log("ERROR for pressure"); console.log(bleError) }
    // }
    // const imuMonitorCallbackHandler = (bleError: BleError | null, characteristic: Characteristic | null) => {
    //     if (characteristic?.value) {
    //         // console.log(characteristic.value);
    //         // Convert base64 string to byte array
    //         const byteArray = new Uint8Array(Buffer.from(characteristic.value, 'base64'));
    //         // console.log(byteArray);
    //         // Extract bytes for each float and convert to float values
    //         const dataView = new DataView(byteArray.buffer);
    //         const x = Math.round(dataView.getFloat32(0, true)); // offset 0, little-endian byte order
    //         const z = Math.round(dataView.getFloat32(8, true)); // offset 8, little-endian byte order
    //         const y = Math.round(dataView.getFloat32(4, true)); // offset 4, little-endian byte order

    //         const array = [x, y, z];
    //         // console.log(array);
    //         if (characteristic?.uuid === bleServices.sample.SAMPLE_MAG_CHARACTERISTIC_UUID) {
    //             // console.log("magField Characteristics: " + characteristic.uuid);
    //             // console.log("Magnetic Field: " + array)
    //             setmagField(array);
    //             if (magFieldArray.length > dataMaxLength) {
    //                 magFieldArray.shift();
    //             }
    //             magFieldArray.push(array);
    //             savetoStorage(magFieldKey, magFieldArray)
    //             // console.log("Magnetic Field Array Length: " + magFieldArray.length);
    //         } else if (characteristic?.uuid === bleServices.sample.SAMPLE_ACC_CHARACTERISTIC_UUID) {
    //             // console.log("Acceleration Characteristics: " + characteristic.uuid);
    //             // console.log("Res: " + res)
    //             // console.log("Acceleration: " + array)
    //             setAcceleration(array);
    //             if (accelerationArray.length > dataMaxLength) {
    //                 accelerationArray.shift();
    //             }
    //             accelerationArray.push(array);
    //             savetoStorage(accelerationKey, accelerationArray)
    //             // console.log("Acceleration Array Length: " + accelerationArray.length);
    //         } else if (characteristic?.uuid === bleServices.sample.SAMPLE_GYR_CHARACTERISTIC_UUID) {
    //             // console.log("Angular Velocity Characteristics: " + characteristic.uuid);
    //             // console.log("Angular Velocity: " + array)
    //             setAngularVel(array);
    //             if (angularVelArray.length > dataMaxLength) {
    //                 angularVelArray.shift();
    //             }
    //             angularVelArray.push(array);
    //             savetoStorage(angularVelKey, angularVelArray)
    //             // console.log("Angular Velocity Array Length: " + angularVelArray.length);
    //         } else { console.log("ERROR!"); console.log(bleError); }
    //     } else {
    //         console.log("ERROR for IMU"); console.log(bleError);
    //     }
    // }

    // useEffect(() => {
    //     if (device?.id) {
    //         console.log('Registered notification callback')
    //         console.log("Device ID: " + device.id)
    //         console.log("Service UUID " + bleServices.sample.SAMPLE_SERVICE_UUID)
    //         console.log("Characteristics UUID " + bleServices.sample.SAMPLE_PRESSURE_CHARACTERISTIC_UUID)
    //         pressureSubscription = bleManager.monitorCharacteristicForDevice(device.id, bleServices.sample.SAMPLE_SERVICE_UUID, bleServices.sample.SAMPLE_PRESSURE_CHARACTERISTIC_UUID, pressureMonitorCallbackHandler);
    //         // magSubscription = bleManager.monitorCharacteristicForDevice(device.id, bleServices.sample.SAMPLE_SERVICE_UUID, bleServices.sample.SAMPLE_PRESSURE_CHARACTERISTIC_UUID, pressureMonitorCallbackHandler);
    //         // accSubscription = bleManager.monitorCharacteristicForDevice(device.id, bleServices.sample.SAMPLE_SERVICE_UUID, bleServices.sample.SAMPLE_PRESSURE_CHARACTERISTIC_UUID, pressureMonitorCallbackHandler);
    //         // gyrSubscription = bleManager.monitorCharacteristicForDevice(device.id, bleServices.sample.SAMPLE_SERVICE_UUID, bleServices.sample.SAMPLE_PRESSURE_CHARACTERISTIC_UUID, pressureMonitorCallbackHandler);
    //         magSubscription = bleManager.monitorCharacteristicForDevice(device.id, bleServices.sample.SAMPLE_SERVICE_UUID, bleServices.sample.SAMPLE_MAG_CHARACTERISTIC_UUID, imuMonitorCallbackHandler);
    //         accSubscription = bleManager.monitorCharacteristicForDevice(device.id, bleServices.sample.SAMPLE_SERVICE_UUID, bleServices.sample.SAMPLE_ACC_CHARACTERISTIC_UUID, imuMonitorCallbackHandler);
    //         gyrSubscription = bleManager.monitorCharacteristicForDevice(device.id, bleServices.sample.SAMPLE_SERVICE_UUID, bleServices.sample.SAMPLE_GYR_CHARACTERISTIC_UUID, imuMonitorCallbackHandler);
    //     }
    //     // Remove characteristic monitoring subscriptions
    //     return function cleanupSubscriptions() {
    //         if (pressureSubscription) {
    //             pressureSubscription.remove();
    //             console.log("remove pressure subscription")
    //         }
    //         if (magSubscription) {
    //             magSubscription.remove();
    //             console.log("remove magField subscription")
    //         }
    //         if (accSubscription) {
    //             accSubscription.remove();
    //             console.log("remove acceleration subscription")
    //         }
    //         if (gyrSubscription) {
    //             gyrSubscription.remove();
    //             console.log("remove angular velocity subscription")
    //         }
    //     };
    // }, [props.navigation, device]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //       try {
    //         getFromStorage(pressureKey).then((dataArray) => {
    //             if (dataArray) {
    //                 setPressureResult(JSON.parse(dataArray));
    //                 // console.log(result)
    //             }
    //         })
    //       } catch (e) {
    //         console.log(e);
    //       }
    //     };
    //     const interval = setInterval(fetchData, 500);
    //     return () => clearInterval(interval);
    //   }, []);

    if (device?.id) {
        // console.log("Weight Widget: " + pressure)
        
        // getFromStorage(accelerationKey).then((dataArray) => {
        //     if (dataArray) {
        //         setAccelerationResult(JSON.parse(dataArray));
        //         // console.log(result)
        //     }
        // }).catch((error) => {
        //     console.log(error);
        // });
        // getFromStorage(angularVelKey).then((dataArray) => {
        //     if (dataArray) {
        //         setAngularVelResult(JSON.parse(dataArray));
        //         // console.log(result)
        //     }
        // }).catch((error) => {
        //     console.log(error);
        // });
        // console.log(magFieldResult)
        // let arrayAsString = Array.from(jsonArray).map(row => row.join('\t')).join('\n');
        return (
            <View style={styles.container.plainContainer}>
                {/* {pressure && <WeightWidget pressure={pressureResult[0]} />} */}
                {/* {magField && <Text style={styles.text.plain}> {magField.join(" ")}</Text>}
                {acceleration && <Text style={styles.text.plain}> {acceleration.join(" ")}</Text>}
                {angularVel && <Text style={styles.text.plain}> {angularVel.join(" ")}</Text>} */}

                <Text style={styles.text.plain}> Hello World </Text>
                <Text style={styles.text.plain}> {pressureData.join(', ')} </Text>
                {/* <Text style={styles.text.plain}>{pressureResult.map(ele => ele.toFixed(0)).join(", ")}</Text> */}
                {/* <Text style={styles.text.plain}>{magFieldResult.map(row => row.map(ele => ele.toFixed(0)).join(", ")).join('\n')}</Text> */}

                {/* <Text style={styles.text.plain}>{accelerationResult.map(ele => ele.toFixed(0)).join(", ")}</Text>
                <Text style={styles.text.plain}>{angularVelResult.map(ele => ele.toFixed(0)).join(", ")}</Text> */}
                {/* {result.map((row, i) => (
                        <Text key={i}>{row.join('\t')}</Text>
                    ))} */}

                {/* <Button title="Get Pressure" onPress={() => getFromStorage(pressureKey)} /> */}
                {/* <Button title="Get Magnetic Field" onPress={() => getFromStorage(magFieldKey)} />
                <Button title="Get Acceleration" onPress={() => getFromStorage(accelerationKey)} />
                <Button title="Get Angular Velocity" onPress={() => getFromStorage(angularVelKey)} /> */}
            </View>
        )
    }
    console.log("No device connected")
    return (
        <View style={styles.container.plainContainer}>
            <Text style={styles.text.emptyText}>No device connected</Text>
        </View>
    );
};