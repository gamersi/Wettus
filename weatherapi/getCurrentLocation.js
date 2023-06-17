import * as Location from 'expo-location';

let userLocation = null,
    latitude = 0,
    longitude = 0,
    position = null,
    error = null;

async function getCurrentLocation() {

    const { status } = await Location.requestForegroundPermissionsAsync();

    if(status !== 'granted') {
        console.log('Permission to access location was denied');
        return {
            latitude: -1,
            longitude: -1,
            position: null,
            error: 'Permission to access location was denied'
        }
    }

    userLocation = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest, maximumAge: 10000});
    latitude = userLocation.coords.latitude;
    longitude = userLocation.coords.longitude;
    position = userLocation.coords;

    return {
        latitude: latitude,
        longitude: longitude,
        position: position,
        error: null
    }

}

export default getCurrentLocation;