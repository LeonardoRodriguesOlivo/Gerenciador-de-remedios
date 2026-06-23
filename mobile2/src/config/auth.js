import AsyncStorage from '@react-native-async-storage/async-storage';

// Chave utilizada para persistir o identificador local do usuário.
const USER_ID_KEY = '@mobile2_user_id';


// Lê o userId local (se existir) do armazenamento persistente.
export async function getStoredUserId() {
  try {
    return await AsyncStorage.getItem(USER_ID_KEY);
  } catch {
    // Em caso de erro de leitura, assume que não há userId salvo.
    return null;
  }
}


// Persiste o userId local para que o usuário continue identificado
// entre reinícios do app.
export async function setStoredUserId(userId) {
  try {
    await AsyncStorage.setItem(USER_ID_KEY, userId);
  } catch {
    // Ignora erros de escrita (não deve quebrar o fluxo do app).
  }
}


// Gera um identificador “local” único (para fallback quando auth anônimo falha).
function makeLocalUserId() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// Recupera o userId local existente ou cria um novo e persiste.
export async function getOrCreateLocalUserId() {
  const existing = await getStoredUserId();
  if (existing) {
    return existing;
  }


  const newId = makeLocalUserId();
  await setStoredUserId(newId);
  return newId;
}
