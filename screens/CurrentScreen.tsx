import { StyleSheet, Image, RefreshControl, ActivityIndicator, Button } from 'react-native';
import { useState, useCallback } from 'react';
import { Text, View, ScrollView } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { getCurrentWeather, CurrentWeather, jsonData, dataLoaded, loadWeatherForecast } from '../weatherapi/weatherUtils';
import Card from '../components/Card';
import DetalsScreen from './DetailsScreen';

let currentWeather: CurrentWeather | null = null;

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  let [city, setCity] = useState("City");
  let [description, setDescription] = useState("Beschreibung");
  let [imageuri, setImageuri] = useState("https://openweathermap.org/img/wn/01d@4x.png");
  let [temp, setTemp] = useState("0 °C");
  let [pressure, setPressure] = useState("0hPa");
  let [humidity, setHumidity] = useState("0%");
  let [wind, setWind] = useState("0m/s");
  let [low, setLow] = useState("0 °C");
  let [high, setHigh] = useState("0 °C");
  let [feelsLike, setFeelsLike] = useState("0 °C");
  let [refreshing, setRefreshing] = useState(false);
  let [detailsVisible, setDetailsVisible] = useState(false);
  // forecast
  let [forecast, setForecast]: [any, any] = useState({});


  async function onRefresh() {
    setRefreshing(true);
    await loadWeather();
    setRefreshing(false);
  }

  async function loadWeather() {
    getCurrentWeather().then((data) => {
      try {
        currentWeather = new CurrentWeather(jsonData);
        setCity(currentWeather.getFormattedCity());
        setDescription(currentWeather.getFormattedDescription());
        setImageuri(currentWeather.getFormattedIcon());
        setTemp(currentWeather.getFormattedTemperature());
        setPressure(currentWeather.getFormattedPressure());
        setHumidity(currentWeather.getFormattedHumidity());
        setWind(currentWeather.getFormattedWindSpeed());
        setLow(currentWeather.getFormattedMinTemperature());
        setHigh(currentWeather.getFormattedMaxTemperature());
        setFeelsLike(currentWeather.getFormattedFeelsLike());
      } catch (e) {
        console.log("Error loading weather:", e, jsonData, dataLoaded);
      }
    }).catch((error) => {
      console.log("Error loading weather:", error);
    });

    loadWeatherForecast()
      .then((data) => {
        setForecast(data);
      }).catch((error) => {
        console.log("Error loading forecast:", error);
      }).finally(() => {
        console.log("Forecast loaded", forecast);
      });
  }
  if (currentWeather === null) {
    loadWeather();
  }

  return (
    <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {refreshing ? <ActivityIndicator /> : null}
      <DetalsScreen isVisible={detailsVisible} onClose={() => setDetailsVisible(false)} />
      <Text style={styles.title}>{city}</Text>
      <Text style={styles.date}>{description}</Text>
      <Image style={styles.image} source={{ uri: imageuri }} />
      <Text style={styles.temperature}>{temp}</Text>
      <View style={styles.details} >
        <View style={styles.humidityview} >
          <Text style={styles.humiditytext}>Feuchte</Text>
          <Text style={styles.humidity}>{humidity}</Text>
        </View>
        <View style={styles.windview} >
          <Text style={styles.windtext}>Wind</Text>
          <Text style={styles.wind}>{wind}</Text>
        </View>
        <View style={styles.lowview} >
          <Text style={styles.lowtext}>Tief</Text>
          <Text style={styles.low}>{low}</Text>
        </View>
        <View style={styles.highview} >
          <Text style={styles.hightext}>Hoch</Text>
          <Text style={styles.high}>{high}</Text>
        </View>
        <View style={styles.feelslikeview} >
          <Text style={styles.feelsliketext}>Gefühlt</Text>
          <Text style={styles.feelslike}>{feelsLike}</Text>
        </View>
      </View>
      <View style={styles.today}>
        <Text style={styles.todaytext}>Heute</Text>
        <Button style={styles.showtoday} title="Details" onPress={() => setDetailsVisible(true)} />
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.cardcontainer}>
        {currentWeather === null ? (
          <Card bgcolor="#A7B4E0" fgcolor="#000" disabled={true}>
            <Text style={{color: "#000"}}>Loading...</Text>
          </Card>
        ) : (
          forecast.list?.slice(0, 8).map((item: any, index: number) => {
            return (
              // #A7B4E0 for the first card and #272F3A from the second card onwards
              <Card bgcolor={index === 0 ? "#A7B4E0" : "#A7B4E0"} fgcolor="#000" key={index}>
                <Image style={styles.image} source={{ uri: "http://openweathermap.org/img/wn/" + item.weather[0].icon + "@4x.png" }} />
                <Text style={{color: "#000"}}>{item.weather[0].description}</Text>
                <Text style={{color: "#000"}}>{item.dt_txt}</Text>
                <Text style={{color: "#000"}}>{item.main.temp} °C</Text>
              </Card>
            );
          })
        )}
      </ScrollView>
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
  lowview: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lowtext: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  low: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  highview: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hightext: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  high: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  feelslikeview: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feelsliketext: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  feelslike: {
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
  },
  cardcontainer: {
    flex: 0.5,
    flexDirection: 'row',
  },
});
