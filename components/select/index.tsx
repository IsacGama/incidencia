import React from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { styles } from "./styles";


// Define os tipos possíveis de incidência
export enum IncidenciaTipo {
  ROUBO = "Roubo",
  ACIDENTE = "Acidente",
  VANDALISMO = "Vandalismo",
  OUTRO = "Outro",
}

// Define as props que o componente recebe
interface TipoIncidenciaSelectorProps {
  selectedType: IncidenciaTipo;
  onSelectType: (tipo: IncidenciaTipo) => void;
}

const TipoIncidenciaSelector: React.FC<TipoIncidenciaSelectorProps> = ({
  selectedType,
  onSelectType,
}) => {
  return (
    <View>
      <Text style = {[styles.title]}>Escolha o tipo de incidência</Text>
      <View style={[styles.pickerContainer]}>
        <Picker
          selectedValue={selectedType}
          onValueChange={(itemValue) => onSelectType(itemValue as IncidenciaTipo)}
          style={styles.picker}
          mode="dropdown"
        >
          {Object.values(IncidenciaTipo).map((tipo) => (
            <Picker.Item key={tipo} label={tipo} value={tipo} />
          ))}
        </Picker>
      </View>
    </View>

  );
};

export default TipoIncidenciaSelector;
