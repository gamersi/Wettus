import React, { useState } from 'react';
import { StyleSheet, Button } from 'react-native';
import { Text, View, TextInput } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { weatherAPIKey, setWeatherAPIKey } from '../weatherapi/weatherUtils';
import { clearAll } from '../weatherapi/storageUtil';

export default function TabFourScreen({ navigation }: RootTabScreenProps<'TabFour'>) {
  const [APIKey, setAPIKey] = useState(weatherAPIKey);
  // when the API key changes, update 'weatherAPIKey' in the weatherUtils.js file

  function APIKeyChanged(text: string) {
    setWeatherAPIKey(text);
    setAPIKey(text);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <TextInput
        style={styles.input} 
        placeholder="OpenWeatherMap API Key"
        onChangeText={text => APIKeyChanged(text)}
        value={APIKey} />
      <Button
        title="Clear API Key"
        onPress={() => APIKeyChanged('changeme')} />
      <Button
        title="Clear local data"
        onPress={() => {clearAll();APIKeyChanged('changeme');}} />
      <Text style={styles.title}>About</Text>
      <Text>Version 1.0</Text>
      <Text>Author: gamersi</Text>
      <Text>License: MIT</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
