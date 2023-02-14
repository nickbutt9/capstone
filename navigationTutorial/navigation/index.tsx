/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import SettingsModal from '../screens/SettingsModal';
import ProfileModal from '../screens/ProfileModal';
import BLEModal from '../screens/BLEModal';
import CalibrateModal from '../screens/CalibrateModal';
import NotFoundScreen from '../screens/NotFoundScreen';
import HomeScreen from '../screens/HomeScreen';
import PressureScreen from '../screens/PressureScreen';
import LogsScreen from '../screens/LogsScreen';
import TestScreen from '../screens/TestScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

import store from '../store/store';
import { Provider } from 'react-redux';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer

      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Settings" component={SettingsModal} />
        <Stack.Screen name="Profile" component={ProfileModal} />
        <Stack.Screen name="BLE" component={BLEModal} />
        <Stack.Screen name="Calibrate" component={CalibrateModal} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }: RootTabScreenProps<'Home'>) => ({
          headerTitle:"",
          headerStyle: {backgroundColor: Colors.grey.text},
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerLeft:() => (
            // <HeaderContents />
            <Pressable onPress={() => navigation.navigate('Profile')} style={({ pressed }) => ({opacity: pressed ? 0.5 : 1,})}>
              <FontAwesome name="user" size={25} color={Colors[colorScheme].text} style={{ marginLeft: 15 }}/>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={() => navigation.navigate('Settings')} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1,})}>
              <FontAwesome name="gear" size={25} color={Colors[colorScheme].text} style={{ marginRight: 15 }}/>
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="Pressure"
        component={PressureScreen}
        options={({ navigation }: RootTabScreenProps<'Pressure'>) => ({
          headerTitle:"",
          // headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
          headerStyle: {backgroundColor: Colors.grey.text},
          headerLeft:() => (
            <Pressable onPress={() => navigation.navigate('Profile')} style={({ pressed }) => ({opacity: pressed ? 0.5 : 1,})}>
              <FontAwesome name="user" size={25} color={Colors[colorScheme].text} style={{ marginLeft: 15 }}/>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={() => navigation.navigate('Settings')} style={({ pressed }) => ({opacity: pressed ? 0.5 : 1,})}> 
              <FontAwesome name="gear" size={25} color={Colors[colorScheme].text} style={{ marginRight: 15 }}/>
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="Logs"
        component={LogsScreen}
        options={({ navigation }: RootTabScreenProps<'Logs'>) => ({
          headerTitle:"",
          headerStyle: {backgroundColor: Colors.grey.text},
          // headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
          headerLeft:() => (
            <Pressable onPress={() => navigation.navigate('Profile')} style={({ pressed }) => ({opacity: pressed ? 0.5 : 1,})}>
              <FontAwesome name="user" size={25} color={Colors[colorScheme].text} style={{ marginLeft: 15 }}/>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={() => navigation.navigate('Settings')} style={({ pressed }) => ({opacity: pressed ? 0.5 : 1,})}>
              <FontAwesome name="gear" size={25} color={Colors[colorScheme].text} style={{ marginRight: 15 }}/>
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="Test"
        component={TestScreen}
        options={({ navigation }: RootTabScreenProps<'Test'>) => ({
          headerTitle:"",
          headerStyle: {backgroundColor: Colors.grey.text},
          // headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="mixcloud" color={color} />,
        })}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
