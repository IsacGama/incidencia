import React, { useEffect } from "react";
import { View, Image, StyleSheet, Text, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Button from "../button";
import { IncidenciaTipo } from "../select";
import { styles } from "./styles";

interface InputFotoProps {
  tipoIncidencia: IncidenciaTipo;
  onFotosChange: (fotos: Record<string, { uri: string; aspectRatio: number } | null>) => void;
  fotos: Record<string, { uri: string; aspectRatio: number } | null>;
}

const requestPermissions = async () => {
  if (Platform.OS === "android") {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    return cameraStatus === "granted";
  } else {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    return cameraStatus === "granted";
  }
};

const InputFoto: React.FC<InputFotoProps> = ({ tipoIncidencia, onFotosChange, fotos }) => {
  useEffect(() => {
    requestPermissions();
  }, []);

  const takePhoto = async (descricao: string) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      alert("Permissão para acessar a câmera foi negada.");
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: false,
        cameraType: ImagePicker.CameraType.back,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;

        // Gera um nome único para o arquivo
        const fileName = `foto_${Date.now()}_${descricao.replace(/\s/g, '_')}.jpg`;
        const novoUri = `${FileSystem.documentDirectory}${fileName}`;

        // Copia a imagem para um diretório permanente
        await FileSystem.copyAsync({
          from: uri,
          to: novoUri,
        });

        // Obtém as dimensões da imagem
        Image.getSize(novoUri, (width, height) => {
          const aspectRatio = width / height;
          const novasFotos = { ...fotos, [descricao]: { uri: novoUri, aspectRatio } };
          onFotosChange(novasFotos); // Atualiza o estado no componente pai
        });
      }
    } catch (error) {
      console.error("Erro ao capturar ou salvar a foto:", error);
      alert("Ocorreu um erro ao capturar ou salvar a foto.");
    }
  };

  const fotosRequeridas: Record<IncidenciaTipo, string[]> = {
    [IncidenciaTipo.ROUBO]: ["Foto do Local", "Foto do Objeto Roubado"],
    [IncidenciaTipo.ACIDENTE]: ["Foto do Veículo", "Foto da Sinalização", "Foto Geral"],
    [IncidenciaTipo.VANDALISMO]: ["Foto do Dano", "Foto do Local"],
    [IncidenciaTipo.OUTRO]: ["Foto do Ocorrido"],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Anexar fotos:</Text>
      {fotosRequeridas[tipoIncidencia].map((descricao: string, index: number) => (
        <View key={index} style={styles.inputContainer}>
          <Button onPress={() => takePhoto(descricao)}>
            {fotos[descricao] ? "🔄 Retirar Nova " : "📷 Tirar "} {descricao}
          </Button>
          {fotos[descricao] && (
            <Image
              source={{ uri: fotos[descricao]!.uri }}
              style={[styles.foto, { aspectRatio: fotos[descricao]!.aspectRatio }]}
              resizeMode="contain"
            />
          )}
        </View>
      ))}
    </View>
  );
};

export default InputFoto;