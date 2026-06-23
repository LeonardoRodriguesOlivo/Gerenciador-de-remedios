import React, { useEffect, useState } from 'react';

// Componentes e utilitários do React Native.
import {View,Text,StyleSheet,TouchableOpacity,FlatList,Modal,TextInput,KeyboardAvoidingView,Platform,ActivityIndicator,} from 'react-native';


// Componente de item de tarefa (card do remédio).
import Task from '../../components/Task';

// Inicializa autenticação (Firebase) e garante um uid disponível.
import { initFirebaseAuth } from '../../config/firebase';

// Operações no Firestore relacionadas a remédios e entradas de tomada.
import {addMedicine,deleteMedicine,updateMedicineNotificationId,subscribeMedicines,subscribeTodayIntakes,addIntake,addIntakeDeduped,} from '../../services/firebase';

// Agendamento/cancelamento de notificações de lembrete.
import {
  scheduleMedicineNotification,
  cancelMedicineNotification,
} from '../../services/notifications';


// Busca produtos/substâncias na Bulapi.
import { searchProductsByName } from '../../services/bulapi';

// Mapeia categoria regulatória (da Bulapi) para rótulos legíveis no app.

const REGULATORY_CATEGORY_LABELS = {
  reference: 'Referência',
  generic: 'Genérico',
  similar: 'Similar',
};

