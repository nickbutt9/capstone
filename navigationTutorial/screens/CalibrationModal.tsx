import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { styles } from '../constants/Styles';
import { Text, View } from '../components/Themed';
import Colors from '../constants/Colors';
import React, { useState, Component } from 'react'
import { Pressable } from 'native-base';
import { background, color } from 'native-base/lib/typescript/theme/styled-system';
import colors from 'native-base/lib/typescript/theme/base/colors';
import { useIsPressed } from 'native-base/lib/typescript/components/primitives';

export default class CalibrationModal extends Component {

  state = {
    titleText: "Secure Your Prosthetic",
    buttonText: "Prosthetic Secured",
    filler: <View style={{height:250}}/>
  }
  
  onPress = () => {
    if (this.state.titleText === "Secure Your Prosthetic") {
      console.log('Stand Up'),
        this.setState({
          titleText: "Stand Up",
          buttonText: "I am Standing"
        })
    } else if (this.state.titleText === "Stand Up"){
      console.log('Calibrating'),
        this.setState({
          titleText: "Calibrating",
          buttonText: "Please Wait",
          filler: <ActivityIndicator size={250} color={Colors.primary.text} />
        })
    } else if (this.state.titleText === "Calibrating"){
      console.log('Cancel')
      
    }
  }

  render(): React.ReactNode {
    return (
      <View style={[styles.container.plainContainer]}>
        <Text style={styles.text.title}>{this.state.titleText}</Text>
        <View style={styles.seperator.seperator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        {this.state.filler}
        <Pressable style={[{ backgroundColor: Colors.primary.text, marginTop:25}, styles.button.button]} onPress={this.onPress}>
          <Text style={styles.text.whiteTexts}>{this.state.buttonText}</Text>
        </Pressable>
      </View>
    );
  }
}