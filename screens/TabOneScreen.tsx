import { StyleSheet, Image } from 'react-native';
import { useState } from 'react';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { getCurrentWeather, CurrentWeather, jsonData, dataLoaded } from '../weatherapi/weatherUtils';
let currentWeather: CurrentWeather | null = null;

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  let [city, setCity] = useState("n/a");
  let [date, setDate] = useState("n/a");
  let [imageuri, setImageuri] = useState("https://openweathermap.org/img/wn/01d.png");
  let [temp, setTemp] = useState("n/a");
  let [pressure, setPressure] = useState("n/a");
  let [humidity, setHumidity] = useState("n/a");
  let [wind, setWind] = useState("n/a");

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
  }
  if (currentWeather === null) loadWeather();

  return (
    <View style={styles.container}>
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
    </View>
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
  //todaytext completely left and showtoday completely right
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
});
