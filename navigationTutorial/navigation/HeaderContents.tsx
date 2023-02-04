import { FontAwesome } from "@expo/vector-icons";
import * as React from "react";
import { ColorSchemeName, Pressable } from "react-native";
import Colors from "../constants/Colors";
import { RootTabScreenProps } from "../types";
import useColorScheme from '../hooks/useColorScheme';

const colorScheme = useColorScheme();


export default function HeaderContents(){
  return (
    <Pressable
      onPress={() => navigation.navigate("Profile")}
      style={({ pressed }) => ({
        opacity: pressed ? 0.5 : 1,
      })}
    >
      <FontAwesome
        name="user"
        size={25}
        color={Colors[colorScheme].text}
        style={{ marginLeft: 15 }}
      />
    </Pressable>
  );
}
