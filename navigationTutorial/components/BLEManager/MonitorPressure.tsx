import { BleError, BleManager, Characteristic, Subscription } from 'react-native-ble-plx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppSelector } from '../../hooks/hooks';
import { selectConnectedDevice } from '../../store/ble/bleSlice';
import bleServices from '../../constants/bleServices';
import { useEffect } from 'react';


export function MonitorPressure() {

    const bleManager = new BleManager();
    const device = useAppSelector(selectConnectedDevice);
    let pressureArray: number[] = [];
    const pressureKey = "@PressureKey";
    let pressureSubscription: Subscription;
    
    
    const savetoStorage = async (key: string, array: any) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(array));
            // console.log('Stored' + key);
        } catch (e) {
            console.log('Error saving' + key);
        }
    }
    
    const pressureMonitorCallbackHandler = (bleError: BleError | null, characteristic: Characteristic | null) => {
        if (characteristic?.value) {
            // console.log("Characteristics: " + characteristic.value)
            const res = Buffer.from(characteristic.value, 'base64').readFloatLE();
            console.log("Pressure: " + res)
            // setPressure(res);
            // if (pressureArray.length > 5) {
            //     // console.log("Pressure Array: " + pressureArray)
            //     pressureArray.shift();
            // } else {
            //     pressureArray.push(res);
            // }
            // // console.log(pressureArray);
            // savetoStorage(pressureKey, pressureArray);
        } else { console.log("ERROR for pressure"); console.log(bleError) }
    }

    // useEffect(() => {
    //     if (device?.id) {
    //         console.log('Registered notification callback')
    //         console.log("Device ID: " + device.id)
    //         // console.log("Service UUID " + bleServices.sample.SAMPLE_SERVICE_UUID)
    //         console.log("Characteristics UUID " + bleServices.sample.SAMPLE_PRESSURE_CHARACTERISTIC_UUID)
    //         pressureSubscription = bleManager.monitorCharacteristicForDevice(device.id, bleServices.sample.SAMPLE_SERVICE_UUID, bleServices.sample.SAMPLE_PRESSURE_CHARACTERISTIC_UUID, pressureMonitorCallbackHandler);
    //     }
    //     // Remove characteristic monitoring subscriptions
    //     return function cleanupSubscriptions() {
    //         if (pressureSubscription) {
    //             pressureSubscription.remove();
    //             console.log("remove pressure subscription")
    //         }
    //     };
    // }, [device]);
}

