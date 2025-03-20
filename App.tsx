import { Text, StyleSheet, ScrollView, Alert, Modal, View, Image } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

import Input from "./components/input";
import Button from "./components/button";
import InputFoto from "./components/inputFoto";
import Localizacao from "./components/localization";
import LoadingSpinner from "./components/carregamento";
import TipoIncidenciaSelector, { IncidenciaTipo } from "./components/tipoIncidenciaSelector";

type PhotoRequirements = {
  [key in IncidenciaTipo]: string[];
};

const photoRequirements: PhotoRequirements = {
  [IncidenciaTipo.SERVIÇO_IMPRODUTIVO]: ["Foto com a placa no local do serviço"],
  [IncidenciaTipo.REPOSIÇÃO_DE_ELO]: ["Chave aberta", "Chave fechada", "Foto da legenda da chave ou trafo", "Foto ou print da APR"],
  [IncidenciaTipo.CONEXÃO_NO_POSTE_RAMAL_UC_CAIXA_DERIVAÇÃO]: [
    "Antes do poste",
    "Depois com o eletricista na escada",
    "Foto ou print da APR",
  ],
  [IncidenciaTipo.SUBSTITUIÇÃO_DE_NH_ACIONAMENTO_CD_TRAFO]: [
    "Antes do poste do trafo com a proteção aberta",
    "Depois do poste com a vara de manobra sinalizando o acionamento, ou eletricista na escada",
    "Foto ou print da APR",
  ],
  [IncidenciaTipo.INSTALAÇÃO_DE_RAMAL_UC]: [
    "Pontalete sem o fio",
    "Pontalete com o fio",
    "Foto do antes do poste",
    "Escada no poste com eletricista",
    "Medidor com fio",
    "Medidor sem fio",
    "Sucata (Obs: O fio da sucata deve estar enrolado no chão)",
    "Foto ou print da APR",
  ],
  [IncidenciaTipo.RETIRADA_DE_RAMAL_UC]: [
    "Pontalete com o fio",
    "Foto do antes do poste",
    "Escada no poste com eletricista",
    "Medidor com fio",
    "Medidor sem fio",
    "Sucata (Obs: O fio da sucata deve estar enrolado no chão)",
    "Foto ou print da APR",
  ],
  [IncidenciaTipo.PODA_NA_BT]: [
    "Foto das árvores afetando a rede, priorizar foto com visão panorâmica da rede",
    "Foto das podas executadas por árvore, foto panorâmica da rede livre",
    "Foto ou print da APR",
  ],
  [IncidenciaTipo.PODA_NA_MT]: [
    "Foto das árvores afetando a rede, priorizar foto com visão panorâmica da rede",
    "Foto das podas executadas por árvore, foto panorâmica da rede livre",
    "Foto ou print da APR",
  ],
  [IncidenciaTipo.CORTE_DE_ÁRVORE]: [
    "Foto das árvores afetando a rede, priorizar foto com visão panorâmica da rede",
    "Foto dos cortes 20cm do solo, executados por árvore, foto panorâmica da rede livre",
    "Foto dos troncos cortados",
    "Foto ou print da APR",
  ],
  [IncidenciaTipo.CONEXÃO_NO_MEDIDOR]: [
    "Foto do medidor aberto",
    "Eletricista fazendo a conexão no medidor",
    "Foto ou print da APR",
  ],
  [IncidenciaTipo.SERVIÇO_NO_MEDIDOR_E_POSTE]: [
    "Foto do medidor aberto",
    "Eletricista fazendo a conexão no medidor",
    "Antes do poste",
    "Depois com o eletricista na escada",
    "Foto ou print da APR",
  ],
  [IncidenciaTipo.RETIRADA_DE_OBJETOS_ESTRANHOS]: [
    "Poste, medidor ou rede com o objeto",
    "Poste, medidor ou rede sem o objeto",
    "Foto ou print da APR",
  ],
  [IncidenciaTipo.INSTALAÇÃO_DE_ESPAÇADOR]: [
    "Rede sem o espaçador",
    "Rede com o espaçador",
    "Foto ou print da APR",
  ],
  [IncidenciaTipo.JUMP_NA_BT]: [
    "Jump partido",
    "Eletricista da escada com jump normalizado",
    "Foto ou print da APR",
  ],
  [IncidenciaTipo.JUMP_NA_MT]: [
    "Jump partido",
    "Eletricista da escada com jump normalizado",
    "Foto ou print da APR",
  ],
  [IncidenciaTipo.MANOBRA_DE_CHAVE]: [
    "Chave aberta",
    "Chave fechada",
    "Foto da legenda da chave",
    "Foto ou print da APR",
  ],
  [IncidenciaTipo.ELEVAÇÃO_DO_TAP_MANOBRA]: [
    "Chave aberta",
    "Eletricista na escada",
    "Chave fechada",
    "Foto das legendas",
    "Foto ou print da APR",
  ],
  [IncidenciaTipo.TENSIONAMENTO_NA_REDE_BT_MT]: [
    "Cabo baixo",
    "Eletricista na escada",
    "Cabo tensionado",
    "Foto ou print da APR",
  ],
  [IncidenciaTipo.EMENDA_NA_MT]: [
    "Cabo partido no chão",
    "Rede que o cabo partiu",
    "Emenda no chão",
    "Emenda no fio tensionado",
    "Eletricista na escada",
    "Foto de cada emenda",
    "Foto panorâmica da rede com a emenda",
    "Sucata (se houver)",
    "Foto ou print da APR",
  ],
  [IncidenciaTipo.EMENDA_NA_BT]: [
    "Cabo partido no chão",
    "Rede que o cabo partiu",
    "Emenda no chão",
    "Emenda no fio tensionado",
    "Eletricista na escada",
    "Foto de cada emenda",
    "Foto panorâmica da rede com a emenda",
    "Sucata (se houver)",
    "Foto ou print da APR",
  ],
  [IncidenciaTipo.INSPEÇÃO_NA_BA_DT]: [
    "Foto do CSI inicial e do poste e final",
    "Foto do poste",
    "Foto do CSI final",
    "Total de KM e nome do operador que autorizou",
    "Foto ou print da APR",
  ],
  [IncidenciaTipo.LEITURA_DE_TRAFO]: [
    "Foto do antes do poste",
    "Escada no poste com eletricista + leitura na baixa",
    "Foto ou print da APR",
  ],
  [IncidenciaTipo.TENSIONAMENTO_DE_RAMAL]: [
    "Cabo baixo",
    "Eletricista na escada",
    "Cabo tensionado",
    "Foto ou print da APR",
  ],
  [IncidenciaTipo.TEMPO_DE_ESPERA_POR_SOLICITAÇÃO_ENEL]: [
    "Foto da equipe em campo com horário inicial na foto",
    "Foto da equipe em campo com horário final na foto",
    "Nome do operador que autorizou e tempo de espera na baixa do serviço",
    "Foto ou print da APR",
  ],
  [IncidenciaTipo.SUBSTITUIÇÃO_DE_CABO_BT_MT]: [
    "Cabo partido no chão",
    "Rede que o cabo partiu",
    "Foto do cabo novo no chão",
    "Eletricista na escada",
    "Foto do cabo tensionado",
    "Foto panorâmica da rede",
    "Foto panorâmica da rede com a emenda",
    "Foto da sucata",
    "Foto ou print da APR",
  ],
  [IncidenciaTipo.SUBSTITUIÇÃO_DE_TRAFO]: [
    "Foto do antes do poste do trafo",
    "Foto do trafo novo no chão",
    "Foto da placa do trafo novo com as informações legíveis",
    "Foto do eletricista na escada",
    "Foto das chaves, para-raios e cx de proteção novos no chão, se houver",
    "Foto do trafo velho no chão",
    "Foto da placa do trafo velho com as informações legíveis",
    "Foto das chaves, para-raios e cx de proteção velhos no chão, se houver",
    "Foto ou print da APR",
  ],
};

