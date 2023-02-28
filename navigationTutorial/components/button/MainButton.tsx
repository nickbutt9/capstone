import { Pressable } from "native-base";
import Colors from "../../constants/Colors";
import { styles } from "../../constants/Styles";
import { Text, ViewStyle } from 'react-native';
import { InterfacePressableProps } from "native-base/lib/typescript/components/primitives/Pressable/types";


interface MainButtonProps {
    text: string;
    style?: ViewStyle;
}


const MainButton = (props: MainButtonProps & InterfacePressableProps) => {
    const { text } = props;
    return (
        <Pressable style={[{backgroundColor: Colors.primary.text}, styles.button.button]}>
            <Text style={styles.text.whiteTexts}>
                "{text}"
            </Text>
        </Pressable >
    );
};


export default MainButton;