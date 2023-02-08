import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { styles } from '../constants/Styles';
import { Dimensions, ScrollView, SafeAreaView, Image, Pressable } from "react-native";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Progress from 'react-native-progress'
import Colors from '../constants/Colors'

const screenWidth = Dimensions.get("window").width;
const containerWidth = 0.9*screenWidth;

export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
  // const { onPress, title = 'Save' } = props;
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome John!</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.homeContainer}>
        <Text style={styles.subtitle}>Distal End Pressure</Text>
          <AnimatedCircularProgress size={200} backgroundWidth={20} width={30} fill={40} tintColor={Colors.primary.text} onAnimationComplete={() => console.log('onAnimationComplete')} arcSweepAngle={200} rotation={260} lineCap='round' backgroundColor={Colors.shading.text} style={styles.gauge}/>
          <Pressable style={styles.button} onPress={() => console.log('Simple Button pressed')}>
            <Text style={styles.whiteTexts}>{"Add a sock"}</Text>
          </Pressable>
      </View>
      <View style={styles.homeContainer}>
        <View style={{width:containerWidth, flexDirection:'row', alignItems:'flex-end', borderRadius:10}}>
          <Text style={styles.subtitle}>Device Battery</Text>
          <View style={{width:0.7*containerWidth}}></View>
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