import { Text, View } from '../components/Themed';
import { styles } from '../constants/Styles';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from "react-native";
import Colors from '../constants/Colors'
import { FontAwesome } from '@expo/vector-icons';


export default function LogsScreen() {
  return (
    <SafeAreaView style={styles.container.plainContainer}>
      <Text style={styles.text.title}>Logs</Text>
      <View style={styles.seperator.seperator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.container.calendarContainer}>
        <Calendar
          renderArrow={
            (direction) => {
              if (direction == 'left') return (<FontAwesome name="chevron-left" size={20} color={Colors.primary.text} />);
              else return (<FontAwesome name="chevron-right" size={20} color={Colors.primary.text} />);
              }
            }
          theme={{ arrowColor: Colors.primary.text, arrowWidth: 5, disabledArrowColor: 'black' }}
          onPressArrowLeft={(subtractMonth: () => any) => subtractMonth()}
          onPressArrowRight={(addMonth: () => any) => addMonth()}
          onDayPress={(day: any) => {
            console.log('selected day', day);
          }}/>
      </View>
    </SafeAreaView >
  );
}