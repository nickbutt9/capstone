// import React, { useEffect, useState } from 'react';
// import { View, Text } from 'react-native';
import BleManager from 'react-native-ble-manager';



// class BLEScanner extends Component {

//   constructor(props)
//   super(props)
//   _BLEManager = new BleManager();
//   const [devices, setDevices] = useState([]);
//   const [text, setText] = useState("Waiting to scan");

//   useEffect(() => {

//     // const subscription = this.manager.onStateChange((state) => {});
//     //   if (state === 'PoweredOn' && startScanning) {
//     //     _BleManager.startDeviceScan(null, null, (error, device) => {
//     //       if (error) {
//     //         console.log("startscanerror: " + error);
//     //         return;
//     //       }

//     //       // Check if it is a device you are looking for based on advertisement data
//     //       // or other criteria.
//     //       if (device.name === 'TI BLE Sensor Tag' ||
//     //         device.name === 'SensorTag') {

//     //         // Stop scanning as it's not necessary if you are scanning for one device.
//     //         this.manager.stopDeviceScan();

//     //         // Proceed with connection.
//     //       }
//     //     });
//     //     subscription.remove();
//     //   }
//     // }, true);
//     // let subscription;

//     // if (startScanning) {
//     //   setText("Scanning for devices...")
//     //   console.log("Starting Scan")
//     //   subscription = _BleManager.startDeviceScan(null, null, (error, device) => {
//     //     if (error) {
//     //       console.log("startscanerror: " + error);
//     //       return;
//     //     }

//     //     if (device) {
//     //       setDevices((prevDevices) => {
//     //         if (!prevDevices.find((prevDevice) => prevDevice.id === device.id)) {
//     //           return [...prevDevices, device];
//     //         }
//     //         return prevDevices;
//     //       });
//     //     }
//     //   });
//     // }

//   //   return () => {
//   //     // if (subscription) {
//   //     //   subscription.remove();
//   //     //   _BleManager.stopDeviceScan();
//   //     // }
//   //   };
//   }, [startScanning]);
// render()
//   return (
//     <View>
//       <Text>{text}</Text>
//       {devices.map((device) => (
//         <Text key={device.id}>{device.name || 'Unknown device'}</Text>
//       ))}
//     </View>
//   );
// };

// export default BLEScanner;