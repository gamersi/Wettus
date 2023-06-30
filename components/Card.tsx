import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

type CardProps = {
    children?: React.ReactNode,
    bgcolor: string,
    fgcolor: string,
    style?: object | undefined,
    onPress?: () => void | undefined,
    onLongPress?: () => void | undefined,
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
        <TouchableOpacity style={styles.card} onPress={props.onPress} onLongPress={props.onLongPress}>
            {props.children}
        </TouchableOpacity>
    );
}