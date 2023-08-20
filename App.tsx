import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import * as Location from 'expo-location';
import { useState } from 'react';
import { WeatherProvider } from './weatherapi/weatherUtils';
import { Text, View } from './components/Themed';
import { Button } from 'react-native';
import * as Linking from 'expo-linking';
import * as Updates from "expo-updates"

export default function App() {
  const colorScheme = useColorScheme();

  const [locationGranted, setLocationGranted] = useState(true);
  Location.requestForegroundPermissionsAsync().then((permission) => {
    setLocationGranted(permission.granted);
    // console.log("Permission granted:", permission.granted)
  }).catch((error) => {
    console.log("Error getting location permission:", error);
  });

  return (
    <SafeAreaProvider>
      <WeatherProvider>
        {!locationGranted ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", }}>
            <Text style={{ color: "red", fontSize: 30, fontWeight: "bold", textAlign: "center" }}>Bitte erlaube den Zugriff auf deinen Standort in den Einstellungen und klicke danach auf App neu starten!</Text>
            <Button title="Einstellungen öffnen" onPress={() => { Linking.openSettings() }} />
            <Button title="App neu starten" onPress={() => { Updates.reloadAsync() }} />
          </View>
        ) : (
          <>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </>
        )}
      </WeatherProvider>
    </SafeAreaProvider>
  );
}
