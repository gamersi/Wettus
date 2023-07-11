import { StyleSheet, Image, RefreshControl, ActivityIndicator, Button } from 'react-native';
import { useState } from 'react';
import { Text, View, ScrollView } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { getCurrentWeather, CurrentWeather, jsonData, dataLoaded, loadWeatherForecast } from '../weatherapi/weatherUtils';
import Card from '../components/Card';
import DetailsScreen from './DetailsScreen';

let currentWeather: CurrentWeather | null = null;
let baseDate = new Date();

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  let [city, setCity] = useState("City");
  let [description, setDescription] = useState("Beschreibung");
  let [imageuri, setImageuri] = useState("https://openweathermap.org/img/wn/01d@4x.png");
  let [temp, setTemp] = useState("0 °C");
  let [humidity, setHumidity] = useState("0%");
  let [wind, setWind] = useState("0m/s");
  let [low, setLow] = useState("0 °C");
  let [high, setHigh] = useState("0 °C");
  let [feelsLike, setFeelsLike] = useState("0 °C");
  let [refreshing, setRefreshing] = useState(false);
  let [detailsVisible, setDetailsVisible] = useState(false);
  let [detailsData, setDetailsData]: [object, any] = useState({});
  let [isFuture, setIsFuture] = useState(false);
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
        setDetailsData(currentWeather);
        setCity(currentWeather.getFormattedCity());
        setDescription(currentWeather.getFormattedDescription());
        setImageuri(currentWeather.getFormattedIcon());
        setTemp(currentWeather.getFormattedTemperature());
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
        console.log("Forecast loaded");
      });
  }
  if (currentWeather === null) {
    loadWeather();
  }

  function isLastDay(date: Date) {
    return new Date(date.getTime() + 86400000).getDate() === 1; // 86400000 = 24 * 60 * 60 * 1000
  }

  function getTimeDiffString(date: Date) {
    let day1 = baseDate.getDate();
    let month1 = baseDate.getMonth();
    let day2 = date.getDate();
    let month2 = date.getMonth();
    let diff = day2 - day1;
    if (month1 !== month2) {
      if (month2 - month1 === 1) {
        if (day2 === 1 && isLastDay(baseDate)) {
          return "Morgen";
        }
        if (day2 === 2 && isLastDay(baseDate)) {
          return "Übermorgen";
        }
        return "in TBD Tagen";
      }
      return "in TBD Tagen2";
    }
    if (diff === 0) {
      return "Heute";
    }
    if (diff === 1) {
      return "Morgen";
    }
    if (diff === 2) {
      return "Übermorgen";
    }
    return "in " + diff + " Tagen";
  }

  return (
    <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {refreshing ? <ActivityIndicator /> : null}
      <DetailsScreen isVisible={detailsVisible} weatherData={detailsData} isFuture={isFuture} onClose={() => setDetailsVisible(false)} />
      <Text style={styles.title}>{city}</Text>
      <Text style={styles.date}>{description}</Text>
      <Image style={styles.image} source={{ uri: imageuri }} />
      <Text style={styles.temperature}>{temp}</Text>
      <View style={styles.details}>
        <View style={styles.detailsview}>
          <Text style={styles.detailstext}>Wind</Text>
          <Text style={styles.detailsIndividual}>{wind}</Text>
        </View>
        <View style={styles.detailsview}>
          <Text style={styles.detailstext}>Tief</Text>
          <Text style={styles.detailsIndividual}>{low}</Text>
        </View>
        <View style={styles.detailsview}>
          <Text style={styles.detailstext}>Hoch</Text>
          <Text style={styles.detailsIndividual}>{high}</Text>
        </View>
        <View style={styles.detailsview}>
          <Text style={styles.detailstext}>Gefühlt</Text>
          <Text style={styles.detailsIndividual}>{feelsLike}</Text>
        </View>
      </View>
      <View style={styles.today}>
        <Text style={styles.todaytext}>Heute</Text>
        <Button title="Details" onPress={() => { setDetailsVisible(true); setDetailsData(currentWeather); }} />
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.cardcontainer}>
        {currentWeather === null ? (
          <Card bgcolor="#272F3A" fgcolor="#000">
            <Text style={{ color: "#fff" }}>Loading...</Text>
          </Card>
        ) : (
          forecast.list?.slice(0, 8).map((item: any, index: number) => {
            return (
              <Card bgcolor={index === 0 ? "#A7B4E0" : "#272F3A"} style={styles.forecastPeekCard} fgcolor={index === 0 ? "#000" : "#fff"} key={index} onPress={() => { setDetailsVisible(true); setDetailsData(item); setIsFuture(true) }}>
                <Image style={{ width: 60, height: 60 }} source={{ uri: "http://openweathermap.org/img/wn/" + item.weather[0].icon + "@4x.png" }} />
                <Text style={{ color: index == 0 ? "#000" : "#fff" }}>{item.weather[0].description}</Text>
                <Text style={{ color: index == 0 ? "#000" : "#fff" }}>{getTimeDiffString(new Date(item.dt * 1000))}</Text>
                <Text style={{ color: index == 0 ? "#000" : "#fff" }}>{new Date(item.dt * 1000).getHours()} Uhr</Text>
                <Text style={{ color: index == 0 ? "#000" : "#fff" }}>{item.main.temp} °C</Text>
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
  detailsview: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailstext: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  detailsIndividual: {
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
  cardcontainer: {
    flex: 0.5,
    flexDirection: 'row',
  },
  forecastPeekCard: {
    width: 150,
  },
});