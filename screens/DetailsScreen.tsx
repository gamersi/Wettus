import { Modal, StyleSheet, Image } from 'react-native';

import { Text, View } from '../components/Themed';
// import { useEffect } from 'react';

export default function DetailsScreen({ isVisible, weatherData, isFuture, onClose }: { isVisible: boolean, weatherData: any, isFuture: boolean, onClose: any }) {
    // useEffect(() => {
    //     console.log("DetailsScreen data:", weatherData);
    // }, [weatherData]);
    return (
        <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose} onDismiss={onClose}>
            <View style={styles.container}>
                <Text style={styles.title}>Wetter</Text>
                <Text style={styles.subtitle}>{weatherData?.city}</Text>
                <Text style={styles.subtitle}>{weatherData?.country}</Text>
                <Image style={styles.image} source={{ uri: `https://openweathermap.org/img/wn/${(isFuture ? weatherData?.weather[0].icon : weatherData?.icon)}@4x.png` }} />
                <Text style={styles.subtitle}>{isFuture ? new Date(weatherData?.dt * 1000).toLocaleString(): "Jetzt"}</Text>
                <Text style={styles.subtitle}>{isFuture ? weatherData?.weather[0].description : weatherData?.description}</Text>
                <Text style={styles.subtitle}>{isFuture ? weatherData?.main.temp : weatherData?.temperature} °C</Text>
                <Text style={styles.subtitle}>{isFuture ? weatherData?.wind.speed : weatherData?.windSpeed} m/s</Text>
                <Text style={styles.subtitle}>{isFuture ? weatherData?.main.temp_min : weatherData?.minTemperature} °C Tief</Text>
                <Text style={styles.subtitle}>{isFuture ? weatherData?.main.temp_max : weatherData?.maxTemperature} °C Hoch</Text>
                <Text style={styles.subtitle}>{isFuture ? weatherData?.main.feels_like : weatherData?.feelsLike} °C gefühlt</Text>
                <Text style={styles.subtitle}>{isFuture ? weatherData?.main.humidity : weatherData?.humidity} % Luftfeuchtigkeit</Text>
                <Text style={styles.subtitle}>{isFuture ? weatherData?.main.pressure : weatherData?.pressure} hPa Luftdruck</Text>
                <Text style={styles.subtitle}>{isFuture ? weatherData?.clouds.all : weatherData?.cloudiness} % Bewölkung</Text>
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
