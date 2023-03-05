import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NativeBaseProvider } from "native-base";

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { PopupProvider } from 'react-native-popup-view';

import 'expo-dev-client';
import store from './store/store'
import { Provider } from 'react-redux';
import BLEManager from './components/BLEManager/BLEManager';

export default function App() {
  console.log("App Refreshed")
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <NativeBaseProvider>
          <PopupProvider>
            <SafeAreaProvider >
              
              <Navigation colorScheme={colorScheme} />
              <StatusBar />
            </SafeAreaProvider>
          </PopupProvider>
        </NativeBaseProvider>
      </Provider>
    );
  }
}

// ---------------------------------------------------------------------

// import React, { useState } from "react";
// import { 
//   Button,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import DeviceModal from "./screens/DeviceConnectionModal";
// import { PulseIndicator } from "./components/PulseIndicator";
// import useBLE from  "./components/BLEManager/useBLE";
// import { PermissionsAndroid } from "react-native";

// const requestBluetoothPermission = async () => {
//   try {
//       const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//           {
//               title: 'BLuetooth Permission Required',
//               message: 'Bluetooth Permission is required for the Bluetooth communication with phone',
//               //   buttonNeutral: 'Ask Me Later',
//               //   buttonNegative: 'Cancel',
//               buttonPositive: 'OK',
//           },
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           console.log('You can use Bluetooth Scan');
//       } else {
//           console.log('Bluetooth Scan permission denied');
//       }
//   } catch (err) {
//       console.warn("Error with BLE Permission =", err);
//   }
// };

// const App = () => {
//   const {
//     requestPermissions,
//     scanForPeripherals,
//     allDevices,
//     connectToDevice,
//     connectedDevice,
//     heartRate,
//     disconnectFromDevice,
//   } = useBLE();
//   const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

//   const scanForDevices = async () => {
//     const isPermissionsEnabled = await requestPermissions();
//     if (isPermissionsEnabled) {
//       scanForPeripherals();
//     }
//   };

//   const hideModal = () => {
//     setIsModalVisible(false);
//   };

//   const openModal = async () => {
//     scanForDevices();
//     setIsModalVisible(true);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.heartRateTitleWrapper}>
//         {connectedDevice ? (
//           <>
//             <PulseIndicator />
//             <Text style={styles.heartRateTitleText}>Your Heart Rate Is:</Text>
//             <Text style={styles.heartRateText}>{heartRate} bpm</Text>
//           </>
//         ) : (
//           <Text style={styles.heartRateTitleText}>
//             Please Connect to a Heart Rate Monitor
//           </Text>
//         )}
//       </View>
//       <Button title="BLE Permission" onPress={requestBluetoothPermission} />
//       <TouchableOpacity
//         onPress={connectedDevice ? disconnectFromDevice : openModal}
//         style={styles.ctaButton}
//       >
//         <Text style={styles.ctaButtonText}>
//           {connectedDevice ? "Disconnect" : "Connect"}
//         </Text>
//       </TouchableOpacity>
//       <DeviceModal
//         closeModal={hideModal}
//         visible={isModalVisible}
//         connectToPeripheral={connectToDevice}
//         devices={allDevices}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f2f2f2",
//   },
//   heartRateTitleWrapper: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   heartRateTitleText: {
//     fontSize: 30,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginHorizontal: 20,
//     color: "black",
//   },
//   heartRateText: {
//     fontSize: 25,
//     marginTop: 15,
//   },
//   ctaButton: {
//     backgroundColor: "#FF6060",
//     justifyContent: "center",
//     alignItems: "center",
//     height: 50,
//     marginHorizontal: 20,
//     marginBottom: 5,
//     borderRadius: 8,
//   },
//   ctaButtonText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "white",
//   },
// });

// export default App;