export default function Lista() {
  // medicines: lista de remédios cadastrados para o usuário.
  // todayIntakes: entradas recentes (tomadas/ esquecimentos) de hoje.
  // userId: uid do usuário (Firebase).
  // loading: controla o estado de carregamento inicial.
  //
  // Observação: todos esses estados são usados para renderizar e decidir ações.

  const [medicines, setMedicines] = useState([]);
  const [todayIntakes, setTodayIntakes] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);

  const [medicineName, setMedicineName] = useState('');
  const [medicineTime, setMedicineTime] = useState('');
  const [medicineDosage, setMedicineDosage] = useState('');
  const [medicineFrequency, setMedicineFrequency] = useState('');
  const [medicinePeriod, setMedicinePeriod] = useState('');
  const [medicineApiDosageInfo, setMedicineApiDosageInfo] = useState('');
  const [medicineSearchResults, setMedicineSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  useEffect(() => {
    let active = true;

    async function prepareAuth() {
      try {
        const user = await initFirebaseAuth();
        if (active) {
          setUserId(user.uid);
        }
      } catch (error) {
        console.warn('Erro ao inicializar usuário:', error);
      }
    }

    prepareAuth();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const unsubscribeMedicines = subscribeMedicines(userId, (items) => {
      setMedicines(items);
      setLoading(false);
    });

    const unsubscribeIntakes = subscribeTodayIntakes(userId, (items) => {
      setTodayIntakes(items);
    });

    return () => {
      unsubscribeMedicines();
      unsubscribeIntakes();
    };
  }, [userId]);

  // Decide se uma tomada foi “no horário” comparando o horário agendado (HH:MM)
  // com o horário real (timestamp ISO). Aqui considera “no horário” se a diferença
  // for de até 30 minutos.
  const isOnTime = (scheduledTime, actualTime) => {
    if (!scheduledTime || !actualTime) return false;

    // Extrai hora e minuto do campo agendado.
    const [hour, minute] = scheduledTime.split(':').map(Number);
    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      return false;
    }

    // Monta um Date para o horário “agendado” no mesmo dia do horário real.
    const actual = new Date(actualTime);
    const scheduled = new Date(actual);
    scheduled.setHours(hour, minute, 0, 0);

    // Calcula diferença em minutos e compara com o limite.
    const diffMinutes =
      Math.abs(actual.getTime() - scheduled.getTime()) / 1000 / 60;
    return diffMinutes <= 30;
  };

  // Marca uma dose como "taken" ou "missed" tanto no estado local quanto no Firestore.
  // Também persiste uma entrada de intake (com deduplicação) para evitar registros duplicados
  // no mesmo dia e status.
  const markMedicineStatus = async (medicine, status) => {
    if (!userId) return;

    const updatedMedicines = medicines.map((item) => {

      if (item.id === medicine.id) {
        return {
          ...item,
          taken: status === 'taken',
          missed: status === 'missed',
        };
      }
      return item;
    });

    setMedicines(updatedMedicines);
    if (selectedMedicine?.id === medicine.id) {
      setSelectedMedicine({
        ...selectedMedicine,
        taken: status === 'taken',
      });
    }

    // Grava uma entrada de "taken" ou "missed" para este remédio.
    await addIntakeDeduped(userId, {
      medicineId: medicine.id,
      medicineName: medicine.name,
      scheduledTime: medicine.time,
      actualTime: new Date().toISOString(),
      status,
    });

  };

  // Realiza busca textual na Bulapi por nome do medicamento.
  // Atualiza loading e armazena os resultados para exibição no modal.
  async function searchMedicineProducts(query) {
    setMedicineName(query);
    if (!query.trim()) {
      // Se a busca estiver vazia, limpa a lista de resultados.
      setMedicineSearchResults([]);
      return;
    }


    setSearchLoading(true);
    try {
      const results = await searchProductsByName(query);
      setMedicineSearchResults(results);
    } catch (error) {
      console.warn('Erro ao buscar Bulapi:', error);
      setMedicineSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }

  // Ao selecionar um produto da lista de resultados da Bulapi,
  // preenche o nome e a informação de substância e encerra a lista.
  const handleSelectProduct = (product) => {
    setMedicineName(product.name || '');
    // informação da Bulapi vai para uma caixa separada
    setMedicineApiDosageInfo(product.substance?.name || '');
    // mantém a dosagem livre para digitação
    setMedicineSearchResults([]);
  };


  // Ao editar manualmente o campo do nome, limpa os resultados
  // para evitar que a lista continue mostrando sugestões de uma busca antiga.
  const handleMedicineNameChange = (value) => {
    setMedicineName(value);
    setMedicineSearchResults([]);
  };

  // Handler do botão de busca: chama a função que pesquisa na Bulapi.
  const handleSearchButton = async () => {
    await searchMedicineProducts(medicineName);
  };

  // Persiste um novo remédio no Firestore e agenda sua notificação.
  // Também atualiza o documento do remédio com o notificationId retornado.
  const handleAddMedicine = async () => {
    if (
      medicineName.trim() === '' ||
      medicineTime.trim() === '' ||
      !userId
    ) {
      // Evita criar/agendar quando campos obrigatórios estão vazios.
      return;
    }


    const medicineData = {
      name: medicineName,
      time: medicineTime,
      dosage: medicineDosage,
      frequency: medicineFrequency,
      period: medicinePeriod,
    };

    const medicineId = await addMedicine(userId, medicineData);
    const notificationId = await scheduleMedicineNotification({
      ...medicineData,
      id: medicineId,
    });

    await updateMedicineNotificationId(userId, medicineId, notificationId);

    setMedicineName('');
    setMedicineTime('');
    setMedicineDosage('');
    setMedicineApiDosageInfo('');
    setMedicineFrequency('');
    setMedicinePeriod('');

    setMedicineSearchResults([]);
    setModalVisible(false);
  };

  // Remove um remédio do Firestore e cancela a notificação agendada associada.
  const removeMedicine = async (id) => {
    const medicine = medicines.find((item) => item.id === id);
    if (medicine?.notificationId) {
      // Cancela o lembrete do dispositivo antes de remover o documento.
      await cancelMedicineNotification(medicine.notificationId);
    }

    await deleteMedicine(userId, id);


    if (selectedMedicine?.id === id) {
      setDetailVisible(false);
      setSelectedMedicine(null);
    }
  };

  // Abre o modal de detalhes do remédio, guardando a seleção atual.
  const openMedicineDetails = (medicine) => {
    setSelectedMedicine(medicine);
    setDetailVisible(true);
  };

  const todayOnTimeCount = todayIntakes.filter(
    (item) => item.status === 'taken' && isOnTime(item.scheduledTime, item.actualTime)
  ).length;
  const totalPlanned = medicines.length;
  const performanceText = totalPlanned
    ? `Tomou ${todayOnTimeCount}/${totalPlanned} no horário certo`
    : 'Cadastre seus remédios para começar';

  // Render principal:
  // - mostra indicador/carregamento;
  // - lista remédios cadastrados;
  // - modal para adicionar novo remédio;
  // - modal para marcar tomada como tomada/esquecida.
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Remédios</Text>
      <Text style={styles.performanceText}>{performanceText}</Text>


      {loading ? (
        <ActivityIndicator size="large" color="#2D9C95" style={styles.loader} />
      ) : medicines.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Você ainda não tem remédios cadastrados.{'\n'}Toque no + para adicionar o primeiro.
          </Text>
        </View>
      ) : (
        <FlatList
          data={medicines}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>

              <TouchableOpacity
                style={styles.taskContainer}
                onPress={() => openMedicineDetails(item)}
                activeOpacity={0.8}
              >
                <Task
                  text={item.name}
                  dosage={item.dosage}
                  time={item.time}
                  checked={item.taken}
          missed={item.missed}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeMedicine(item.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.removeButtonText}>
                  ✕
                </Text>
              </TouchableOpacity>

            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.85}
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
              onChangeText={handleMedicineNameChange}
            />

            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearchButton}
            >
              <Text style={styles.searchButtonText}>
                {searchLoading ? 'Buscando...' : 'Buscar Bulapi'}
              </Text>
            </TouchableOpacity>

            {medicineSearchResults.length > 0 && (
              <FlatList
                data={medicineSearchResults}
                keyExtractor={(product) => String(product.id)}
                style={styles.searchResults}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                renderItem={({ item: product }) => (
                  <TouchableOpacity
                    style={styles.searchResultItem}
                    onPress={() => handleSelectProduct(product)}
                  >
                    <Text style={styles.searchResultText}>{product.name}</Text>
                    <Text style={styles.searchResultSubtext}>
                      {[
                        product.substance?.name,
                        product.manufacturer?.name,
                        REGULATORY_CATEGORY_LABELS[product.regulatory_category],
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}

            <TextInput
              placeholder="Horário (Ex: 08:00)"
              style={styles.input}
              value={medicineTime}
              onChangeText={setMedicineTime}
            />

            <TextInput
              placeholder="Periodo(Ex: 2 mêses)"
              style={styles.input}
              value={medicinePeriod}
              onChangeText={setMedicinePeriod}
            />

            <TextInput
              placeholder="Frequencia (Ex: duas vezes ao dia)"
              style={styles.input}
              value={medicineFrequency}
              onChangeText={setMedicineFrequency}
            />

            <TextInput
              placeholder="Substância (da Bulapi)"
              style={styles.input}
              value={medicineApiDosageInfo}
              editable={false}
            />

            <TextInput
              placeholder="Dosagem (Ex: 500ml)"
              style={styles.input}
              value={medicineDosage}
              onChangeText={setMedicineDosage}
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

      <Modal
        visible={detailVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>
              Informações do Remédio
            </Text>

            {selectedMedicine && (
              <>
                <Text style={styles.detailText}>
                  Nome: {selectedMedicine.name}
                </Text>

                <Text style={styles.detailText}>
                  Horário: {selectedMedicine.time}
                </Text>

                <Text style={styles.detailText}>
                  Periodo: {selectedMedicine.period}
                </Text>

                <Text style={styles.detailText}>
                  Dosagem: {selectedMedicine.dosage}
                </Text>

                <Text style={styles.detailText}>
                  Frequencia: {selectedMedicine.frequency}
                </Text>

                <Text style={styles.detailText}>
                  {selectedMedicine.taken
                    ? 'Tomado'
                    : 'Pendente'}
                </Text>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => markMedicineStatus(selectedMedicine, 'taken')}
                >
                  <Text style={styles.saveButtonText}>
                    Marcar como Tomado
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.saveButton, styles.missedButton]}
                  onPress={() => markMedicineStatus(selectedMedicine, 'missed')}
                >
                  <Text style={styles.saveButtonText}>
                    Marcar como Esqueci
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              onPress={() => setDetailVisible(false)}
            >
              <Text style={styles.cancelText}>
                Fechar
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const PRIMARY = '#2D9C95';
const PRIMARY_LIGHT = '#E6F5F3';
const DARK = '#1F2937';
const DANGER = '#EF4444';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FB',
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: DARK,
    textAlign: 'center',
  },

  performanceText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 26,
  },

  loader: {
    marginTop: 60,
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },

  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },

  listContent: {
    paddingBottom: 110,
  },

  cardContainer: {
    position: 'relative',
    marginBottom: 14,
  },

  taskContainer: {
    marginRight: 55,
  },

  removeButton: {
    position: 'absolute',
    right: 0,
    top: 14,
    width: 38,
    height: 38,
    backgroundColor: '#FFF',
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  removeButtonText: {
    color: DANGER,
    fontWeight: '700',
    fontSize: 15,
  },

  button: {
    position: 'absolute',
    bottom: 36,
    right: 24,
    width: 64,
    height: 64,
    backgroundColor: PRIMARY,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: '600',
    marginTop: -2,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.55)',
    padding: 20,
  },

  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 12,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: DARK,
    marginBottom: 20,
  },

  detailText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 14,
  },

  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 15,
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
    fontSize: 15,
    color: DARK,
  },

  saveButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,

    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  missedButton: {
    backgroundColor: '#9CA3AF',
    shadowColor: '#9CA3AF',
  },

  saveButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },

  cancelText: {
    textAlign: 'center',
    marginTop: 16,
    color: DANGER,
    fontWeight: '600',
  },

  searchButton: {
    backgroundColor: PRIMARY_LIGHT,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#BFE5E1',
  },

  searchButtonText: {
    color: PRIMARY,
    fontWeight: '700',
    fontSize: 14,
  },

  searchResults: {
    height: 220,
    marginBottom: 14,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  searchResultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  searchResultText: {
    fontSize: 15,
    fontWeight: '600',
    color: DARK,
  },

  searchResultSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});


