import { StyleSheet, Image, RefreshControl, ActivityIndicator, Button } from 'react-native';
import { useState, useEffect } from 'react';
import { Text, View, ScrollView } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { getCurrentWeather, CurrentWeather, jsonData, dataLoaded, loadWeatherForecast, useWeatherContext, weatherAPIKey } from '../weatherapi/weatherUtils';
import Card from '../components/Card';
import DetailsScreen from './DetailsScreen';

let currentWeather: CurrentWeather | null = null;
let baseDate = new Date();

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [city, setCity] = useState("City");
  const [description, setDescription] = useState("Beschreibung");
  const [imageuri, setImageuri] = useState("https://openweathermap.org/img/wn/01d@4x.png");
  const [temp, setTemp] = useState("0 °C");
  // const [humidity, setHumidity] = useState("0%");
  const [wind, setWind] = useState("0m/s");
  const [low, setLow] = useState("0 °C");
  const [high, setHigh] = useState("0 °C");
  const [feelsLike, setFeelsLike] = useState("0 °C");
  const [refreshing, setRefreshing] = useState(true);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [detailsData, setDetailsData]: [object, any] = useState({});
  const [isFuture, setIsFuture] = useState(false);
  // forecast
  const [forecast, setForecast]: [any, any] = useState({});

  const { apiKeyCorrect, setAPIKeyCorrect } = useWeatherContext();


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
        // setHumidity(currentWeather.getFormattedHumidity());
        setWind(currentWeather.getFormattedWindSpeed());
        setLow(currentWeather.getFormattedMinTemperature());
        setHigh(currentWeather.getFormattedMaxTemperature());
        setFeelsLike(currentWeather.getFormattedFeelsLike());
      } catch (e) {
        console.log("Error init. weather:", e, jsonData, dataLoaded);
        // @ts-ignore import von js
        if (jsonData.cod == "401") {
          setAPIKeyCorrect(false);
        }
      }
    }).catch((error) => {
      console.log("Error loading weather:", error);
    });

    loadWeatherForecast()
      .then((data) => {
        if (data.cod == "401") {
          setAPIKeyCorrect(false);
        }
        setForecast(data);
      }).catch((error) => {
        console.log("Error loading forecast:", error);
      }).finally(() => {
        setRefreshing(false);
        // console.log("Forecast loaded", forecast);
      });
  }
  if (currentWeather === null && apiKeyCorrect) {
    loadWeather();
  }

  // check api key on startup
  useEffect(() => {
    if (!apiKeyCorrect && weatherAPIKey !== "" && weatherAPIKey !== "changeme" && weatherAPIKey !== "n/a") {
      setAPIKeyCorrect(true);
      loadWeather();
    }
  }, []);

  function getTimeDiffString(date: Date, baseDate: Date = new Date()) {
    const day1 = baseDate.getDate();
    const month1 = baseDate.getMonth();
    const day2 = date.getDate();
    const month2 = date.getMonth();
    const diff = day2 - day1;
  
    if (month1 !== month2) {
      if (month2 - month1 === 1) {
        if (day2 === 1 && isLastDay(baseDate)) {
          return "Morgen";
        }
        if (day2 === 2 && isLastDay(baseDate)) {
          return "Übermorgen";
        }
        return `in ${daysInMonth(baseDate) - day1 + day2} Tagen`;
      }
      return `in ${daysInMonth(baseDate) - day1 + day2} Tagen`;
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
    return `in ${diff} Tagen`;
  }

  function isLastDay(date: Date) {
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    return date.getDate() === lastDayOfMonth;
  }
  
  function daysInMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  return (
    <>
    {!apiKeyCorrect ? <Text style={styles.error}>Der angegebene API-Key ist ungültig. Bitte überprüfe die Einstellungen</Text> : (
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
        <Button title="Details" onPress={() => { setDetailsVisible(true); setDetailsData(currentWeather); setIsFuture(false); }} />
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.cardcontainer}>
        {currentWeather === null ? (
          <Card bgcolor="#272F3A" fgcolor="#000">
            <Text style={{ color: "#fff" }}>Loading...</Text>
          </Card>
        ) : (
          forecast.list?.slice(0, 9).map((item: any, index: number) => {
            return (
              <Card bgcolor={index === 0 ? "#A7B4E0" : "#272F3A"} style={styles.forecastPeekCard} fgcolor={index === 0 ? "#000" : "#fff"} key={index} onPress={() => { setDetailsVisible(true); setDetailsData(item); setIsFuture(true) }}>
                <Image style={{ width: 60, height: 60 }} source={{ uri: "http://openweathermap.org/img/wn/" + item.weather[0].icon + "@4x.png" }} />
                <Text style={{ color: index == 0 ? "#000" : "#fff" }}>{item.weather[0].description}</Text>
                <Text style={{ color: index == 0 ? "#000" : "#fff" }}>{getTimeDiffString(new Date(item.dt * 1000))}</Text>
                <Text style={{ color: index == 0 ? "#000" : "#fff" }}>{new Date(item.dt * 1000).getHours()} Uhr</Text>
                <Text style={{ color: index == 0 ? "#000" : "#fff" }}>{Math.round(item.main.temp)} °C</Text>
              </Card>
            );
          })
        )}
      </ScrollView>
    </ScrollView>
    )}
    </>
  );
}

const styles = StyleSheet.create({
  error: {
    color: "red",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 50,
  },
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