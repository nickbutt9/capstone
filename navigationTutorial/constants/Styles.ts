import { StyleSheet, Dimensions } from 'react-native';
import Colors from './Colors'

export const screenWidth = Dimensions.get("window").width;
const contentWidth = 0.9*screenWidth;
const chartHeight = 220;
const diameter = contentWidth/4;

export const containerStyles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: Colors.grey.text,
    // marginHorizontal: 10,
  },
  plainContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.grey.text,
  },
  chartsContainer: {
    alignSelf:'center',
    alignItems: 'center',
    borderRadius:10,
    width:0.975*contentWidth,
    // marginHorizontal:(0.05*screenWidth),
    marginBottom:(0.025*screenWidth),
    paddingBottom:15,
  },
  homeContainer: {
    alignItems: 'center',
    width: contentWidth,
    borderRadius: 10,
    // marginHorizontal:(0.025*screenWidth),
    marginBottom:(0.025*screenWidth),
    backgroundColor:'white',
    paddingBottom:15,
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems:'center',
    width: contentWidth,
    borderRadius: 10,
    // marginHorizontal:(0.025*screenWidth),
    marginBottom:(0.025*screenWidth),
    backgroundColor: Colors.primary.text,
    padding:15,
  },
  calendarContainer: {
    width: contentWidth,
    borderRadius: 10,
    // marginHorizontal:(0.025*screenWidth),
    marginBottom:(0.025*screenWidth),
    padding:15,
    // backgroundColor:'white'
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin:10,
  },
  circlesContainers: {
    marginHorizontal: 0.02*screenWidth,
    alignItems: 'center',
    // backgroundColor:'black'
  },
})

export const seperatorStyles = StyleSheet.create({
  seperator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
    alignSelf:'center'
  },
  spacedBetween: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

export const shapeStyles = StyleSheet.create({
  circles: {
    width: diameter,
    height: diameter,
    borderRadius: diameter / 2,
    backgroundColor: Colors.primary.text,
    justifyContent: 'center',
    alignItems:'center'
  },
  gauge: {
    marginBottom:-50,
  },
})

export const buttonStyles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    width:0.4*contentWidth,
    elevation: 10,
  },
  alertButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
    // justifyContent: 'center',
    // alignContent:'center',
    textAlign:"center",
    borderRadius: 10,
    // width:0.5*contentWidth,
    elevation: 10,
    height: 35,
  },
})

export const textStyles = StyleSheet.create({
    
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
    plain: {
      fontSize: 12,
      fontWeight: '400',
      alignSelf: 'flex-start',
      justifyContent: 'flex-start',
      paddingLeft: 20,
    },
    whiteTexts: {
      fontSize: 16,
      fontWeight: 'bold',
      // alignSelf: 'flex-start',
      // justifyContent: 'flex-start',
      // paddingLeft: 20,
      color:'white',
      letterSpacing:1,
    },
    labels: {
      fontSize: 14,
      fontWeight: '500',
      marginTop:10
    },
    emptyText: {
      marginVertical: 15,
      color: 'grey',
      fontWeight: 'bold'
    },
  });

export const toastStyles = {
  default: {
      width: screenWidth / 1.2,
      duration: 3000,
      bottom: -20,
  },
};

export const cardStyles = StyleSheet.create({
  shadow: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      width: '70%',
      borderRadius: 15,
      shadowColor: 'grey',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 8,
      paddingLeft: 14,
      paddingRight: 14,
      marginTop: 6,
      marginBottom: 6,
      marginLeft: 16,
      marginRight: 16,
  }
});

export const chartConfig = {
  backgroundGradientFromOpacity:0,
  backgroundGradientToOpacity:0,
  fillShadowGradientFromOpacity:0.5,
  fillShadowGradientToOpacity:0.5,
  // color: Colors.secondary.text,
  color: (opacity = 1) => `rgba(62, 96, 193, ${opacity})`,
  barPercentage: 0.75,
};

export const divStyles = StyleSheet.create({
  centered: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
  },
  row: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      flexDirection: 'row'
  }
});
  
export const styles = {
    container: {
      ...containerStyles,
    },
    seperator: {
      ...seperatorStyles,
    },
    button: {
      ...buttonStyles,
    },
    text: {
      ...textStyles,
    },
    shape: {
      ...shapeStyles,
    },
    toast: {
      ...toastStyles,
    },
    card: {
      ...cardStyles,
    },
    div: {
      ...divStyles,
    }
};