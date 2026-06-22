import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';

import { auth, database, getAppUserId } from '../config/firebase';

export async function addMedicine(userId, medicine) {
  const medicinesRef = collection(database, 'users', userId, 'medicines');
  const docRef = await addDoc(medicinesRef, {
    ...medicine,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateMedicineNotificationId(userId, medicineId, notificationId) {
  const medicineDoc = doc(database, 'users', userId, 'medicines', medicineId);
  await updateDoc(medicineDoc, { notificationId });
}

export async function deleteMedicine(userId, medicineId) {
  const medicineDoc = doc(database, 'users', userId, 'medicines', medicineId);
  await deleteDoc(medicineDoc);
}

export async function addIntake(userId, intake) {
  const intakesRef = collection(database, 'users', userId, 'intakes');
  await addDoc(intakesRef, {
    ...intake,
    createdAt: serverTimestamp(),
  });
}

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

export async function addIntakeForNotification(data, action) {
  const userId = auth.currentUser?.uid || (await getAppUserId());
  if (!userId) return;

  const actualTime = new Date().toISOString();
  const status = action === 'TAKEN' ? 'taken' : 'missed';

  await addIntake(userId, {
    medicineId: data.medicineId || null,
    medicineName: data.medicineName || 'Remédio',
    scheduledTime: data.scheduledTime || '',
    actualTime,
    status,
  });
}
