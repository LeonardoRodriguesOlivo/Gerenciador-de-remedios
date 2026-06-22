import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import Task from '../../components/Task';

export default function Teste() {
  const [medicines, setMedicines] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);

  const [medicineName, setMedicineName] = useState('');
  const [medicineTime, setMedicineTime] = useState('');

  const handleAddMedicine = () => {
    if (
      medicineName.trim() === '' ||
      medicineTime.trim() === ''
    )
      return;

    const newMedicine = {
      id: Date.now().toString(),
      name: medicineName,
      taken: false,
      // dosage: '500mg',
      time: medicineTime,
    };

    setMedicines([...medicines, newMedicine]);

    setMedicineName('');
    setMedicineTime('');
    setModalVisible(false);
  };

  const toggleMedicine = (id) => {
    const updatedMedicines = medicines.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          taken: !item.taken,
        };
      }

      return item;
    });

    setMedicines(updatedMedicines);
  };

  const removeMedicine = (id) => {
    const filteredMedicines = medicines.filter(
      (item) => item.id !== id
    );

    setMedicines(filteredMedicines);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TESTE</Text>

      <FlatList
        data={medicines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            
            <TouchableOpacity
              style={styles.taskContainer}
              onPress={() => toggleMedicine(item.id)}
            >
              <Task
                text={item.name}
                dosage={item.dosage}
                time={item.time}
                checked={item.taken}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeMedicine(item.id)}
            >
              <Text style={styles.removeButtonText}>
                X
              </Text>
            </TouchableOpacity>

          </View>
        )}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Novo Remédio
            </Text>

            <TextInput
              placeholder="Nome do remédio"
              style={styles.input}
              value={medicineName}
              onChangeText={setMedicineName}
            />

            <TextInput
              placeholder="Horário (Ex: 08:00)"
              style={styles.input}
              value={medicineTime}
              onChangeText={setMedicineTime}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddMedicine}
            >
              <Text style={styles.saveButtonText}>
                Salvar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>
                Cancelar
              </Text>
            </TouchableOpacity>

          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },

  cardContainer: {
    position: 'relative',
    marginBottom: 15,
  },

  taskContainer: {
    marginRight: 55,
  },

  removeButton: {
    position: 'absolute',
    right: 0,
    top: 18,
    width: 40,
    height: 40,
    backgroundColor: '#FF4D4D',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  removeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

  button: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    width: 70,
    height: 70,
    backgroundColor: '#4A90E2',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: 'bold',
  },

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

  modalTitle: {
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
    backgroundColor: '#FFF',
  },

  saveButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  cancelText: {
    textAlign: 'center',
    marginTop: 15,
    color: 'red',
  },
});


