import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, Text, TouchableOpacity, View, PermissionsAndroid } from 'react-native';
import { screenWidth, styles } from '../constants/Styles';
import MainButton from '../components/button/MainButton';
// import PrimaryButton from '../components/button/PrimaryButton';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { connectDeviceById, scanBleDevices, selectAdapterState, selectConnectedDevice, selectScannedDevices, stopDeviceScan } from '../store/ble/bleSlice';
import { IBLEDevice } from '../store/ble/bleSlice.contracts';
import { Icon, useToast, Pressable } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { CheckmarkCircle } from '../components/Components';
import { FontAwesome } from '@expo/vector-icons';
import PulsingCircle from '../components/Components';
import { PulseIndicator } from '../components/PulseIndicator';

const requestBluetoothPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            {
                title: 'BLuetooth Permission Required',
                message: 'Bluetooth Permission is required for the Bluetooth communication with phone',
                //   buttonNeutral: 'Ask Me Later',
                //   buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use Bluetooth Scan');
        } else {
            console.log('Bluetooth Scan permission denied');
        }
    } catch (err) {
        console.warn("Error with BLE Permission =", err);
    }
};

interface DeviceItemProps {
    device: IBLEDevice | null
}
const DeviceItem = (props: DeviceItemProps) => {
    const { device } = props;
    const [isConnecting, setIsConnecting] = useState(false);
    const connectedDevice = useAppSelector(selectConnectedDevice)
    const dispatch = useAppDispatch();
    const toast = useToast();
    const connectHandler = async () => {
        if (isConnecting) return;
        if (device?.id) {
            setIsConnecting(true);
            const result = await dispatch(connectDeviceById({ id: device?.id }))
            if (result.meta.requestStatus === 'fulfilled') {
                toast.show({
                    description: 'Connection successful',
                    ...styles.toast.default,
                });
            }
            else if (result.meta.requestStatus === 'rejected') {
                toast.show({
                    description: 'Connection unsuccessful',
                    ...styles.toast.default,
                });
            }
            setIsConnecting(false);
        }
        else {
            toast.show({
                description: 'Connection unsuccessful (No ID)',
                ...styles.toast.default,
            });
        }
    }
    return (
        <TouchableOpacity style={{ ...styles.card.shadow, width: screenWidth * 0.8, backgroundColor: (connectedDevice?.id === device?.id) ? 'green' : 'white' }} onPress={connectHandler}>
            <Text style={{ ...styles.text.plain, paddingVertical: 10 }}>{device?.name}</Text>
        </TouchableOpacity>
    )
}
const BLEScreen: React.FC = () => {
    const [buttonText, setButtonText] = useState('Start Scan');
    const [isScanning, setIsScanning] = useState(false);
    const [iconName, setIconName] = useState('bluetooth-disabled');
    const [filler, setFiller] = useState(<View style={{ height: 375 }} />);
    const [stateText, setStateText] = useState('');
    const bleDevice = useAppSelector(selectConnectedDevice);
    const adapterState = useAppSelector(selectAdapterState);
    const scannedDevices = useAppSelector(selectScannedDevices).devices;
    const toast = useToast();
    const dispatch = useAppDispatch();


    const scanPressHandler = () => {
        if (isScanning) {
            dispatch(stopDeviceScan({}));
            setIsScanning(false);
            setButtonText('Start Scan');
            setFiller(<View style={{ height: 375 }} />)
        }
        else if (adapterState.toLowerCase() === 'poweredon') {
            dispatch(scanBleDevices());
            setIsScanning(true);
            setButtonText('Stop Scan');
            // setFiller(<View style={{marginVertical:62.5}}><ActivityIndicator size={250} color={Colors.primary.text} /></View>)
            // setFiller(<View style={{ marginVertical: 87.5 }}><PulsingCircle size={200} duration={1000} pulseColor={Colors.primary.text} /></View>)
            setFiller(<View style={{ marginVertical: 62.5 }}><PulseIndicator/></View>)
        }
        else {
            toast.show({
                description: stateText,
                ...styles.toast.default,
            });
        }
    }
    useEffect(() => {
        if (bleDevice) {
            setIconName('bluetooth-connected');
            setStateText('Connected');
            dispatch(stopDeviceScan({}));
            setIsScanning(false);
            setButtonText('Start Scan');
            setFiller(<View style={{ marginVertical: 62.5 }}><CheckmarkCircle /></View>)
        }
        else if (isScanning) {
            setStateText('Scanning...')
        }
        else {
            switch (adapterState.toLowerCase()) {
                case 'poweredoff':
                    setIconName('bluetooth-disabled');
                    setStateText('Bluetooth Disabled');
                    break;
                case 'poweredon':
                    setIconName('bluetooth');
                    setStateText('Ready To Connect');
                    break;
                default:
                    setStateText(adapterState);
                    setIconName('bluetooth-disabled');
                    break;
            }
        }
    }, [adapterState, bleDevice, isScanning]);


    return (
        <View style={[styles.container.plainContainer]}>
            {/* <Text style={styles.text.title}>{stateText}</Text> */}
            <View style={styles.card.shadow}>
                <View style={styles.div.row}>
                    <Text style={{ ...styles.text.plain, color: Colors.primary.text, alignSelf: 'center' }}>{stateText}</Text>
                    <Icon as={MaterialIcons} name={iconName} color={Colors.primary.text} size={7} />
                </View>
            </View>
            {/* <Button title="BLE Permission" onPress={requestBluetoothPermission} /> */}

            {/* <Text style={{ ...styles.text.plain, color: 'grey', textAlign: 'center' }}>Select a device below to connect.</Text> */}

            {scannedDevices?.length == 0 ? (filler) : 
            ([<Text style={{ ...styles.text.plain, color: 'grey', textAlign: 'center' }}>Select a device below to connect.</Text>,
            <FlatList contentContainerStyle={{ width: '100%', justifyContent: 'center' }} data={scannedDevices} renderItem={({ item }) => (<DeviceItem device={item} />)} />])}

            {/* {(scannedDevices?.length > 0) &&
            ([<Text style={{ ...styles.text.plain, color: 'grey', textAlign: 'center' }}>Select a device below to connect.</Text>,
            <FlatList contentContainerStyle={{ width: '100%', justifyContent: 'center' }} data={scannedDevices} renderItem={({ item }) => (<DeviceItem device={item} />)} />])} */}

            <Pressable style={[{ backgroundColor: Colors.primary.text, marginBottom: 100 }, styles.button.button]} onPress={scanPressHandler}>
                <Text style={styles.text.whiteTexts}>{buttonText}</Text>
            </Pressable>
        </View>
    );
};
export default BLEScreen;