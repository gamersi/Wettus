import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, TextInput } from '../components/Themed';

export default function TabTwoScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  function search(query: string) {
    setQuery(query);
    if (query.length > 2) {
      fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=5&accept-language=de`)
        .then((response) => response.json())
        .then((json) => setResults(json.filter((item: any) => item.type === 'city')))
        .catch((error) => console.error(error))
        .finally(() => console.log('done'));
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
      {results.length > 0 ? (
        results.map((item, index) => (
          <Text key={index}>{item.display_name}</Text>
        ))
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
