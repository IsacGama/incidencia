import { TextInput, TextInputProps } from "react-native";

import { styles } from "./styles";

export default function Input(props: TextInputProps) {
    return (
        <TextInput style={styles.input} {...props} />
    )
}