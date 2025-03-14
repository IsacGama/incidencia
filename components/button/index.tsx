import { TouchableOpacity, TouchableOpacityProps, Text, StyleSheet } from "react-native";

import { styles } from "./styles";

export default function Button(props: TouchableOpacityProps) {
    return (
        <TouchableOpacity style={styles.button} {...props}>
            <Text style={styles.text}>{props.children}</Text>
        </TouchableOpacity>
    )
}