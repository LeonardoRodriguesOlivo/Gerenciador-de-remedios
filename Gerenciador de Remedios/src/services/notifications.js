import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// shouldShowAlert foi descontinuado pelo expo-notifications; o substituto
// é especificar shouldShowBanner (notificação flutuante) e shouldShowList
// (aparece na central de notificações). Sem isso, em versões recentes da
// lib o conteúdo da notificação pode não ser exibido corretamente.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function initializeNotifications() {
  if (Platform.OS === 'web') {
    return;
  }

  const permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted && permission.ios?.status !== Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('medicine-reminders', {
      name: 'Lembretes de remédio',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  // Nota: no Android, os botões de ação de categoria (Tomei/Esqueci) podem
  // não aparecer de forma confiável em algumas versões/dispositivos — é uma
  // limitação conhecida do expo-notifications no Android, não um bug deste
  // app. Tocar na notificação sempre abre o app normalmente como fallback.
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

export async function scheduleMedicineNotification(medicine) {
  const [hourString, minuteString] = medicine.time?.split(':') || [];
  const hour = Number(hourString);
  const minute = Number(minuteString);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return null;
  }

  // O trigger agora exige um "type" explícito (SchedulableTriggerInputTypes).
  // DAILY repete todo dia no horário informado — equivalente ao antigo
  // formato implícito { hour, minute, repeats: true }.
  const trigger = {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour,
    minute,
    repeats: true,
  };

  const notificationId = await Notifications.scheduleNotificationAsync({
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

export async function cancelMedicineNotification(notificationId) {
  if (!notificationId) {
    return;
  }
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.warn('Erro ao cancelar notificação:', error);
  }
}

export function addNotificationResponseListener(listener) {
  return Notifications.addNotificationResponseReceivedListener(listener);
}
