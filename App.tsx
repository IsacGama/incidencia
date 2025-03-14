import { Text, StyleSheet, ScrollView, Alert, Modal, View } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";


import Input from "./components/input";
import Button from "./components/button";
import Select from "./components/select";
import InputFoto from "./components/inputFoto";
import Localizacao from "./components/localization";
import LoadingSpinner from "./components/carregamento";
import { IncidenciaTipo } from "./components/select";

// Defina os tipos de fotos necessários para cada tipo de incidência
type PhotoRequirements = {
  [key in IncidenciaTipo]: string[];
};

const photoRequirements: PhotoRequirements = {
  [IncidenciaTipo.ROUBO]: ["Foto do Local", "Foto do Objeto Roubado"],
  [IncidenciaTipo.ACIDENTE]: ["Foto do Veículo", "Foto da Sinalização", "Foto Geral"],
  [IncidenciaTipo.VANDALISMO]: ["Foto do Dano", "Foto do Local"],
  [IncidenciaTipo.OUTRO]: ["Foto do Ocorrido"],
};

export default function App() {
  const [tipoIncidencia, setTipoIncidencia] = useState<IncidenciaTipo>(IncidenciaTipo.ROUBO);
  const [numeroIncidencia, setNumeroIncidencia] = useState<string>("");
  const [fotos, setFotos] = useState<Record<string, { uri: string; aspectRatio: number } | null>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Reseta as fotos quando o tipo de incidência muda
  useEffect(() => {
    setFotos({});
  }, [tipoIncidencia]);

  const handleGerarPDF = async () => {
    setIsLoading(true);
    try {
      // Validação do número da incidência
      if (!numeroIncidencia.trim()) {
        Alert.alert("Erro", "Preencha o número da incidência!");
        return;
      }

      // Validação das fotos
      const requiredPhotos = photoRequirements[tipoIncidencia];
      const missingPhotos = requiredPhotos.filter((desc) => !fotos[desc]?.uri);

      if (missingPhotos.length > 0) {
        Alert.alert("Erro", `Fotos obrigatórias faltando:\n${missingPhotos.join("\n")}`);
        return;
      }

      // Captura a localização
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Erro", "Permissão para acessar a localização foi negada.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const dataHora = new Date().toLocaleString();

      // Converte as fotos para base64
      let fotosBase64 = [];
      for (const [descricao, foto] of Object.entries(fotos)) {
        if (foto) {
          // Verifica se o arquivo ainda existe
          const fileInfo = await FileSystem.getInfoAsync(foto.uri);
          if (!fileInfo.exists) {
            Alert.alert("Erro", `Arquivo da foto "${descricao}" não encontrado.`);
            return;
          }

          const base64 = await FileSystem.readAsStringAsync(foto.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          fotosBase64.push({ descricao, base64 });
        }
      }

      // Cria o conteúdo do PDF
      const htmlContent = `
        <html>
          <head>
            <style>
              @page {
                size: A4;
                margin: 20px;
              }
              .page {
                page-break-after: always;
                padding: 20px;
              }
              .photo-page {
                page-break-before: always;
                padding: 20px;
              }
              img {
                max-width: 100%;
                height: 200mm;
                margin-top: 15px;
                page-break-inside: avoid;
              }
              h1 { font-size: 50px; margin-bottom: 20px; color: blue; }
              h2 { font-size: 38px; margin-bottom: 10px; color: red; }
              p { margin: 8px 0; font-size: 25px; }
            </style>
          </head>
          <body>
            <!-- Primeira página -->
            <div class="page">
              <h1>Relatório de Incidência</h1>
              <div class="info-section">
                <p><strong>Número da Incidência:</strong> ${numeroIncidencia}</p>
                <p><strong>Tipo de Incidência:</strong> ${tipoIncidencia}</p>
                <p><strong>Localização:</strong> Latitude ${latitude}, Longitude ${longitude}</p>
                <p><strong>Data e Hora:</strong> ${dataHora}</p>
              </div>
            </div>

            <!-- Páginas das fotos -->
            ${fotosBase64
              .map(
                (foto) => `
              <div class="photo-page">
                <h2>${foto.descricao}</h2>
                <img src="data:image/jpeg;base64,${foto.base64}" />
              </div>`
              )
              .join("")}
          </body>
        </html>
      `;

      // Gera o PDF
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      // Verifica se o PDF foi gerado com sucesso
      if (!uri) {
        Alert.alert("Erro", "Erro ao gerar o PDF.");
        return;
      }

      // Formata a data para o padrão desejado (exemplo: "2023-10-05")
      const dataAtual = new Date().toISOString().split('T')[0];

      // Cria o nome do arquivo no padrão "Incidência_${nºincidencia}_${Data}"
      const nomeArquivo = `Incidência_${numeroIncidencia}_${dataAtual}.pdf`;

      // Salva o PDF em um local permanente
      const novoUri = `${FileSystem.documentDirectory}${nomeArquivo}`;
      await FileSystem.copyAsync({
        from: uri,
        to: novoUri,
      });

      // Compartilha o PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(novoUri, { mimeType: "application/pdf", dialogTitle: "Salvar PDF" });
      } else {
        Alert.alert("Erro", "Compartilhamento não disponível.");
      }
    } catch (error) {
      console.error("Erro ao gerar o PDF:", error);
      Alert.alert("Erro", "Ocorreu um erro ao gerar o PDF.");
    } finally {
      setIsLoading(false); // Desativa o carregamento
    }
  };

  const handleNovaIncidencia = () => {
    setTipoIncidencia(IncidenciaTipo.ROUBO);
    setNumeroIncidencia("");
    setFotos({}); // Limpa as fotos
  };

  return (
    <ScrollView contentContainerStyle={style.container}>
      <Text style={style.titulo}>Incidência</Text>

      <Input
        placeholder="Digite o número da incidência"
        value={numeroIncidencia}
        onChangeText={setNumeroIncidencia}
      />

      <Localizacao />

      {/* Select para escolher o tipo de incidência */}
      <Select selectedType={tipoIncidencia} onSelectType={setTipoIncidencia} />

      {/* Componente de foto recebe o tipo da incidência */}
      <InputFoto tipoIncidencia={tipoIncidencia} onFotosChange={setFotos} fotos={fotos} />

      <Button onPress={handleGerarPDF}>Transformar em PDF e enviar</Button>
      <Button onPress={handleNovaIncidencia}>Registrar Nova Incidência</Button>

      <Modal transparent={true} visible={isLoading}>
        <View style={style.modalContainer}>
          <LoadingSpinner />
        </View>
      </Modal>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
    gap: 30,
  },
  titulo: {
    color: "blue",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});