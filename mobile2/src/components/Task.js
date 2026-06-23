
import React from 'react';

import {View,Text,StyleSheet,} from 'react-native';

// Componente visual do item de remédio (card), controlando estilos por status.
export default function Task({
  text,
  dosage,
  time,
  checked,
  missed,
}) {
  // normaliza “missed” para boolean.
  const isMissed = Boolean(missed);


  return (
  // Container principal do item (cada remédio da lista)
  <View style={styles.item}>

    <View style={styles.left}>

      {/* Checkbox visual que indica se o item foi concluído ou não */}
      <View
        style={[
          styles.checkbox,

          // Se "checked" for true, aplica o estilo de checkbox marcado
          checked && styles.checked,
        ]}
      />

      {/* Área principal de conteúdo do item (texto do remédio) */}
      <View style={styles.content}>

        {/* Cabeçalho com nome do remédio e horário */}
        <View style={styles.header}>

          {/* Nome do medicamento */}
          <Text
            style={[
              styles.title,

              // Se o item foi concluído, aplica estilo de texto riscado ou finalizado
              checked && styles.completed,

              // Se o remédio foi marcado como "esquecido", aplica estilo de alerta
              isMissed && styles.missedTitle,
            ]}
          >
            {text}
          </Text>

          <Text
            style={[
              styles.time,

              // Estilo para horário quando o item já foi concluído
              checked && styles.timeCompleted,

              // Estilo para horário quando o medicamento foi esquecido
              isMissed && styles.missedTime,
            ]}
          >
            {time}
          </Text>

        </View>

        <Text style={styles.subtitle}>
          {dosage}
        </Text>

      </View>
    </View>
  </View>
);
}

const PRIMARY = '#2D9C95';
const DARK = '#1F2937';

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 18,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 26,
    height: 26,
    borderWidth: 2,
    borderColor: PRIMARY,
    borderRadius: 13,
    marginRight: 15,
  },

  checked: {
    backgroundColor: PRIMARY,
  },

  content: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 17,
    fontWeight: '700',
    color: DARK,
    flex: 1,
  },

  time: {
    fontSize: 13,
    fontWeight: '700',
    color: PRIMARY,
    marginLeft: 10,
    backgroundColor: '#E6F5F3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },

  completed: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },

  missedTitle: {
    textDecorationLine: 'line-through',
    color: '#EF4444',
  },

  missedTime: {
    backgroundColor: '#FEE2E2',
    color: '#EF4444',
  },

  timeCompleted: {
    color: PRIMARY,
  },

  subtitle: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 4,
  },
});