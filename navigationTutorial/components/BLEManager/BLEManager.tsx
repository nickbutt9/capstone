
// ==============================================
// Void top-level component to manage BLE devices
// ==============================================
import React, { useEffect, useState } from 'react';
import { BleManager, Device, Subscription } from 'react-native-ble-plx';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import {
    disconnectDevice,
    selectConnectedDevice,
    setAdapterState,
    setLocationPermissionStatus,
} from '../../store/ble/bleSlice';
import * as Location from 'expo-location';
import { useToast } from 'native-base';
import { styles } from '../../constants/Styles';
import bleServices from '../../constants/bleServices';

const bleManager = new BleManager();
let device: Device;

const BLEManager = () => {
    const [subscriptions, setSubscriptions] = useState<Array<Subscription>>([]);
    const connectedDevice = useAppSelector(selectConnectedDevice);
    const dispatch = useAppDispatch();
    const toast = useToast();

    const disconnectCallback = () => {
        console.log('BLEManager: disconnectCallback triggered');
        if (connectedDevice) dispatch(disconnectDevice());
        toast.show({
            description: 'Disconnected from device',
            ...styles.toast.default,
        });
    }

    const checkDevices = async () => {
        if (connectedDevice && !device) {
            const devices = await bleManager.connectedDevices([bleServices.sample.SAMPLE_SERVICE_UUID]);
            device = devices[0];
            if (device) {
                const subscription = device.onDisconnected(disconnectCallback);
                setSubscriptions(prevState => [...prevState, subscription]);
            }
            else {
                device = await bleManager.connectToDevice(connectedDevice.id);
                const subscription = device.onDisconnected(disconnectCallback);
                setSubscriptions(prevState => [...prevState, subscription]);
            }
        }
    }

    // BLE Adapter State Manager
    useEffect(() => {
        const subscription = bleManager.onStateChange((state) => {
            dispatch(setAdapterState({ adapterState: state }));
            setSubscriptions(prevState => [...prevState, subscription])
        }, true);
        return function cleanup() {
            // Remove all subscriptions when manager unmounts
            subscriptions.map(_subscription => {
                _subscription.remove();
                return true;
            });
            setSubscriptions([]);
        };
    }, []);

    useEffect(() => {
        // Manage device connection changes
        checkDevices();
    }, [connectedDevice])

    // Permissions manager
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            dispatch(setLocationPermissionStatus({ status }));
        })();
    }, []);

    return null;
};

export default BLEManager;