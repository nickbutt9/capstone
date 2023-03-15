import { styles } from '../constants/Styles';
import { ViewStyle } from "react-native";
import Colors from '../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

interface CheckmarkCircleProps {
    text?: string;
    extraStyle?: ViewStyle;
}

const CheckmarkCircle = (props: CheckmarkCircleProps) => {
    const { text, extraStyle } = props;
    return (
        <View {...props} style={[styles.container.circlesContainers, { backgroundColor: Colors.grey.text }, extraStyle]}>
            <View style={styles.shape.bigCircle}>
                <FontAwesome name="check" size={150} color='white' />
            </View>
        </View>
    );
};

export { CheckmarkCircle }

interface PulsingCircleProps {
    size: number;
    duration: number;
    pulseColor: string;
}

const PulsingCircle: React.FC<PulsingCircleProps> = ({ size, duration, pulseColor }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const pulseAnimation = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
        pulseAnimation.current = Animated.loop(
            Animated.sequence([
                Animated.delay(0),
                Animated.parallel([
                    Animated.timing(scaleAnim, {
                        toValue: 0.75,
                        duration: duration,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityAnim, {
                        toValue: 0,
                        duration: duration,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(scaleAnim, {
                        toValue: 1.25,
                        duration: duration,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityAnim, {
                        toValue: 1,
                        duration: duration,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.sequence([
                    Animated.parallel([
                        Animated.timing(scaleAnim, {
                            toValue: 1,
                            duration: duration,
                            useNativeDriver: true,
                        }),
                        Animated.timing(opacityAnim, {
                            toValue: 0,
                            duration: duration,
                            useNativeDriver: true,
                        }),
                    ]),
                ]),
                Animated.parallel([
                    Animated.timing(scaleAnim, {
                        toValue: 1.25,
                        duration: duration,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityAnim, {
                        toValue: 1,
                        duration: duration,
                        useNativeDriver: true,
                    }),
                ]),
            ]),
            {
                iterations: -1,
            }
        );
        pulseAnimation.current.start();

        return () => {
            pulseAnimation.current?.stop();
        };
    }, [opacityAnim, scaleAnim]);

    const circleStyle = {
        // alignContents: 'center',
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: pulseColor || 'rgba(0, 0, 0, 0.3)',
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }],
    };

    return (
        // <View style={[styles.container.circlesContainers, { backgroundColor: Colors.grey.text }]}>
            <Animated.View style={[circleStyle]}>
                <FontAwesome name="bluetooth-b" size={100} color='white' style={{marginLeft:70, marginTop:50}}/>
            </Animated.View>
        // </View>
    );
};

export default PulsingCircle;