import {collection,getDocs,addDoc,updateDoc,deleteDoc,doc,serverTimestamp,query,where,orderBy,onSnapshot,} from 'firebase/firestore';

// auth: autenticação do firebase
// database: instância do Firestore
// getAppUserId: retorna UID (Firebase ou local fallback)
import { auth, database, getAppUserId } from '../config/firebase';


// Adiciona um remédio no subdocumento users/{userId}/medicines.
// Retorna o id do documento criado (para anexar notificationId depois).
export async function addMedicine(userId, medicine) {
  const medicinesRef = collection(database, 'users', userId, 'medicines');
  const docRef = await addDoc(medicinesRef, {
    ...medicine,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}


// Atualiza o documento do remédio com o id da notificação agendada no dispositivo.
export async function updateMedicineNotificationId(userId, medicineId, notificationId) {
  const medicineDoc = doc(database, 'users', userId, 'medicines', medicineId);
  await updateDoc(medicineDoc, { notificationId });
}


// Remove um remédio do subdocumento users/{userId}/medicines.
export async function deleteMedicine(userId, medicineId) {
  const medicineDoc = doc(database, 'users', userId, 'medicines', medicineId);
  await deleteDoc(medicineDoc);
}


// Cria uma entrada de “intake” (tomada/esquecimento) em users/{userId}/intakes.
export async function addIntake(userId, intake) {
  const intakesRef = collection(database, 'users', userId, 'intakes');
  await addDoc(intakesRef, {
    ...intake,
    createdAt: serverTimestamp(),
  });
}


// Evita criação duplicada de intake (ex: usuário clicou várias vezes em "Tomado"/"Esqueci").
// Regra: mesmo medicineId + mesmo status no mesmo dia.
export async function addIntakeDeduped(userId, intake) {

  const intakesRef = collection(database, 'users', userId, 'intakes');

  const { medicineId, status, actualTime } = intake || {};
  if (!medicineId || !status) {
    // se faltar chave de dedupe, cai no comportamento antigo
    return addIntake(userId, intake);
  }

  const date = actualTime ? new Date(actualTime) : new Date();
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  // Busca registros do dia para aquele medicineId e status.
  const q = query(
    intakesRef,
    where('medicineId', '==', medicineId),
    where('status', '==', status),
    where('createdAt', '>=', dayStart),
    where('createdAt', '<=', dayEnd),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return; // já existe: não cria outro
  }

  await addDoc(intakesRef, {
    ...intake,
    createdAt: serverTimestamp(),
  });
}


// Mantém em tempo real a lista de remédios do usuário.
// callback recebe um array já “normalizado” com campos necessários para a UI.
export function subscribeMedicines(userId, callback) {
  const medicinesRef = collection(database, 'users', userId, 'medicines');
  const unsubscribe = onSnapshot(medicinesRef, (snapshot) => {
    const medicines = snapshot.docs.map((docItem) => {
      const data = docItem.data();
      return {
        id: docItem.id,
        name: data.name,
        time: data.time,
        dosage: data.dosage || '',
        frequency: data.frequency || '',
        period: data.period || '',
        notificationId: data.notificationId || null,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
      };
    });
    callback(medicines);
  });
  return unsubscribe;
}


// Mantém em tempo real as entradas de intake “de hoje” (desde 00:00 até agora).
export function subscribeTodayIntakes(userId, callback) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const intakesRef = collection(database, 'users', userId, 'intakes');
  const q = query(intakesRef, where('createdAt', '>=', todayStart), orderBy('createdAt', 'desc'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const intakes = snapshot.docs.map((docItem) => {
      const data = docItem.data();
      return {
        id: docItem.id,
        medicineId: data.medicineId,
        medicineName: data.medicineName,
        scheduledTime: data.scheduledTime,
        actualTime: data.actualTime,
        status: data.status,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
      };
    });
    callback(intakes);
  });
  return unsubscribe;
}


// Busca, de uma vez, intakes recentes desde `sinceDate` (usado no resumo/histórico).
export async function getRecentIntakes(userId, sinceDate) {
  const intakesRef = collection(database, 'users', userId, 'intakes');
  const q = query(intakesRef, where('createdAt', '>=', sinceDate), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docItem) => {
    const data = docItem.data();
    return {
      id: docItem.id,
      medicineId: data.medicineId,
      medicineName: data.medicineName,
      scheduledTime: data.scheduledTime,
      actualTime: data.actualTime,
      status: data.status,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
    };
  });
}


// Converte a resposta da notificação em uma entrada de intake.
// `data` vem do payload customizado da notificação.
export async function addIntakeForNotification(data, action) {
  const userId = auth.currentUser?.uid || (await getAppUserId());
  if (!userId) return;

  const actualTime = new Date().toISOString();
  const status = action === 'TAKEN' ? 'taken' : 'missed';


  // Garante campos mínimos sempre que vier da notificação
  const medicineName = data?.medicineName || (data?.medicineId ? 'Remédio' : '') || 'Remédio';
  const medicineId = data?.medicineId || null;

  await addIntake(userId, {
    medicineId,
    medicineName,
    scheduledTime: data?.scheduledTime || '',
    actualTime,
    status,
  });
}
