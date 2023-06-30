import { Modal, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';

export default function DetalsScreen({ isVisible, currentWeather, onClose }: { isVisible: boolean, currentWeather: any, onClose: any }) {
    return (
        <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose} onDismiss={onClose}>
            <View style={styles.container}>
                <Text style={styles.title}>Wetter</Text>
                <Text style={styles.subtitle}>Details</Text>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
