import React from "react";

import {
  Canvas,
  Circle,
  Image,
  ImageSVG,
  useClockValue,
  useComputedValue,
  useImage,
  useSVG,
} from "@shopify/react-native-skia";
import { View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../constants/Colors";

export const PulseIndicator = () => {
  const clock1 = useClockValue();
  const expo = useImage(require("../assets/images/icon.png"));
  const heart = useImage(require("../assets/images/splash.png"));
  const bluetooth = useImage(require("../assets/images/bluetooth.png"))

  const interval = 1250;

  const scale = useComputedValue(() => {
    return ((clock1.current % interval) / interval) * 130;
  }, [clock1]);

  const opacity = useComputedValue(() => {
    return 0.9 - (clock1.current % interval) / interval;
  }, [clock1]);

  const scale2 = useComputedValue(() => {
    return (((clock1.current + 400) % interval) / interval) * 130;
  }, [clock1]);

  const opacity2 = useComputedValue(() => {
    return 0.9 - ((clock1.current + 400) % interval) / interval;
  }, [clock1]);

  if (!bluetooth || !heart) {
    return <View />;
  }

  return (
    <Canvas style={{ height: 250, width: 300 }}>
      <Circle cx={150} cy={125} r={50} opacity={1} color={Colors.primary.text}></Circle>
      <Circle cx={150} cy={125} r={scale} opacity={opacity} color={Colors.primary.text} />
      <Circle cx={150} cy={125} r={scale2} opacity={opacity2} color={Colors.primary.text} />
      {/* <FontAwesome name="bluetooth-b" size={75} color='white' style={{ marginLeft: 70, marginTop: 50 }} /> */}
      <Image
        image={bluetooth}
        fit="contain"
        x={125}
        y={100}
        width={50}
        height={50}
      />
    </Canvas>
  );
};