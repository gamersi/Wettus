import React, { useState } from 'react';
import { StyleSheet, Button } from 'react-native';
import { Text, View, TextInput } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { weatherAPIKey, setWeatherAPIKey, useWeatherContext } from '../weatherapi/weatherUtils';
import { clearAll } from '../weatherapi/storageUtil';

export default function TabFourScreen({ navigation }: RootTabScreenProps<'TabFour'>) {
  const [APIKey, setAPIKey] = useState(weatherAPIKey);
  const { apiKeyCorrect, setAPIKeyCorrect } = useWeatherContext();
  const [checked, setChecked] = useState(false);

  function APIKeyChanged(text: string) {
    setAPIKeyCorrect(true);
    setChecked(false);
    setWeatherAPIKey(text);
    setAPIKey(text);
  }

  function checkAPIKey() {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=Vienna&appid=' + APIKey)
      .then(res => res.json())
      .then(json => {
        if (json.cod == 401) {
          setAPIKeyCorrect(false);
        } else {
          setAPIKeyCorrect(true);
        }
        setChecked(true);
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Einstellungen</Text>
      <TextInput
        style={styles.input} 
        placeholder="OpenWeatherMap API Key"
        onChangeText={text => APIKeyChanged(text)}
        value={APIKey} />
      <Button title="Überprüfen" onPress={() => checkAPIKey()} />
      {checked ? apiKeyCorrect ? (
        <Text style={{color: 'green'}}>API Key ist korrekt</Text>
      ) : (
        <Text style={{color: 'red'}}>API Key ist nicht korrekt</Text>
       ): null}
      <Button
        title="API Key zurücksetzen"
        onPress={() => {APIKeyChanged('changeme');setChecked(true);setAPIKeyCorrect(false);}} />
      <Button
        title="Alle lokalen Daten löschen"
        onPress={() => {clearAll();APIKeyChanged('changeme');setChecked(true);setAPIKeyCorrect(false);}} />
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
