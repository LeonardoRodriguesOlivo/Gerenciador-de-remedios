import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_ID_KEY = '@mobile2_user_id';

export async function getStoredUserId() {
  try {
    return await AsyncStorage.getItem(USER_ID_KEY);
  } catch {
    return null;
  }
}

export async function setStoredUserId(userId) {
  try {
    await AsyncStorage.setItem(USER_ID_KEY, userId);
  } catch {
    // ignore write errors
  }
}

function makeLocalUserId() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function getOrCreateLocalUserId() {
  const existing = await getStoredUserId();
  if (existing) {
    return existing;
  }

  const newId = makeLocalUserId();
  await setStoredUserId(newId);
  return newId;
}
