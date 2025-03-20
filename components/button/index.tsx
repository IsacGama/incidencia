import React from "react";
import { TouchableOpacity, TouchableOpacityProps, Text, TextStyle } from "react-native";
import { styles } from "./styles"


interface ButtonProps extends TouchableOpacityProps {
  color?: string; // Cor de fundo
  textColor?: string; // Cor do texto
  borderColor?: string; // Cor da borda
  textStyle?: TextStyle; // Estilo personalizado para o texto
  texto?: string; // Texto que será exibido dentro do botão
}

export default function Button({
  color,
  textColor,
  borderColor,
  textStyle,
  texto,
  children,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        color ? { backgroundColor: color } : null,
        borderColor ? { borderColor, borderWidth: 1 } : null,
      ]}
      {...props}
    >
      <Text style={[styles.text, textColor ? { color: textColor } : null, textStyle]}>
        {texto || children} {/* Exibe o texto passado como prop ou o conteúdo children */}
      </Text>
    </TouchableOpacity>
  );
}