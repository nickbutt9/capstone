import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { styles } from '../constants/Styles';
import { Dimensions, ScrollView, SafeAreaView, Image } from "react-native";


export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome John!</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.homeContainer}>
          <Text style={styles.subtitle}>Distal End Pressure</Text>          
      </View>
    </SafeAreaView>
  );
}