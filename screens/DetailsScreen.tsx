import { Modal, StyleSheet, Image } from 'react-native';

import { Text, View } from '../components/Themed';
import Card from '../components/Card';

export default function DetailsScreen({ isVisible, weatherData, isFuture, onClose }: { isVisible: boolean, weatherData: any, isFuture: boolean, onClose: any }) {
    return (
        <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose} onDismiss={onClose}>
            <View style={styles.container}>
                <Text style={styles.title}>Wetter</Text>
                {!isFuture && <Text style={styles.subtitle}>{weatherData?.city}</Text>}
                {!isFuture && <Text style={styles.subtitle}>{weatherData?.country}</Text>}
                <Image style={styles.image} source={{ uri: `https://openweathermap.org/img/wn/${(isFuture ? weatherData?.weather[0].icon : weatherData?.icon)}@4x.png` }} />
                <Text>{isFuture ? new Date(weatherData?.dt * 1000).toLocaleString(): "Jetzt"}</Text>
                <Text>{isFuture ? weatherData?.weather[0].description : weatherData?.description}</Text>
                <Text>{isFuture ? weatherData?.main.temp : weatherData?.temperature} °C</Text>
                <Text>Tief: {isFuture ? weatherData?.main.temp_min : weatherData?.minTemperature} °C</Text>
                <Text>Hoch: {isFuture ? weatherData?.main.temp_max : weatherData?.maxTemperature} °C </Text>
                <Text>Gefühlt: {isFuture ? weatherData?.main.feels_like : weatherData?.feelsLike} °C gefühlt</Text>
                <Text>Luftfeuchtigkeit: {isFuture ? weatherData?.main.humidity : weatherData?.humidity} %</Text>
                <Text>Luftdruck: {isFuture ? weatherData?.main.pressure : weatherData?.pressure} hPa</Text>
                <Text>Windgeschwindigkeit: {isFuture ? weatherData?.wind.speed : weatherData?.windSpeed} m/s</Text>
                <Text>Windrichtung: {isFuture ? weatherData?.wind.deg : weatherData?.windDirection} °</Text>
                <Text>Bewölkung: {isFuture ? weatherData?.clouds.all : weatherData?.cloudiness} %</Text>
                {isFuture && <Text>Sichtweite: {weatherData?.visibility} m</Text>}
                {!isFuture && <Text>Sonnenaufgang: {new Date(weatherData?.sunrise * 1000).toLocaleString()}</Text>}
                {!isFuture && <Text>Sonnenuntergang: {new Date(weatherData?.sunset * 1000).toLocaleString()}</Text>}

                <Card
                bgcolor='#2C303F'
                fgcolor='#fff'
                style={{ width: '50%', textAlign: 'center', alignItems: 'center' }}
                onPress={() => { onClose(); }}
              >
                <Text style={{ color: '#fff' }}>Schließen</Text>
              </Card>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        paddingTop: 20,
        fontSize: 40,
        fontWeight: 'bold',
    },
    image: {
        width: 150,
        height: 150,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'normal',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
