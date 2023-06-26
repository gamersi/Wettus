import React from 'react';
import { View, StyleSheet } from 'react-native';

type CardProps = {
    children: React.ReactNode,
    bgcolor: string,
    fgcolor: string,
    style: object | undefined,
    onPress: () => void | undefined,
    onLongPress: () => void | undefined,
    disabled: boolean | undefined,
};

export default function Card(props: CardProps) {
    const styles = StyleSheet.create({
        card: {
            backgroundColor: props.bgcolor,
            color: props.fgcolor,
            padding: 10,
            margin: 10,
            borderRadius: 10,
            ...props.style,
        },
    });
    return (
        <View style={styles.card}>
            {props.children}
        </View>
    );
}