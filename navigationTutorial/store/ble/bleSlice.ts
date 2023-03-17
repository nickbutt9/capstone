import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BleError, BleManager, Characteristic, Device, Subscription } from 'react-native-ble-plx';
import { RootState } from '../store';
import { bleSliceInterface, connectDeviceByIdParams, NetworkState, toBLEDeviceVM } from './bleSlice.contracts';
import { bleServices } from '../../constants/bleServices';
import { Buffer } from "buffer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { storageKeys } from '../../constants/Storage';
import getFromStorage, { saveToStorage } from '../../components/Functions';

// import { useAppDispatch } from '../../hooks/hooks';

const bleManager = new BleManager();
let pressureCounter = 0;
let magFieldCounter = 0;
let accelerationCounter = 0;
let angVelCounter = 0;
let device: Device;
let pressureSubscription: Subscription;
let magSubscription: Subscription;
let accSubscription: Subscription;
let angVelSubscription: Subscription;
let tempPressureArray: number[] = [];
let finalPressureArray: number[] = [];
let tempMagFieldArray: number[][] = [];
let finalMagFieldArray: number[][] = [];
let tempAccelerationArray: number[][] = [];
let finalAccelerationArray: number[][] = [];
let tempAngVelArray: number[][] = [];
let finalAngVelArray: number[][] = [];

const stopScan = () => {
    console.log('Stopping scan');
    bleManager.stopDeviceScan();
};

const processIMUData = (tempArray: number[][], key: string, finalArray: number[][]) => {
    // console.log("Proess IMU");
    const average = tempArray[0].map((col, i) => tempArray.map(row => row[i]).reduce((acc, c) => acc + c, 0) / tempArray.length);
    const newAverageArray: number[][] = [...finalArray, average];
    while (newAverageArray.length > 6) {
        newAverageArray.shift();
    }
    finalArray = newAverageArray;
    saveToStorage(key, finalArray)
    return finalArray;
}

const pressureMonitorCallbackHandler = async (bleError: BleError | null, characteristic: Characteristic | null) => {

    pressureCounter++;

    if (characteristic?.value) {
        // console.log("Characteristics: " + characteristic.value)
        let res = Math.round(Buffer.from(characteristic.value, 'base64').readFloatLE());
        let highRisk = 1050;
        // const value = characteristic.value;
        // setBluetoothData({ adapterState: res });

        // console.log("Pressure: " + res)
        tempPressureArray.push(res)

        if (pressureCounter == 100) {
            pressureCounter = 0;
            // console.log("Pressure Array: " + pressureArray)
            const average = tempPressureArray.reduce((p, c) => p + c) / tempPressureArray.length;
            console.log(average);

            const lastNotificationTimestamp = await AsyncStorage.getItem(storageKeys.notification);
            const currentTimestamp = Date.now();
            getFromStorage(storageKeys.baseline).then((result) => {
                if (result) {
                    const baseline = JSON.parse(result);
                    highRisk = Math.round(baseline + 50);
                    console.log("High Risk: ", highRisk)
                }
              })

            if (average > highRisk && (!lastNotificationTimestamp || currentTimestamp - parseInt(lastNotificationTimestamp) > 10000)) {
                Notifications.scheduleNotificationAsync({
                    content: {
                        title: "High Risk Detected",
                        body: "Consider adding another sock layer"
                    },
                    trigger: null,
                });
                console.log('Over pressure Notification')
                await AsyncStorage.setItem(storageKeys.notification, currentTimestamp.toString());
            };

            tempPressureArray = [];
            // console.log('Temp: ', tempPressureArray);

            const newAverageArray = [...finalPressureArray, average];

            while (newAverageArray.length > 6) {
                newAverageArray.shift();
            }
            finalPressureArray = newAverageArray;
            // console.log(finalPressureArray);
            saveToStorage(storageKeys.pressure, finalPressureArray);
        }
    } else { console.log("ERROR for pressure"); console.log(bleError) }
}

