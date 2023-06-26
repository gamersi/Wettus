import { StyleSheet, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { useState, useCallback } from 'react';
import { Text, View, ScrollView } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { getCurrentWeather, CurrentWeather, jsonData, dataLoaded, loadWeatherForecast } from '../weatherapi/weatherUtils';
import Card from '../components/Card';

let currentWeather: CurrentWeather | null = null;

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  let [city, setCity] = useState("City");
  let [date, setDate] = useState(new Date().toLocaleString());
  let [imageuri, setImageuri] = useState("https://openweathermap.org/img/wn/01d@4x.png");
  let [temp, setTemp] = useState("0 °C");
  let [pressure, setPressure] = useState("0hPa");
  let [humidity, setHumidity] = useState("0%");
  let [wind, setWind] = useState("0m/s");
  let [refreshing, setRefreshing] = useState(false);
  // forecast
  let [forecast, setForecast]: [any, any] = useState([]);


  async function onRefresh() {
    setRefreshing(true);
    setDate(new Date().toLocaleString());
    await loadWeather();
    setRefreshing(false);
  }0

  async function loadWeather() {
    getCurrentWeather().then((data) => {
      try {
        currentWeather = new CurrentWeather(jsonData);
        setCity(currentWeather.getFormattedCity());
        setDate(currentWeather.getFormattedDate());
        setImageuri(currentWeather.getFormattedIcon());
        setTemp(currentWeather.getFormattedTemperature());
        setPressure(currentWeather.getFormattedPressure());
        setHumidity(currentWeather.getFormattedHumidity());
        setWind(currentWeather.getFormattedWindSpeed());
      } catch (e) {
        console.log("Error loading weather:", e, jsonData, dataLoaded);
      }
    }).catch((error) => {
      console.log("Error loading weather:", error);
    });

    loadWeatherForecast().then((data) => {
      setForecast(data);
    }).catch((error) => {
      console.log("Error loading weather forecast:", error);
    });
  }
  if (currentWeather === null) {
    loadWeather();
  }

  return (
    <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {refreshing ? <ActivityIndicator /> : null}
      <Text style={styles.title}>{city}</Text>
      <Text style={styles.date}>{date}</Text>
      <Image style={styles.image} source={{ uri: imageuri }} />
      <Text style={styles.temperature}>{temp}</Text>
      <View style={styles.details} >
        <View style={styles.pressureview} >
          <Text style={styles.pressuretext}>Druck</Text>
          <Text style={styles.pressure}>{pressure}</Text>
        </View>
        <View style={styles.humidityview} >
          <Text style={styles.humiditytext}>Luftfeuchtigkeit</Text>
          <Text style={styles.humidity}>{humidity}</Text>
        </View>
        <View style={styles.windview} >
          <Text style={styles.windtext}>Wind</Text>
          <Text style={styles.wind}>{wind}</Text>
        </View>
      </View>
      <View style={styles.today}>
        <Text style={styles.todaytext}>Heute</Text>
        <Text style={styles.showtoday}>Bericht anzeigen</Text>
      </View>
      <View style={styles.cardcontainer}>
        {currentWeather === null ? (
          <Card bgcolor="#A7B4E0" fgcolor="#000" disabled={true}>
            <Text style={{color: "#000"}}>Loading...</Text>
          </Card>
        ) : (
          forecast.list.map((item: any, index: number) => {
            return (
              // #A7B4E0 for the first card and #272F3A from the second card onwards
              <Card bgcolor={index === 0 ? "#A7B4E0" : "#272F3A"} fgcolor="#000" key={index}>
                <Text style={{color: "#000"}}>{item.dt_txt}</Text>
                <Text style={{color: "#000"}}>{item.main.temp}</Text>
              </Card>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    paddingTop: 50,
    fontSize: 30,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 15,
    fontWeight: 'normal',
  },
  image: {
    width: 150,
    height: 150,
  },
  temperature: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  details: {
    flex: 0.3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '100%',
  },
  pressureview: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressuretext: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  pressure: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  humidityview: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  humiditytext: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  humidity: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  windview: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  windtext: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  wind: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  today: {
    width: '100%',
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  todaytext: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  showtoday: {
    fontSize: 16,
    fontWeight: 'normal',
    marginLeft: 100,
    color: '#0066ff',
  }
});
