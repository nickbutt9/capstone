import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { styles, chartConfig } from '../constants/Styles';
import { LineChart, BarChart } from "react-native-chart-kit";
import { Dimensions, ScrollView, SafeAreaView, Image } from "react-native";
import Colors from '../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';

const CheckmarkCircle = () => {
    return (
        <View style={[styles.container.circlesContainers, {backgroundColor:Colors.grey.text}]}>
            <View style={styles.shape.circles}>
                <FontAwesome name="check" size={25} color='white' />
            </View>
        </View>
    );
};

export {CheckmarkCircle};