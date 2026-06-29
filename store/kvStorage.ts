import { createMMKV, type MMKV } from 'react-native-mmkv'
import * as SecureStore from 'expo-secure-store'

export interface KVStorage {
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
  removeItem(key: string): Promise<void>
}

const ENCRYPTION_KEY_NAME = 'fin_mmkv_key'

async function getOrCreateEncryptionKey(): Promise<string> {
  let key = await SecureStore.getItemAsync(ENCRYPTION_KEY_NAME)
  if (!key) {
    key = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
    await SecureStore.setItemAsync(ENCRYPTION_KEY_NAME, key)
  }
  return key
}

let _storage: MMKV | null = null

async function getStorage(): Promise<MMKV> {
  if (_storage) return _storage
  const encryptionKey = await getOrCreateEncryptionKey()
  _storage = createMMKV({ id: 'fin-store', encryptionKey })
  return _storage
}

export const mmkvStorage: KVStorage = {
  async getItem(key) {
    const s = await getStorage()
    return s.getString(key) ?? null
  },
  async setItem(key, value) {
    const s = await getStorage()
    s.set(key, value)
  },
  async removeItem(key) {
    const s = await getStorage()
    s.remove(key)
  },
}
