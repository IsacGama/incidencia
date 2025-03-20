import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    height: 500,
    width: '100%',
    marginVertical: 10,
  },
  map: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    alignSelf: "flex-start"
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: '#4CAF50',
  }
  
});