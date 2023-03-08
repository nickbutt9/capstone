import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Colors from '../constants/Colors';
import { styles, screenWidth } from '../constants/Styles';
import { useAppSelector } from '../hooks/hooks';
import { selectConnectedDevice } from '../store/ble/bleSlice';
import { BleError, BleManager, Characteristic, Subscription } from 'react-native-ble-plx';
import { useToast } from 'native-base';
import bleServices from '../constants/bleServices';
import { Buffer } from 'buffer';
const bleManager = new BleManager();
let MAX_WEIGHT = 2; // Maximum expected weight in kg. Used for visuals only
MAX_WEIGHT = MAX_WEIGHT*1000;
interface WeightWidgetProps {
    pressure: number | null
}
const WeightWidget = (props: WeightWidgetProps) => {
    const { pressure: pressure } = props;
    const [renderedWeight, setRenderedWeight] = useState<string>('');
    const [ratio, setRatio] = useState(0);
    const MAX_SIZE = screenWidth*0.8
    useEffect(() => {
        if (pressure) {
            setRatio(pressure / MAX_WEIGHT);
            setRenderedWeight(Math.round(pressure).toString())
        }
    }, [pressure]);
    return (
        <View style={{
            alignItems: 'center', justifyContent: 'center', backgroundColor: `rgba(25,180,${ratio*255}, ${ratio})`,
            height: ratio*MAX_SIZE, width: ratio*MAX_SIZE, borderRadius: (ratio*MAX_SIZE)/2,
            minHeight: 20, minWidth: 20
        }}>
            <View style={{ ...styles.div.centered, height: 30, width: 50, backgroundColor: Colors.primary.text, borderRadius: 5 }}>
                <Text style={{ ...styles.text.plain, color: 'white', textAlign: 'center' }}>{renderedWeight} mBar</Text>
            </View>
        </View>
    )
}
export const TestScreen = (props: { navigation: any }) => {
    const [pressure, setPressure] = useState<number | null>(null)
    const device = useAppSelector(selectConnectedDevice);
    let pressureSubscription: Subscription;
    const pressureMonitorCallbackHandler = (bleError: BleError | null, characteristic: Characteristic | null) => {
        if (characteristic?.value){
            // console.log("Characteristics: " + characteristic.value)
            const res = Buffer.from(characteristic.value, 'base64').readFloatLE();
            // console.log("Res: " + res)
            setPressure(res);
        } else {console.log("ERROR!");console.log(bleError)}
    }
    useEffect(() => {
        if (device?.id) {
            console.log('Registered notification callback')
            console.log("Device ID: " + device.id)
            console.log("Service UUID " + bleServices.sample.SAMPLE_SERVICE_UUID)
            console.log("Characteristics UUID " + bleServices.sample.SAMPLE_PRESSURE_CHARACTERISTIC_UUID)
            pressureSubscription = bleManager.monitorCharacteristicForDevice(device.id, bleServices.sample.SAMPLE_SERVICE_UUID, bleServices.sample.SAMPLE_PRESSURE_CHARACTERISTIC_UUID, pressureMonitorCallbackHandler)
            
            console.log("Pressure Subscription: " + pressureSubscription)
        }
        // Remove characteristic monitoring subscriptions
        return function cleanupSubscriptions() {
            if (pressureSubscription) {
                pressureSubscription.remove();
            }
        };
    }, [props.navigation, device]);
    if (device?.id) {
        console.log("Weight Widget: " + pressure)
        return (
            <View style={styles.container.plainContainer}>
                {pressure && <WeightWidget pressure={pressure}/>}
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

// import { StyleSheet, Dimensions } from 'react-native';
// import { TouchableOpacity, FlatList } from 'react-native';
// import { useAppDispatch } from '../hooks/hooks';
// import { connectDeviceById, scanBleDevices, selectAdapterState, selectScannedDevices, stopDeviceScan } from '../store/ble/bleSlice';

// const _BleManager = new BleManager();


// const startScan = () => {
//     console.log("pressed")
//     _BleManager.startDeviceScan(null, {
//         allowDuplicates: false,
//     },
//         async (error, device) => {
//             // setDisplayText('Scanning...');
//             if (error) {
//                 console.log(error)
//                 _BleManager.stopDeviceScan();
//             }
//             console.log(device?.localName, device?.name);
//             // if (device?.localName == 'Test' || device?.name == 'Test') {
//             // setDevices([...devices, device]);
//             _BleManager.stopDeviceScan();
//             // }
//         },
//     );
// };


// export const TestScreen: React.FC = () => {

//     // const [devices, setDevices] = useState(useAppSelector(selectScannedDevices).devices)

//     // const connectedDevice = useAppSelector(selectConnectedDevice)

//     // const [displayText, setDisplayText] = useState('Start Scan');

//     // const connectDevice = (device: { id: string; }) => {
//     //     _BleManager.stopDeviceScan();
//     //     _BleManager.connectToDevice(device.id).then(async device => {
//     //         await device.discoverAllServicesAndCharacteristics();
//     //         _BleManager.stopDeviceScan();
//     //         setDisplayText(`Device connected\n with ${device.name}`);
//     //         setConnectedDevice(device);
//     //         setDevices([]);
//     //         device.services().then(async service => {
//     //             for (const ser of service) {
//     //                 ser.characteristics().then(characteristic => {
//     //                     getCharacteristics([...characteristics, characteristic]);
//     //                 });
//     //             }
//     //         });
//     //     });
//     // };

//     // const disconnectDevice = () => {
//     //     connectedDevice.cancelConnection();
//     // };

//     return (
//         <View style={thisStyles.mainContainer} >
//             {
//                 // devices.length == 0 ? (
//                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                     <TouchableOpacity
//                         activeOpacity={0.6}
//                         onPress={startScan}
//                         style={thisStyles.circleView}>
//                         <Text style={thisStyles.boldTextStyle}>hi</Text>
//                     </TouchableOpacity>
//                 </View>
//             }
//         </View >
//     );
// };

// const thisStyles = StyleSheet.create({
//     mainContainer: {
//         flex: 1,
//         padding: 10,
//         // justifyContent: 'center',
//         // alignItems: 'center',
//     },
//     circleView: {
//         width: 250,
//         justifyContent: 'center',
//         alignItems: 'center',
//         alignSelf: 'center',
//         height: 250,
//         borderRadius: 150,
//         borderWidth: 1,
//     },
//     boldTextStyle: {
//         fontSize: 20,
//         color: 'black',

//         fontWeight: 'bold',
//         textAlign: 'center',
//     },
// });