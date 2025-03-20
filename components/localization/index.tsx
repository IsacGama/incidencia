import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Dimensions } from "react-native";
import WebView from "react-native-webview";
import * as Location from "expo-location";
import NetInfo from "@react-native-community/netinfo";
import { styles } from "./styles";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface LocalizacaoProps {
  onMapSnapshot: (uri: string) => void;
}

const generateLeafletHTML = (lat: number, lng: number) => `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <style>
      #map { 
        height: ${SCREEN_HEIGHT - 100}px;
        width: ${SCREEN_WIDTH}px;
        touch-action: none;
        position: relative;
        z-index: 0;
      }
      body { 
        margin: 0;
        padding: 0;
        overflow: hidden !important;
        background: transparent !important;
      }
      .leaflet-control-container { display: none; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      let mapLoaded = false;
      let marker;
      
      const map = L.map('map', {
        gestureHandling: true,
        gestureHandlingOptions: {
          duration: 150,
          tolerance: 15
        },
        tap: false,
        dragging: true,
        inertia: true,
        inertiaDeceleration: 2000,
        zoomControl: false,
        attributionControl: false
      }).setView([${lat}, ${lng}], 16);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 13,
        tileSize: 512,
        zoomOffset: -1
      }).addTo(map);

      marker = L.marker([${lat}, ${lng}], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        }),
        bubblingMouseEvents: false,
        draggable: true
      }).addTo(map);

      marker.on('dragend', function(event) {
        const newPos = marker.getLatLng();
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'position',
          lat: newPos.lat,
          lng: newPos.lng
        }));
      });

      map.whenReady(() => {
        mapLoaded = true;
        map.invalidateSize({ animate: false });
      });

      function updatePosition(newLat, newLng) {
        marker.setLatLng([newLat, newLng]);
        map.panTo([newLat, newLng]);
      }

      function captureSnapshot() {
        if(!mapLoaded) return;
        
        html2canvas(document.querySelector("#map"), {
          useCORS: true,
          allowTaint: false,
          logging: false,
          scale: 2,
          backgroundColor: null,
          ignoreElements: (el) => el.classList.contains('leaflet-control-container')
        }).then(canvas => {
          const dataUrl = canvas.toDataURL('image/png');
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'snapshot',
            data: dataUrl
          }));
        });
      }

      document.addEventListener("message", (e) => {
        if (e.data === "capture") captureSnapshot();
      });
    </script>
  </body>
</html>
`;

const Localizacao: React.FC<LocalizacaoProps> = ({ onMapSnapshot }) => {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const webViewRef = useRef<WebView>(null);

  const getLocation = async () => {
    setLoading(true);
    try {
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      
      // Atualiza a posição no mapa
      webViewRef.current?.injectJavaScript(`
        updatePosition(${location.coords.latitude}, ${location.coords.longitude});
      `);
    } catch (error) {
      setErrorMsg("Erro ao obter localização");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão de localização negada");
        setLoading(false);
        return;
      }
      await getLocation();
    })();
  }, []);

  const handleCapture = () => {
    webViewRef.current?.injectJavaScript(`
      setTimeout(() => {
        map.invalidateSize(true);
        captureSnapshot();
      }, 300);
    `);
  };

  const handleRecalcularPosicao = async () => {
    await getLocation();
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'snapshot') {
        onMapSnapshot(data.data);
      } else if (data.type === 'position') {
        setLocation(prev => prev ? {...prev, latitude: data.lat, longitude: data.lng} : null);
      }
    } catch (error) {
      console.error("Erro ao processar mensagem:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Latitude: {location?.latitude?.toFixed(6)}, Longitude: {location?.longitude?.toFixed(6)}
      </Text>
      
      {isOnline ? (
        <View style={styles.mapContainer}>
          {location && (
            <WebView
              key={`${location.latitude}-${location.longitude}`}
              ref={webViewRef}
              originWhitelist={["*"]}
              source={{ html: generateLeafletHTML(location.latitude, location.longitude) }}
              style={styles.map}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              onMessage={handleMessage}
              scrollEnabled={false}
              scalesPageToFit={true}
              startInLoadingState={true}
              androidLayerType="hardware"
              nestedScrollEnabled={true}
              onTouchStart={() => true}  // Captura eventos de toque
              onTouchEnd={() => true}
            />
          )}
        </View>
      ) : (
        <Text style={styles.error}>Sem conexão com a internet. Exibindo apenas coordenadas.</Text>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleRecalcularPosicao}
        >
          <Text style={styles.buttonText}>Recalcular Posição</Text>
        </TouchableOpacity>

        {isOnline && (
          <TouchableOpacity 
            style={styles.button}
            onPress={handleCapture}
          >
            <Text style={styles.buttonText}>Capturar Mapa</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Localizacao;