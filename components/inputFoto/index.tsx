import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Text, Platform, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from 'expo-media-library';
import Button from "../button";
import { IncidenciaTipo } from "../tipoIncidenciaSelector";
import { styles } from "./styles";
import LoadingSpinner from "../carregamento";

interface InputFotoProps {
  tipoIncidencia: IncidenciaTipo;
  onFotosChange: (fotos: Record<string, { uri: string; aspectRatio: number }[]>) => void;
  fotos: Record<string, { uri: string; aspectRatio: number }[]>;
  required?: boolean; 
}

const requestPermissions = async () => {
  if (Platform.OS === "android") {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();
    return cameraStatus === "granted" && mediaLibraryStatus === "granted";
  } else {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();
    return cameraStatus === "granted" && mediaLibraryStatus === "granted";
  }
};

const InputFoto: React.FC<InputFotoProps> = ({ tipoIncidencia, onFotosChange, fotos, required = false }) => {
  const [photoDescriptions, setPhotoDescriptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false); // Estado para controlar o carregamento

  useEffect(() => {
    requestPermissions();
    setPhotoDescriptions(fotosRequeridas[tipoIncidencia]);
  }, [tipoIncidencia]);

  const hasPhotos = (descricao: string) => {
    return fotos[descricao] && fotos[descricao].length > 0;
  };

  const takePhoto = async (descricao: string) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      alert("Permissão para acessar a câmera ou a galeria foi negada.");
      return;
    }

    setLoading(true);

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: false,
        cameraType: ImagePicker.CameraType.back,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;

        // Salva a foto na galeria
        await MediaLibrary.saveToLibraryAsync(uri);

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
          const novasFotos = { ...fotos };
          if (!novasFotos[descricao]) {
            novasFotos[descricao] = [];
          }
          novasFotos[descricao].push({ uri: novoUri, aspectRatio });
          onFotosChange(novasFotos); // Atualiza o estado no componente pai
          setLoading(false);
        });
      }
    } catch (error) {
      console.error("Erro ao capturar ou salvar a foto:", error);
      alert("Ocorreu um erro ao capturar ou salvar a foto.");
      setLoading(false);
    }
  };

  const pickPhoto = async (descricao: string) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      alert("Permissão para acessar a galeria foi negada.");
      return;
    }

    setLoading(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: false,
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
          const novasFotos = { ...fotos };
          if (!novasFotos[descricao]) {
            novasFotos[descricao] = [];
          }
          novasFotos[descricao].push({ uri: novoUri, aspectRatio });
          onFotosChange(novasFotos); // Atualiza o estado no componente pai
          setLoading(false);
        });
      }
    } catch (error) {
      console.error("Erro ao escolher a foto:", error);
      alert("Ocorreu um erro ao escolher a foto.");
      setLoading(false);
    }
  };

  const handleRemovePhoto = (descricao: string, index: number) => {
    const novasFotos = { ...fotos };
    if (novasFotos[descricao]) {
      novasFotos[descricao].splice(index, 1); // Remove a foto específica
      onFotosChange(novasFotos); // Atualiza o estado no componente pai
    }
  };

  const fotosRequeridas: Record<IncidenciaTipo, string[]> = {
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

  return (
    <View style={styles.container}>
      {loading && <LoadingSpinner />}
      <Text style={styles.label}>Anexar fotos:</Text>
      {photoDescriptions.map((descricao: string, index: number) => (
        <View key={index} style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.descricao}>
              {fotos[descricao]?.length > 0
                ? `Deseja adicionar mais uma foto do(a) ${descricao}?`
                : `Enviar foto do(a) ${descricao}`}
            </Text>
            {required && !hasPhotos(descricao) && (
              <Text style={styles.requiredText}>*</Text>
            )}
          </View>
          <View style={styles.botoesContainer}>
            <Button onPress={() => takePhoto(descricao)} style={styles.botao}>
              <Image source={require("../../assets/images/photo.png")} style={{ width: 24, height: 24, borderRadius: 5 }} />
            </Button>
            <Button onPress={() => pickPhoto(descricao)} style={styles.botao}>
              <Image source={require("../../assets/images/galeria.png")} style={{ width: 24, height: 24, borderRadius:5, }} />
            </Button>
          </View>
          {fotos[descricao]?.map((foto, fotoIndex) => (
            <View key={fotoIndex} style={styles.fotoContainer}>
              <Image
                source={{ uri: foto.uri }}
                style={[styles.foto, { aspectRatio: foto.aspectRatio }]}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.substituirFotoButton}
                onPress={() => handleRemovePhoto(descricao, fotoIndex)}
              >
                <Text style={styles.substituirFotoTexto}>Remover Foto</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default InputFoto;