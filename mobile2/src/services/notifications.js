import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Configura o comportamento das notificações quando elas forem recebidas pelo aplicativo
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // Função chamada sempre que uma notificação chega ao dispositivo


    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Solicita permissões e configura categorias/canais para notificações de remédios.
export async function initializeNotifications() {
  if (Platform.OS === 'web') {
    return;
  }

  // Solicita permissão do usuário para que o aplicativo possa enviar notificações
  const permission = await Notifications.requestPermissionsAsync();

  // Verifica se a permissão foi concedida. Caso o usuário negue a permissão e também não esteja usando a permissão provisória do iOS, a função é encerrada e nenhuma notificação será criada
  if (!permission.granted && permission.ios?.status !== Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return;
  }

  // Verifica se o sistema operacional é Android. No Android é necessário criar um "Notification Channel" para organizar as notificações
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('medicine-reminders', {
      name: 'Lembretes de remédio',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
    });
  }

// Cria uma categoria de notificação chamada "MEDICINE_REMINDER" que serve para adicionar botões de ação diretamente na notificação
  await Notifications.setNotificationCategoryAsync('MEDICINE_REMINDER', [
    {
      identifier: 'TAKEN',
      buttonTitle: 'Tomei',
      options: { opensAppToForeground: true },
    },
    {
      identifier: 'MISSED',
      buttonTitle: 'Esqueci',
      options: { opensAppToForeground: true },
    },
  ]);
}

// Função responsável por agendar uma notificação para um medicamento específico
export async function scheduleMedicineNotification(medicine) {
  const [hourString, minuteString] = medicine.time?.split(':') || []; // Separa o horário do medicamento em hora e minuto
  const hour = Number(hourString);
  const minute = Number(minuteString);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return null;
  }

  // O trigger agora exige um "type" explícito (SchedulableTriggerInputTypes).
  // DAILY repete todo dia no horário informado — equivalente ao antigo
  const trigger = {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour,
    minute,
    repeats: true,
  };

  // Cria e agenda uma nova notificação no dispositivo utilizando o sistema de notificações
  const notificationId = await Notifications.scheduleNotificationAsync({
    // Define as informações que serão exibidas na notificação
    content: {
      title: `Hora do remédio: ${medicine.name}`,
      body: `Toque para marcar se você já tomou ou esqueceu.`,
      sound: 'default',
      categoryIdentifier: 'MEDICINE_REMINDER',
      data: {
        medicineId: medicine.id,
        medicineName: medicine.name,
        scheduledTime: medicine.time,
      },
    },
    trigger,
  });

  return notificationId;
}

// Função assíncrona responsável por cancelar uma notificação de medicamento agendada
export async function cancelMedicineNotification(notificationId) {

  // Verifica se existe um ID de notificação válido e se não tiver ID de notificação a função é encerrada
  if (!notificationId) {
    return;
  }
  try {
    // A notificação deixa de aparecer no horário programado
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {

    // Caso aconteça algum erro durante o cancelamento,
    // exibe uma mensagem de aviso no console com o erro ocorrido
    console.warn('Erro ao cancelar notificação:', error);
  }
}

// Exporta uma função responsável por criar um listener de resposta das notificações
// Esse listener detecta quando o usuário interage com uma notificação
export function addNotificationResponseListener(listener) {
  return Notifications.addNotificationResponseReceivedListener(listener);
}
