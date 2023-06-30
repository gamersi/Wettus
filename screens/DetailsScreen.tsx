import { Modal, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';

export default function DetalsScreen({ isVisible, weatherData, isFuture, onClose }: { isVisible: boolean, weatherData: any, isFuture: boolean, onClose: any }) {
    return (
        <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose} onDismiss={onClose}>
            <View style={styles.container}>
                <Text style={styles.title}>Wetter</Text>
                <Text style={styles.subtitle}>{weatherData?.name}</Text>
                <Text style={styles.subtitle}>{new Date(weatherData?.dt * 1000).toLocaleString()}</Text>
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
