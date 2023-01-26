import React from 'react';
import { StyleSheet, Text, View, SafeAreaView} from 'react-native';
import {Gauge} from './Gauge.jsx';

export default function App() {

  return (
    <SafeAreaView style={styles.container}>
      <Gauge />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
