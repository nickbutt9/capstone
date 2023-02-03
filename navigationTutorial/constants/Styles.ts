import { StyleSheet, StatusBar, Dimensions } from 'react-native';

const screenWidth = Dimensions.get("window").width;
const chartWidth = 0.9*screenWidth;
const chartHeight = 200;

const styles = StyleSheet.create({
    scrollContainer: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
    },
    scrollView: {
      backgroundColor: '#f3f3f3',
      // marginHorizontal: 20,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor:'#f3f3f3'
    },
    chartsContainer: {
      flex: 1,
      alignItems: 'center',
      borderRadius: 10,
      backgroundColor: '#fff',
      margin:(0.025*screenWidth),
      paddingBottom:15,
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
      color: '#3963DC',
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
    separator: {
      marginVertical: 20,
      height: 1,
      width: '80%',
      alignSelf:'center'
    },
  });

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    // backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#fff",
    // backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(62, 96, 193, ${opacity})`,
    barPercentage: 0.5,
    // useShadowColorFromDataset: false // optional
  };
  
  export { styles, chartConfig };