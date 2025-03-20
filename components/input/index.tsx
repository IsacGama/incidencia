import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { styles } from "./styles";

interface InputProps extends TextInputProps {
  label?: string; // Texto que será exibido acima do TextInput
  required?: boolean; // Indica se o campo é obrigatório (exibe o asterisco)
}

export default function Input({ label, required, ...props }: InputProps) {
  return (
    <View>
      {/* Container para o label e o asterisco */}
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>{label}</Text>
          {required && <Text style={styles.requiredText}>*</Text>}
        </View>
      )}
      {/* Campo de entrada de texto */}
      <TextInput style={styles.input} {...props} />
    </View>
  );
}