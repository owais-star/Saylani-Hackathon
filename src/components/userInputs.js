import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { TextInput as Input } from 'react-native-paper'
import { theme } from '../core/theme'

export default function TextInput({ errorText, description, ...props }) {
    return (
        <View style={styles.container}>
            <Input
                style={styles.input}
                selectionColor={"theme.colors.myColor"}
                underlineColor="transparent"
                mode="outlined"
                {...props}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 10,
    },
    input: {
        backgroundColor: theme.colors.surface,
    }
})
