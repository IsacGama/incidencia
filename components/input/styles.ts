import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: "row", // Para alinhar o label e o asterisco na mesma linha
    alignItems: "center", // Centraliza verticalmente
    marginBottom: 5, // Espaçamento entre o label e o TextInput
  },
  labelText: {
    fontSize: 18,
    color: "#333",
  },
  requiredText: {
    color: "red", // Cor do asterisco
    marginLeft: 5, // Espaçamento entre o label e o asterisco
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
    color: "#333",
    width: 345,
  },
});