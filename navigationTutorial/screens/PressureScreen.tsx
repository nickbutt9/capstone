import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { styles, chartConfig } from '../constants/Styles';
import { LineChart, BarChart } from "react-native-chart-kit";
import { Dimensions, ScrollView, SafeAreaView, Image } from "react-native";
import Colors from '../constants/Colors';

const screenWidth = Dimensions.get("window").width;
const chartWidth = 0.9*screenWidth;
const chartHeight = 200;

export default function PressureScreen() {
  return (
    <SafeAreaView style={styles.scrollContainer}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Today's Data</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <View style={styles.chartsContainer}>
          <Text style={styles.subtitle}>Pressure</Text>
          <Text style={styles.texts}>Today</Text>
          <LineChart data={lineData} width={chartWidth} height={chartHeight} chartConfig={chartConfig} bezier verticalLabelRotation={0} fromZero withHorizontalLines={false} withVerticalLines={false}/>
        </View>
        <View style={styles.chartsContainer}>
          <Text style={styles.subtitle}>Steps Walked</Text>
          <BarChart data={stepsData} width={chartWidth} height={chartHeight} withInnerLines={false} yAxisSuffix="" yAxisLabel="" chartConfig={chartConfig} verticalLabelRotation={0} showValuesOnTopOfBars fromZero withHorizontalLabels={false} style={{marginLeft: -60}}/>
        </View>
        <View style={styles.chartsContainer}>
          <Text style={styles.subtitle}>Today's Activities</Text>
          <View style={styles.horizontalContainer}>
            <View style={styles.circlesContainers}>
              <View style={styles.circles}>
                <Text style={{color: 'white', letterSpacing:1}}>3.0 hrs</Text>
              </View>
              <Text style={styles.labels}>Stand</Text>
            </View>
            <View style={styles.circlesContainers}>
              <View style={styles.circles}>
                <Text style={{color: 'white', letterSpacing:1}}>4.3 hrs</Text>
              </View>
              <Text style={styles.labels}>Sit</Text>
            </View>
            <View style={styles.circlesContainers}>
              <View style={styles.circles}>
                <Text style={{color: 'white', letterSpacing:1}}>2.1 hrs</Text>
              </View>
              <Text style={styles.labels}>Walk</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const stepsData = {
  labels: ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"],
  datasets: [
    {
      data: [512, 240, 480, 360, 440, 640, 230],
    }
  ]
};

const lineData = {
  labels: ["12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43, 54, 30, 67, 97],
      // color: (opacity = 1) => `rgba(57, 99, 220, ${opacity})`, // optional
      strokeWidth: 2 // optional
    }
  ],
};