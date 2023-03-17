import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NativeBaseProvider } from "native-base";

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { PopupProvider } from 'react-native-popup-view';

import 'expo-dev-client';
import store from './store/store'
import { Provider } from 'react-redux';

import * as Notifications from 'expo-notifications';

export default function App() {
  console.log("App Refreshed")
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <NativeBaseProvider>
          <PopupProvider>
            <SafeAreaProvider >

              <Navigation colorScheme={colorScheme} />
              <StatusBar />
            </SafeAreaProvider>
          </PopupProvider>
        </NativeBaseProvider>
      </Provider>
    );
  }
}