import { StyleSheet, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { ScrollView, Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { loadWeatherForecast, useWeatherContext } from '../weatherapi/weatherUtils';
import Card from '../components/Card';
import DetailsScreen from './DetailsScreen';

export default function TabThreeScreen({ navigation }: RootTabScreenProps<'TabThree'>) {
  let [forecast, setForecast]: [any, any] = useState({});
  let [detailsVisible, setDetailsVisible] = useState(false);
  let [detailsData, setDetailsData]: [any, any] = useState({});
  let [isFuture, setIsFuture] = useState(false);
  const { apiKeyCorrect, setAPIKeyCorrect } = useWeatherContext();

  const getDay = (date: Date) => {
    const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    return days[date.getDay()];
  };

  useEffect(() => {
    if (forecast.list === undefined) {
      loadWeatherForecast()
        .then((data) => {
          setForecast(data);
        }).catch((error) => {
          console.log("Error loading forecast:", error);
        }).finally(() => {
          // console.log("Forecast(fp) loaded");
        });
    }
  }, [forecast]);

  return (
    <>
      {!apiKeyCorrect ? <Text style={styles.error}>Der angegebene API-Key ist ungültig. Bitte überprüfe die Einstellungen</Text> : (
        <View style={styles.container}>
          <DetailsScreen isVisible={detailsVisible} weatherData={detailsData} isFuture={isFuture} onClose={() => { setDetailsVisible(false); }} />
          <Text style={styles.title}>Wettervorhersage</Text>
          <Text style={styles.subtitle}>5 Tage / 3 Stunden - {forecast.city?.name}</Text>
          <ScrollView style={styles.forecastContainer}>
            {forecast.list?.map((item: any, index: number) => {
              return (
                <Card key={index} bgcolor={index === 0 ? "#A7B4E0" : "#272F3A"} fgcolor={index === 0 ? "#000" : "#fff"} style={styles.forecastItem} onPress={() => { setIsFuture(true); setDetailsVisible(true); setDetailsData(item); }}>
                  <View style={{ flexDirection: 'column', backgroundColor: 'transparent' }}>
                    <Text style={{ fontSize: 20 }}>{new Date(item.dt * 1000).getHours()} Uhr</Text>
                    <Text style={{ fontSize: 15 }}>{getDay(new Date(item.dt * 1000))}</Text>
                    <Text style={{ fontSize: 15 }}>{new Date(item.dt * 1000).toLocaleDateString()}</Text>
                  </View>
                  <Text style={{ fontSize: 25 }}>{Math.round(item.main.temp)} °C</Text>
                  <Image style={{ width: 80, height: 80 }} source={{ uri: "https://openweathermap.org/img/wn/" + item.weather[0].icon + "@4x.png" }} />
                </Card>
              );
            })}
          </ScrollView>
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
    width: '100%',
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 'normal',
  },
  forecastContainer: {
    width: '100%',
    flex: 1,
    borderRadius: 10,
  },
  forecastItem: {
    width: '100%',
    marginLeft: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