export default function App() {
  const [tipoIncidencia, setTipoIncidencia] = useState<IncidenciaTipo | null>(null);
  const [numeroIncidencia, setNumeroIncidencia] = useState<string>("");
  const [fotos, setFotos] = useState<Record<string, { uri: string; aspectRatio: number }[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [mapSnapshotUri, setMapSnapshotUri] = useState<string | null>(null);

  useEffect(() => {
    setFotos({});
  }, [tipoIncidencia]);

  const handleGerarPDF = async () => {
    setIsLoading(true);
    try {
      if (!numeroIncidencia.trim()) {
        Alert.alert("Erro", "Preencha o número da incidência!");
        return;
      }

      if (!tipoIncidencia) {
        Alert.alert("Erro", "Selecione um tipo de incidência!");
        return;
      }
  
      const requiredPhotos = photoRequirements[tipoIncidencia];
      const missingPhotos = requiredPhotos.filter((desc) => !fotos[desc]?.[0]?.uri);
  
      if (missingPhotos.length > 0) {
        Alert.alert("Erro", `Faltam as seguintes fotos: ${missingPhotos.join(', ')}`);
        return;
      }
  
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Erro", "Permissão de localização negada.");
        return;
      }

      let location = null;
      try {
        location = await Location.getCurrentPositionAsync({});
      } catch (error) {
        console.warn("Erro ao obter localização:", error);
      }
  
      const dataHora = new Date().toLocaleString();
  
      // Processamento da imagem do mapa
      let mapSnapshotBase64 = null;
      if (mapSnapshotUri) {
        if (mapSnapshotUri.startsWith('data:')) {
          mapSnapshotBase64 = mapSnapshotUri.split(',')[1];
        } else {
          const fileInfo = await FileSystem.getInfoAsync(mapSnapshotUri);
          if (fileInfo.exists) {
            mapSnapshotBase64 = await FileSystem.readAsStringAsync(mapSnapshotUri, {
              encoding: FileSystem.EncodingType.Base64,
            });
          }
        }
      }
  
      // Processamento das fotos
      const fotosBase64 = [];
      for (const [descricao, listaFotos] of Object.entries(fotos)) {
        if (listaFotos?.length > 0) {
          for (const foto of listaFotos) {
            try {
              let base64;
              if (foto.uri.startsWith('data:')) {
                base64 = foto.uri.split(',')[1];
              } else {
                const fileInfo = await FileSystem.getInfoAsync(foto.uri);
                if (!fileInfo.exists) throw new Error('Arquivo não encontrado');
                
                base64 = await FileSystem.readAsStringAsync(foto.uri, {
                  encoding: FileSystem.EncodingType.Base64,
                });
              }
              fotosBase64.push({ descricao, base64 });
            } catch (error) {
              Alert.alert("Erro", `Erro na foto ${descricao}: ${
                error instanceof Error ? error.message : 'Erro desconhecido'
              }`);
              return;
            }
          }
        }
      }
  
      // Geração do HTML do PDF
      const htmlContent = `
        <html>
          <head>
            <style>
              @page { size: A4; margin: 20px; }
              body { font-family: Arial; }
              .page { page-break-after: always; padding: 20px; }
              h1 { font-size: 50px; margin-bottom: 20px; color: blue; }
              h2 { font-size: 38px; margin-bottom: 10px; color: red; }
              p { margin: 8px 0; font-size: 25px; }
              .mapa-container { 
                margin: 15px 0; 
                padding: 10px;
                page-break-inside: avoid;
              }
              .img-mapa {
                max-width: 100%;
                height: 150mm;
                margin-top: 15px;
                page-break-inside: avoid;
              }
              .img-fotos {
                max-width: 100%;
                height: 200mm;
                margin-top: 15px;
                page-break-inside: avoid;
              }
            </style>
          </head>
          <body>
            <div class="page">
              <h1>Relatório de Incidência</h1>
              <div class="info-section">
                <p><strong>Nº Incidência:</strong> ${numeroIncidencia}</p>
                <p><strong>Tipo:</strong> ${tipoIncidencia}</p>
                <p><strong>Coordenadas:</strong> ${
                location 
                  ? `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`
                  : "Erro: Não foi possível obter a localização devido à falta de sinal de GPS."
              }</p>
                <p><strong>Data:</strong> ${dataHora}</p>
              </div>
              
              ${mapSnapshotBase64 ? `
                <div class="mapa-container">
                  <h2>Localização no Mapa</h2>
                  <img class="img-mapa" src="data:image/png;base64,${mapSnapshotBase64}" />
                </div>` : ''}
            </div>
  
            ${fotosBase64.map((foto, index) => `
              <div class="page">
                <h2>Foto ${index + 1}: ${foto.descricao}</h2>
                <img class="img-fotos" src="data:image/jpeg;base64,${foto.base64}" />
              </div>`
            ).join('')}
          </body>
        </html>
      `;
  
      // Geração do PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        width: 595,
        height: 842,
      });
  
      const dataAtual = new Date().toISOString().split('T')[0];
      const nomeArquivo = `Incidência_${numeroIncidencia}_${dataAtual}.pdf`;
      const novoUri = `${FileSystem.documentDirectory}${nomeArquivo}`;
  
      await FileSystem.copyAsync({ from: uri, to: novoUri });
  
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(novoUri, { 
          mimeType: "application/pdf", 
          dialogTitle: "Salvar Relatório",
          UTI: "com.adobe.pdf"
        });
      } else {
        Alert.alert("Erro", "Compartilhamento não disponível.");
      }
  
    } catch (error) {
      console.error("Erro detalhado:", error);
      Alert.alert("Erro", (error as Error)?.message || "Falha na geração do PDF");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNovaIncidencia = () => {
    setTipoIncidencia(null);
    setNumeroIncidencia("");
    setFotos({});
    setMapSnapshotUri(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Registro de Incidências</Text>
      <Input
        placeholder="Ex:. 1234567890"
        value={numeroIncidencia}
        onChangeText={setNumeroIncidencia}
        keyboardType="numeric"
        label="Digite o nº da incidência"
        required
      />

      <Localizacao onMapSnapshot={setMapSnapshotUri} />

      {mapSnapshotUri && (
        <Image 
          source={{ uri: mapSnapshotUri }} 
          style={styles.snapshotImage} 
          resizeMode="contain"
        />
      )}

      <TipoIncidenciaSelector selectedType={tipoIncidencia} onSelectType={setTipoIncidencia} />

      {tipoIncidencia && (
      <InputFoto 
        tipoIncidencia={tipoIncidencia} 
        onFotosChange={setFotos} 
        fotos={fotos} 
        required
      />
    )}

      <View style={styles.buttonContainer}>

        <Button 
        onPress={handleGerarPDF}
        texto="Gerar Relatório PDF"
        color="#2196F3"
        />

        <Button 
        onPress={handleNovaIncidencia}
        texto="Nova Incidência"
        color="#4CAF50"
        />

      </View>
      <Modal transparent visible={isLoading}>
        <View style={styles.modalContainer}>
          <LoadingSpinner />
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'blue',
    marginVertical: 20,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  snapshotImage: {
    width: '100%',
    height: 200,
    marginVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  numeroIncidencia: {
    fontSize: 18,
    marginBottom: 10,
  },
  obrigatorio: {
    color:"red",
  },
  buttonContainer: {
    flexDirection: "row",
  }
});