import React, { useState } from 'react';
import { StyleSheet, Button } from 'react-native';
import { Text, View, TextInput } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { weatherAPIKey, setWeatherAPIKey } from '../weatherapi/weatherUtils';
import { clearAll } from '../weatherapi/storageUtil';

export default function TabFourScreen({ navigation }: RootTabScreenProps<'TabFour'>) {
  const [APIKey, setAPIKey] = useState(weatherAPIKey);

  function APIKeyChanged(text: string) {
    setWeatherAPIKey(text);
    setAPIKey(text);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Einstellungen</Text>
      <TextInput
        style={styles.input} 
        placeholder="OpenWeatherMap API Key"
        onChangeText={text => APIKeyChanged(text)}
        value={APIKey} />
      <Button
        title="API Key zurücksetzen"
        onPress={() => APIKeyChanged('changeme')} />
      <Button
        title="Alle lokalen Daten löschen"
        onPress={() => {clearAll();APIKeyChanged('changeme');}} />
      <Text style={styles.title}>Über</Text>
      <Text>Version 0.1</Text>
      <Text>Autor: Simon Rechberger(gamersi)</Text>
      <Text>Datenquelle: OpenWeatherMap</Text>
      <Text>Icons: FontAwesome</Text>
      <Text>Framework: React Native, Expo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
});
