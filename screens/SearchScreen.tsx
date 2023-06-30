import React, { useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Text, View, TextInput } from '../components/Themed';
import Card from '../components/Card';
import { getWeatherAPIKey } from '../weatherapi/weatherUtils';

export default function TabTwoScreen() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);

  function search(query: string) {
    setQuery(query);
    if (query.length > 2) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${getWeatherAPIKey()}&units=metric&lang=de`)
        .then(res => res.json())
        .then(json => {
          setResult(json);
        });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Standort wählen</Text>
      <TextInput
        style={styles.input}
        placeholder="Suche"
        onChangeText={text => search(text)}
        value={query} />
      <Text style={styles.title}>Suchergebnisse</Text>
      {result != null ? (
          <Card
            bgcolor='#2C303F'
            fgcolor='#fff'
            style={{ width: '50%' }}
          >
            <Image source={{ uri: `https://openweathermap.org/img/wn/${result.weather[0].icon}@4x.png` }} />
            <Text>{result.name}</Text>
            <Text>{result.weather[0].description}</Text>
            <Text>{result.main.temp} °C</Text>
          </Card>
      ) : (
        <Text>Keine Ergebnisse</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '500',
    paddingTop: 50,
    paddingBottom: 50,
  },
  input: {
    backgroundColor: '#2C303F',
    borderRadius: 20,
    width: '80%',
    height: 50,
    padding: 10,
    margin: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
