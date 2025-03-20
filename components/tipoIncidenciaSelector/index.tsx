import React from "react";
import { View, Text, Image } from "react-native";
import CustomSelect from "../customSelect";
import { styles } from "./styles";

// Define os tipos possíveis de incidência
export enum IncidenciaTipo {
  SERVIÇO_IMPRODUTIVO = "Serviço Improdutivo",
  REPOSIÇÃO_DE_ELO = "Reposição de Elo",
  CONEXÃO_NO_POSTE_RAMAL_UC_CAIXA_DERIVAÇÃO = "Conexão no Poste,\nRamal da UC e na Caixa de Derivação",
  SUBSTITUIÇÃO_DE_NH_ACIONAMENTO_CD_TRAFO = "Substituição de NH,\nAcionamento do CD ou Trafo",
  INSTALAÇÃO_DE_RAMAL_UC = "Instalação ou Substituição\ndo Ramal da UC",
  RETIRADA_DE_RAMAL_UC = "Retirada ou Desativação\ndo Ramal da UC",
  PODA_NA_BT = "Poda na BT",
  PODA_NA_MT = "Poda na MT",
  CORTE_DE_ÁRVORE = "Corte de Árvore",
  CONEXÃO_NO_MEDIDOR = "Conexão no Medidor",
  SERVIÇO_NO_MEDIDOR_E_POSTE = "Serviço no Medidor\ndo Cliente e no Poste",
  RETIRADA_DE_OBJETOS_ESTRANHOS = "Retirada de Objetos Estranhos",
  INSTALAÇÃO_DE_ESPAÇADOR = "Instalação de Espaçador",
  JUMP_NA_BT = "Jump na BT",
  JUMP_NA_MT = "Jump na MT",
  MANOBRA_DE_CHAVE = "Manobra de Chave",
  ELEVAÇÃO_DO_TAP_MANOBRA = "Elevação do Tap\nmais uma Manobra",
  TENSIONAMENTO_NA_REDE_BT_MT = "Tensionamento na Rede\nBT ou MT",
  EMENDA_NA_MT = "Emenda na MT",
  EMENDA_NA_BT = "Emenda na BT",
  INSPEÇÃO_NA_BA_DT = "Inspeção Realizada na BA\nou DT a Pedido da ENEL",
  LEITURA_DE_TRAFO = "Leitura de Trafo",
  TENSIONAMENTO_DE_RAMAL = "Tensionamento de Ramal",
  TEMPO_DE_ESPERA_POR_SOLICITAÇÃO_ENEL = "Tempo de Espera por\nSolicitação da ENEL",
  SUBSTITUIÇÃO_DE_CABO_BT_MT = "Substituição de Cabo\nBT ou MT",
  SUBSTITUIÇÃO_DE_TRAFO = "Substituição de Trafo",
}

// Define as props que o componente recebe
interface TipoIncidenciaSelectorProps {
    selectedType: IncidenciaTipo | null;
    onSelectType: (tipo: IncidenciaTipo) => void;
  }

  const TipoIncidenciaSelector: React.FC<TipoIncidenciaSelectorProps> = ({
    selectedType,
    onSelectType,
  }) => {
    // Converte o enum em um array de opções para o CustomSelect
    const options = Object.values(IncidenciaTipo).map((tipo) => ({
      label: tipo,
      value: tipo,
    }));
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Escolha o tipo de incidência</Text>
        {!selectedType && <Text style={styles.errorText}>Selecione um tipo de incidência</Text>}
        <CustomSelect
          options={options}
          selectedValue={selectedType || ""}
          onSelect={(value) => onSelectType(value as IncidenciaTipo)}
          placeholder="Selecione uma opção"
          imageSource={require("../../assets/images/seta-baixo.png")}
        />
      </View>
    );
  };
  
  export default TipoIncidenciaSelector;