import React, { useState } from 'react';
import { Image, Modal, StyleSheet } from 'react-native';
import { Text, View, TextInput } from '../components/Themed';
import Card from '../components/Card';
import { getWeatherAPIKey } from '../weatherapi/weatherUtils';

export default function TabTwoScreen() {
  const [query, setQuery] = useState('');
  const [result, setResult]: [any, any] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
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
      <Modal visible={detailsVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setDetailsVisible(false)} onDismiss={() => setDetailsVisible(false)}>
        <View style={styles.container}>
          <Text style={styles.title}>Wetter in {result?.name}</Text>
          <Text>Details</Text>
        </View>
      </Modal>
      <Text style={styles.title}>Standort wählen</Text>
      <TextInput
        style={styles.input}
        placeholder="Suche"
        onChangeText={text => search(text)}
        value={query} />
      <Text style={styles.title}>Suchergebnisse</Text>
      {result != null && result.cod == "200" ? (
          <Card
            bgcolor='#2C303F'
            fgcolor='#fff'
            style={{ width: '50%', textAlign: 'center', alignItems: 'center'}}
            onPress={() => setDetailsVisible(true)}
          >
            <Image source={{ uri: `https://openweathermap.org/img/wn/${result.weather != null ? result.weather[0].icon : "01d"}@4x.png`}} style={{width: 100,height: 100}} />
            <Text>{result.name}</Text>
            <Text>{result.weather != null ? result.weather[0].description : "nein"}</Text>
            <Text>{result.main != null ? result.main.temp : "nein"} °C</Text>
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
  }
});
