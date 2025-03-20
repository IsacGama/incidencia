import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left", // Alinhar o texto à esquerda
    width: "100%", // Ocupar a largura total
    color: "blue"
  },
  inputContainer: {
    marginBottom: 20,
    alignItems: "center",
    width: "100%",
  },
  descricao: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "justify", // Alinhar o texto à esquerda
    width: "85%", // Ocupar a largura total
  },
  botoesContainer: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 10,
    width: "100%",
  },
  requiredText: {
    color: "red",
    marginLeft: 5,
    alignSelf: "flex-start", // Alinha o asterisco ao topo
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "flex-start", // Alinha o texto e o asterisco ao topo
    marginBottom: 5,
    width: "100%", // Ocupar a largura total
  },
  botao: {
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
    borderRadius: 5,
    height: 45,
    borderWidth: 0,
  },
  foto: {
    width: "100%",
    marginTop: 10,
    borderRadius: 10,
  },
  fotoContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  substituirFotoButton: {
    marginTop: 10,
    backgroundColor: "#ff4444",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  substituirFotoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
});