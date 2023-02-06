import { StyleSheet, StatusBar, Dimensions } from 'react-native';
import Colors from './Colors'

const screenWidth = Dimensions.get("window").width;
const chartWidth = 0.9*screenWidth;
const chartHeight = 220;
const diameter = chartWidth/4;

const styles = StyleSheet.create({
    scrollContainer: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
    },
    scrollView: {
      backgroundColor: Colors.grey.text,
      // marginHorizontal: 20,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: Colors.grey.text,
    },
    chartsContainer: {
      alignItems: 'center',
      borderRadius:10,
      // backgroundColor: 'white',
      marginHorizontal:(0.025*screenWidth),
      marginBottom:(0.025*screenWidth),
      paddingBottom:15,
    },
    horizontalContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // backgroundColor: 'black',
      margin:10,
    },
    title: {
      fontSize: 30,
      fontWeight: '400',
      alignSelf: 'flex-start',
      justifyContent: 'flex-start',
      paddingLeft: 20,
    },
    subtitle: {
      fontSize: 20,
      color: Colors.primary.text,
      fontWeight: '500',
      alignSelf: 'flex-start',
      justifyContent: 'flex-start',
      paddingLeft: 20,
      paddingTop:10,
      paddingBottom:5,
    },
    texts: {
      fontSize: 12,
      fontWeight: '400',
      alignSelf: 'flex-start',
      justifyContent: 'flex-start',
      paddingLeft: 20,
    },
    labels: {
      fontSize: 14,
      fontWeight: '500',
      marginTop:10
    },
    separator: {
      marginVertical: 20,
      height: 1,
      width: '80%',
      alignSelf:'center'
    },
    circlesContainers: {
      marginHorizontal: 0.03*screenWidth,
      alignItems: 'center',
      // backgroundColor:'black'
    },
    circles: {
      width: diameter,
      height: diameter,
      borderRadius: diameter / 2,
      backgroundColor: Colors.primary.text,
      justifyContent: 'center',
      alignItems:'center'
    },
  });

  const chartConfig = {
    // backgroundGradientFrom: "white",
    // backgroundGradientTo: "white",
    backgroundGradientFromOpacity:0,
    backgroundGradientToOpacity:0,
    fillShadowGradientFromOpacity:0.5,
    fillShadowGradientToOpacity:0.5,
    // color: Colors.secondary.text,
    color: (opacity = 1) => `rgba(62, 96, 193, ${opacity})`,
    barPercentage: 0.75,
    // useShadowColorFromDataset: true // optional
  };
  
  export { styles, chartConfig };