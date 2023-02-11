import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { styles } from '../constants/Styles';
import { Dimensions, ScrollView, SafeAreaView, Image, Pressable } from "react-native";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Progress from 'react-native-progress'
import Colors from '../constants/Colors'
import { FontAwesome } from '@expo/vector-icons';

const screenWidth = Dimensions.get("window").width;
const containerWidth = 0.9*screenWidth;

export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
  const deviceConnected = false;
  const calibrated = true;

  let alertView;

  if (deviceConnected) {
    
    alertView = 
      <View style={styles.alertContainer}>
        <FontAwesome name="exclamation-triangle" size={25} color='white' />
        <View style={{width:0.6*containerWidth, backgroundColor: Colors.primary.text}}>
          <Text style={styles.whiteTexts}> Device Not Connected </Text>
        </View>
        {/* <View style={{width:0.4*containerWidth, backgroundColor:Colors.primary.text}}></View> */}
        <Pressable style={({pressed}) => [{backgroundColor: pressed ? Colors.grey.text : 'white'}, styles.alertButton]} onPress={() => console.log('Connect')}>
          <Text style={{fontWeight:'bold'}}>Connect</Text>
        </Pressable>
      </View>
  } else if (calibrated){
    alertView = 
      <View style={styles.alertContainer}>
        <FontAwesome name="exclamation-triangle" size={25} color='white' />
        <View style={{width:0.6*containerWidth, backgroundColor: Colors.primary.text}}>
          <Text style={styles.whiteTexts}> Device Not Calibrated </Text>
        </View>
        {/* <View style={{width:0.4*containerWidth, backgroundColor:Colors.primary.text}}></View> */}
        <Pressable style={({pressed}) => [{backgroundColor: pressed ? Colors.grey.text : 'white'}, styles.alertButton]} onPress={() => console.log('Calibrate')}>
          <Text style={{fontWeight:'bold'}}>Calibrate</Text>
        </Pressable>
      </View>
  };

  return (

    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome John!</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {alertView}
      <View style={styles.homeContainer}>
        <Text style={styles.subtitle}>Distal End Pressure</Text>
          <AnimatedCircularProgress size={200} backgroundWidth={20} width={30} fill={40} tintColor={Colors.primary.text} onAnimationComplete={() => console.log('onAnimationComplete')} arcSweepAngle={200} rotation={260} lineCap='round' backgroundColor={Colors.shading.text} style={styles.gauge}/>
          <Pressable style={({pressed}) => [{backgroundColor: pressed ? Colors.secondary.text : Colors.primary.text}, styles.button]} onPress={() => console.log('Add')}>
            <Text style={styles.whiteTexts}>Add a sock</Text>
          </Pressable>
      </View>
      <View style={styles.homeContainer}>
        <View style={{width:containerWidth, flexDirection:'row', alignItems:'flex-end', borderRadius:10}}>
          <Text style={styles.subtitle}>Device Battery</Text>
          <View style={{width:0.4*containerWidth}}></View>
          <View style={{alignSelf:'center', justifyContent:'flex-end'}}>
            <Text style={styles.labels}>30%</Text> 
          </View>
        </View>
        <View style={{paddingTop:15}}>
          <Progress.Bar color={Colors.primary.text} unfilledColor={Colors.shading.text} progress={0.3} width={containerWidth*0.8}/>
        </View>
      </View>
    </SafeAreaView>
  );
}