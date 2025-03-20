import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 10, // Adiciona padding horizontal
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "blue",
    textAlign: "center", // Centraliza o título
  },
  pickerContainer: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#f0f0f0", // Fundo claro para o Picker
  },
  picker: {
    height: 60, // Aumenta a altura do Picker
    width: "100%",
  },
  pickerItem: {
    fontSize: 16, // Tamanho da fonte dos itens
    color: "black", // Cor do texto dos itens
  },
});
