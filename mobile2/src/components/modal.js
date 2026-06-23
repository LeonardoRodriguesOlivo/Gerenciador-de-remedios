import React, { useState } from 'react';

import {Modal,View,Text,StyleSheet,TextInput,TouchableOpacity,KeyboardAvoidingView,Platform,} from 'react-native';

// Modal reutilizável para inserir nome de um novo remédio.
export default function AddMedicineModal({
  visible,
  onClose,
  onAdd,
}) {
  // Campo controlado do nome do remédio.
  const [medicineName, setMedicineName] = useState('');


  const handleSave = () => {
    if (medicineName.trim() === '') return;

    onAdd(medicineName);

    setMedicineName('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <KeyboardAvoidingView //serve para o teclado não atrapalhar a visualização
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={styles.title}>
            Novo Remédio
          </Text>

          <TextInput
            placeholder="Nome do remédio"
            style={styles.input}
            value={medicineName}
            onChangeText={setMedicineName}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveText}>
              Salvar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },

  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },

  saveButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  saveText: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  cancelText: {
    textAlign: 'center',
    marginTop: 15,
    color: 'red',
  },
});

