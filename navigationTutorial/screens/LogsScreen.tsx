import { Text, View } from '../components/Themed';
import { styles } from '../constants/Styles';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { Dimensions, ScrollView, SafeAreaView, Image } from "react-native";
import Colors from '../constants/Colors'
import { FontAwesome } from '@expo/vector-icons';


export default function LogsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Logs</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.calendarContainer}>
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
          }}>

        </Calendar>
      </View>
    </SafeAreaView >
  );
}