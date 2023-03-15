import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BleError, BleManager, Characteristic, Device, Subscription } from 'react-native-ble-plx';
import { RootState } from '../store';
import { bleSliceInterface, connectDeviceByIdParams, NetworkState, toBLEDeviceVM } from './bleSlice.contracts';
import { MonitorPressure } from '../../components/BLEManager/MonitorPressure'
import bleServices from '../../constants/bleServices';
import { Buffer } from "buffer";
import AsyncStorage from '@react-native-async-storage/async-storage';

// import { useAppDispatch } from '../../hooks/hooks';

const bleManager = new BleManager();
let counter = 0;
let device: Device;
let pressureSubscription: Subscription;
let tempPressureArray: number[] = [];
let finalPressureArray: number[] = [];
const pressureKey = "@PressureKey";
// const dispatch = useAppDispatch();

const stopScan = () => {
    console.log('Stopping scan');
    bleManager.stopDeviceScan();
};

const savetoStorage = async (key: string, array: any) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(array));
        // console.log('Stored' + key);
    } catch (e) {
        console.log('Error saving' + key);
    }
}

const pressureMonitorCallbackHandler = (bleError: BleError | null, characteristic: Characteristic | null) => {
    counter ++;

    if (characteristic?.value) {
        // console.log("Characteristics: " + characteristic.value)
        let res = Math.round(Buffer.from(characteristic.value, 'base64').readFloatLE());
        // const value = characteristic.value;
        // setBluetoothData({ adapterState: res });
        let average = 0;

        // console.log("Pressure: " + res)
        tempPressureArray.push(res)

        if (counter == 100) {
            counter = 0;
            // console.log("Pressure Array: " + pressureArray)
            average = tempPressureArray.reduce((p, c) => p + c) / tempPressureArray.length;
            tempPressureArray = [];
            // console.log('Temp: ', tempPressureArray);

            const newAverageArray = [...finalPressureArray, average];

            while (newAverageArray.length > 6) {
                newAverageArray.shift();
            }
            finalPressureArray = newAverageArray;
            console.log(finalPressureArray);
            if (finalPressureArray.length == 6) {
                savetoStorage(pressureKey, finalPressureArray);
                // console.log('Attempting to save...');
            }
        }
    } else { console.log("ERROR for pressure"); console.log(bleError) }
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

export const startPressureMonitoring = () => async (dispatch: any) => {
    try {
        console.log('Monitoring pressure...');
        savetoStorage(pressureKey, []);
        pressureSubscription = bleManager.monitorCharacteristicForDevice(device.id, bleServices.sample.SAMPLE_SERVICE_UUID, bleServices.sample.SAMPLE_PRESSURE_CHARACTERISTIC_UUID, pressureMonitorCallbackHandler);
    }
    catch (error) {
        console.error('Error starting pressure monitoring: ', error);
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