const imuMonitorCallbackHandler = (bleError: BleError | null, characteristic: Characteristic | null) => {
    if (characteristic?.value) {
        // console.log(characteristic.value);
        // Convert base64 string to byte array
        const byteArray = new Uint8Array(Buffer.from(characteristic.value, 'base64'));
        // console.log(byteArray);
        // Extract bytes for each float and convert to float values
        const dataView = new DataView(byteArray.buffer);
        const x = Math.round(dataView.getFloat32(0, true)); // offset 0, little-endian byte order
        const z = Math.round(dataView.getFloat32(8, true)); // offset 8, little-endian byte order
        const y = Math.round(dataView.getFloat32(4, true)); // offset 4, little-endian byte order

        const array = [x, y, z];
        // console.log(array);
        if (characteristic?.uuid === bleServices.sample.SAMPLE_MAG_CHARACTERISTIC_UUID) {
            magFieldCounter++;

            tempMagFieldArray.push(array);
            if (magFieldCounter == 100) {
                // console.log("Magnetic Field: " + array)
                finalMagFieldArray = processIMUData(tempMagFieldArray, storageKeys.magField, finalMagFieldArray)
                magFieldCounter = 0;
                tempMagFieldArray = [];
            }
        } else if (characteristic?.uuid === bleServices.sample.SAMPLE_ACC_CHARACTERISTIC_UUID) {
            accelerationCounter++;
            tempAccelerationArray.push(array);

            if (accelerationCounter == 100) {
                finalAccelerationArray = processIMUData(tempAccelerationArray, storageKeys.acceleration, finalAccelerationArray)
                accelerationCounter = 0;
                tempAccelerationArray = [];
            }
        } else if (characteristic?.uuid === bleServices.sample.SAMPLE_GYR_CHARACTERISTIC_UUID) {
            angVelCounter++;
            tempAngVelArray.push(array);

            if (angVelCounter == 100) {
                finalAngVelArray = processIMUData(tempAngVelArray, storageKeys.angVel, finalAngVelArray)
                angVelCounter = 0;
                tempAccelerationArray = [];
            }
        } else {
            console.log("ERROR for IMU"); console.log(bleError);
        }
    }
}

export const scanBleDevices = createAsyncThunk('ble/scanBleDevices', async (_, thunkAPI) => {
    try {
        bleManager.startDeviceScan(null, null, async (error, scannedDevice) => {
            if (error) {
                console.log('startDeviceScan error: ', error);
                throw new Error(error.toString());
            }
            if (scannedDevice && scannedDevice.name?.includes('BLE_SERVER')) {
                thunkAPI.dispatch(addScannedDevice({ device: toBLEDeviceVM(scannedDevice) }));
            }
        });
    } catch (error: any) {
        throw new Error(error.toString);
    }
});

export const connectDeviceById = createAsyncThunk('ble/connectDeviceById', async (params: connectDeviceByIdParams, thunkAPI) => {
    const { id } = params;

    try {
        stopScan();
        device = await bleManager.connectToDevice(id);
        const deviceChars = await bleManager.discoverAllServicesAndCharacteristicsForDevice(id);
        const services = await deviceChars.services();
        const serviceUUIDs = services.map(service => service.uuid);
        console.log("ServiceUUIDs: " + serviceUUIDs)
        return toBLEDeviceVM({ ...device, serviceUUIDs });
    } catch (error: any) {
        throw new Error(error.toString);
    }
});

export const startServicesMonitoring = () => async (dispatch: any) => {
    try {
        console.log('Monitoring services...');
        saveToStorage(storageKeys.pressure, []);
        saveToStorage(storageKeys.magField, []);
        saveToStorage(storageKeys.acceleration, []);
        saveToStorage(storageKeys.angVel, []);
        saveToStorage(storageKeys.baseline, 1000);
        saveToStorage(storageKeys.calibration, -1);
        pressureSubscription = bleManager.monitorCharacteristicForDevice(device.id, bleServices.sample.SAMPLE_SERVICE_UUID, bleServices.sample.SAMPLE_PRESSURE_CHARACTERISTIC_UUID, pressureMonitorCallbackHandler);
        magSubscription = bleManager.monitorCharacteristicForDevice(device.id, bleServices.sample.SAMPLE_SERVICE_UUID, bleServices.sample.SAMPLE_MAG_CHARACTERISTIC_UUID, imuMonitorCallbackHandler);
        accSubscription = bleManager.monitorCharacteristicForDevice(device.id, bleServices.sample.SAMPLE_SERVICE_UUID, bleServices.sample.SAMPLE_ACC_CHARACTERISTIC_UUID, imuMonitorCallbackHandler);
        angVelSubscription = bleManager.monitorCharacteristicForDevice(device.id, bleServices.sample.SAMPLE_SERVICE_UUID, bleServices.sample.SAMPLE_GYR_CHARACTERISTIC_UUID, imuMonitorCallbackHandler);
    }
    catch (error) {
        console.error('Error starting services monitoring: ', error);
    }
}

