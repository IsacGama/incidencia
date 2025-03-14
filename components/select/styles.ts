import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  pickerContainer: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    minWidth: 250,
    width: "100%",
    paddingLeft: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "blue",
  }
});
