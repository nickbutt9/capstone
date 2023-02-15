import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { styles, chartConfig } from '../constants/Styles';
import { LineChart, BarChart } from "react-native-chart-kit";
import { Dimensions, ScrollView, SafeAreaView, Image, ViewStyle, ViewProps } from "react-native";
import Colors from '../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';

interface CheckmarkCircleProps {
    text?: string;
    extraStyle?: ViewStyle;
}

const CheckmarkCircle = (props: CheckmarkCircleProps) => {
    const { text, extraStyle } = props;
    return (
        <View {...props} style={[styles.container.circlesContainers, {backgroundColor:Colors.grey.text}, extraStyle ]}>
            <View style={styles.shape.bigCircle}>
                <FontAwesome name="check" size={150} color='white' />
            </View>
        </View>
    );
};

export {CheckmarkCircle};