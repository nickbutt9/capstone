import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { styles } from '../constants/Styles';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import Colors from '../constants/Colors';

export default function CalibrateModal() {
  return (
    <View style={styles.container.plainContainer}>
      <Text style={styles.text.title}>Calibrate</Text>
      <View style={styles.seperator.seperator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={[styles.container.plainContainer,]}>
        <ActivityIndicator size={100} color={Colors.primary.text}/>
    </View>
      {/* <EditScreenInfo path="/screens/SettingsModal.tsx" /> */}

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}