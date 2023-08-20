import React, { useState } from 'react';
import { Image, Modal, StyleSheet } from 'react-native';
import { Text, View, TextInput } from '../components/Themed';
import Card from '../components/Card';
import { getWeatherAPIKey, useWeatherContext } from '../weatherapi/weatherUtils';

export default function TabTwoScreen() {
  const [query, setQuery] = useState('');
  const [result, setResult]: [any, any] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const { apiKeyCorrect, setAPIKeyCorrect } = useWeatherContext();
  function search(query: string) {
    setQuery(query);
    if (query.length > 2) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${getWeatherAPIKey()}&units=metric&lang=de`)
        .then(res => res.json())
        .then(json => {
          if (json.cod == 200) setResult(json);
        });
    }
  }

  return (
    <>
      {!apiKeyCorrect ? <Text style={styles.error}>Der angegebene API-Key ist ungültig. Bitte überprüfe die Einstellungen</Text> : (
        <View style={styles.container}>
          <Modal visible={detailsVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setDetailsVisible(false)} onDismiss={() => setDetailsVisible(false)}>
            <View style={styles.container}>
              <Text style={styles.title}>Wetter in {result?.name}</Text>
              {result?.weather && result?.weather[0] && result?.weather[0].icon && (
                <Image
                  style={{ width: 100, height: 100 }}
                  source={{ uri: `https://openweathermap.org/img/wn/${result?.weather[0].icon}@4x.png` }}
                />)}
              <Text>{result?.weather[0].description}</Text>
              <Text>{result?.main.temp} °C</Text>
              <Text>Tief: {result?.main.temp_min} °C</Text>
              <Text>Hoch: {result?.main.temp_max} °C</Text>
              <Text>Gefühlt: {result?.main.feels_like} °C</Text>
              <Text>Luftfeuchtigkeit: {result?.main.humidity} %</Text>
              <Text>Luftdruck: {result?.main.pressure} hPa</Text>
              <Text>Windgeschwindigkeit: {result?.wind.speed} m/s</Text>
              <Text>Windrichtung: {result?.wind.deg} °</Text>
              <Text>Bewölkung: {result?.clouds.all} %</Text>
              <Text>Sonnenaufgang: {new Date(result?.sys.sunrise * 1000).toLocaleTimeString()}</Text>
              <Text>Sonnenuntergang: {new Date(result?.sys.sunset * 1000).toLocaleTimeString()}</Text>
              <Card
                bgcolor='#2C303F'
                fgcolor='#fff'
                style={{ width: '50%', textAlign: 'center', alignItems: 'center' }}
                onPress={() => setDetailsVisible(false)}
              >
                <Text style={{ color: '#fff' }}>Schließen</Text>
              </Card>
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
              style={{ width: '50%', textAlign: 'center', alignItems: 'center' }}
              onPress={() => setDetailsVisible(true)}
            >
              <Image source={{ uri: `https://openweathermap.org/img/wn/${result.weather != null ? result.weather[0].icon : "01d"}@4x.png` }} style={{ width: 100, height: 100 }} />
              <Text>{result.name}</Text>
              <Text>{result.weather != null ? result.weather[0].description : "nein"}</Text>
              <Text>{result.main != null ? result.main.temp : "nein"} °C</Text>
            </Card>
          ) : (
            <Text>Keine Ergebnisse</Text>
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  error: {
    color: 'red',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 50,
  },
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