export const disconnectDevice = createAsyncThunk('ble/disconnectDevice', async (_, thunkAPI) => {
    console.log('Disconnecting')
    if (pressureSubscription) {
        pressureSubscription.remove();
        console.log("Remove pressure subscription")
    }
    if (device) {
        const isDeviceConnected = await device.isConnected();
        if (isDeviceConnected) {
            console.log('Disconnecting device');
            await device.cancelConnection();
            return { isSuccess: true }
        }
        else {
            throw new Error('No device connected');
        }
    }
    else {
        throw new Error('Device is undefined.')
    }
});

const initialState: bleSliceInterface = {
    adapterState: 'Unknown',
    bluetoothData: [],
    deviceConnectionState: { status: NetworkState.PENDING, error: '' },
    deviceScan: { devices: [], status: NetworkState.PENDING, error: '' },
    locationPermission: null,
    connectedDevice: null,
};

const bleSlice = createSlice({
    name: 'ble',
    initialState,
    reducers: {
        setAdapterState(state, action) {
            const { adapterState } = action.payload;
            state.adapterState = adapterState;
        },
        setBluetoothData: (state, action) => {
            console.log('Setting Bluetooth Data...')
            const { pressureData } = action.payload
            state.bluetoothData = pressureData;
        },
        setLocationPermissionStatus(state, action) {
            const { status } = action.payload;
            state.locationPermission = status;
        },
        setConnectedDevice(state, action) {
            const { device } = action.payload;
            state.connectedDevice = device;
        },
        addScannedDevice(state, action) {
            const { device } = action.payload;
            const existingDevices = state.deviceScan.devices.filter(existingDevice => device.id !== existingDevice?.id);
            const updatedDevices = [device, ...existingDevices];
            const sorted = updatedDevices.sort((a, b) => {
                a.rssi = a.rssi || -100;
                b.rssi = b.rssi || -100;
                return a.rssi > b.rssi ? -1 : b.rssi > a.rssi ? 1 : 0;
            });
            state.deviceScan.devices = sorted;
        },
        clearScannedDevices(state, action) {
            state.deviceScan = { devices: [], status: NetworkState.PENDING, error: '' };
        },
        stopDeviceScan(state, action) {
            bleManager.stopDeviceScan();
        },
    },
    extraReducers(builder) {
        builder
            .addCase(connectDeviceById.pending, (state, action) => {
                state.deviceConnectionState.status = NetworkState.LOADING;
                state.deviceConnectionState.error = '';
            })
            .addCase(connectDeviceById.fulfilled, (state, action: any) => {
                state.deviceConnectionState.status = NetworkState.SUCCESS;
                const device = action.payload;
                state.connectedDevice = device;
            })
            .addCase(connectDeviceById.rejected, (state, action) => {
                if (action.error.message === NetworkState.CANCELED) {
                    state.deviceConnectionState.status = NetworkState.CANCELED;
                    state.deviceConnectionState.error = action.error.message;
                } else {
                    state.deviceConnectionState.status = NetworkState.ERROR;
                    state.deviceConnectionState.error = action.error.message ?? '';
                }
            })
            .addCase(disconnectDevice.pending, (state, action) => {
                state.deviceConnectionState.status = NetworkState.LOADING;
                state.deviceConnectionState.error = '';
            })
            .addCase(disconnectDevice.fulfilled, (state, action: any) => {
                state.deviceConnectionState.status = NetworkState.CANCELED;
                state.connectedDevice = null;
            })
            .addCase(disconnectDevice.rejected, (state, action) => {
                if (action.error.message === NetworkState.CANCELED) {
                    state.deviceConnectionState.status = NetworkState.CANCELED;
                    state.deviceConnectionState.error = action.error.message;
                } else {
                    state.deviceConnectionState.status = NetworkState.ERROR;
                    state.deviceConnectionState.error = action.error.message ?? '';
                }
                state.connectedDevice = null;
            })
            ;
    },
});

export default bleSlice.reducer;

export const { setAdapterState, setBluetoothData, setLocationPermissionStatus, setConnectedDevice, addScannedDevice, clearScannedDevices, stopDeviceScan } = bleSlice.actions;

export const selectAdapterState = (state: RootState) => state.ble.adapterState;
export const selectConnectedDevice = (state: RootState) => state.ble.connectedDevice;
export const selectScannedDevices = (state: RootState) => state.ble.deviceScan;