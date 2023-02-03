import { StyleSheet, StatusBar, Dimensions } from 'react-native';
import Colors from './Colors'

const screenWidth = Dimensions.get("window").width;
const chartWidth = 0.9*screenWidth;
const chartHeight = 200;

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
      // backgroundColor: 'white',
      marginTop:10,
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
      width: 150,
      marginHorizontal: 30,
      alignItems: 'center',
    },
    circles: {
      width: 100,
      height: 100,
      borderRadius: 100 / 2,
      backgroundColor: Colors.primary.text,
      textAlign:'center',
      justifyContent: 'center',
    },
  });

  const chartConfig = {
    backgroundGradientFrom: "white",
    backgroundGradientTo: "white",
    fillShadowGradientFromOpacity:0.5,
    fillShadowGradientToOpacity:0.5,
    // color: Colors.secondary.text,
    color: (opacity = 1) => `rgba(62, 96, 193, ${opacity})`,
    barPercentage: 1,
    // useShadowColorFromDataset: true // optional
  };
  
  export { styles, chartConfig };