import { StyleSheet, Dimensions } from "react-native";

export const styles = StyleSheet.create({
    container: {
      width: "100%",
      marginVertical: 10,
    },
    selectButton: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      padding: 10,
      backgroundColor: "#f9f9f9",
    },
    selectButtonText: {
      fontSize: 16,
      color: "#333",
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      width: Dimensions.get("window").width * 0.8,
      maxHeight: Dimensions.get("window").height * 0.6,
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 10,
    },
    optionItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    },
    optionText: {
      fontSize: 16,
      color: "#333",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "blue",
        textAlign: "center",
    },
    errorText: {
        color: "red",
        marginTop: 5,
      },
  });
