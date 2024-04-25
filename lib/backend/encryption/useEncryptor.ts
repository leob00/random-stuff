import CryptoJS from 'crypto-js'
import { apiConnection } from '../api/config'
const config = apiConnection().internal
export const useEncryptor = () => {
  return {
    encrypt: (passPhrase: string, data: string) => {
      const result = CryptoJS.AES.encrypt(data, passPhrase).toString()
      return result
    },
    decrypt: (passPhrase: string, data: string) => {
      const bytes = CryptoJS.AES.decrypt(data, passPhrase)
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
      return decryptedData
    },
  }
}

export function myEncrypt(passPhrase: string, data: string) {
  const result = CryptoJS.AES.encrypt(data, passPhrase).toString()
  return result
}

export function myEncryptBase64(passPhrase: string, data: string) {
  const result = CryptoJS.AES.encrypt(data, passPhrase, CryptoJS.enc.Base64url).toString()
  return result
}

const encryptKeys = new Map<string, string>()

export function weakEncrypt(data: string) {
  if (!encryptKeys.has(data)) {
    const result = CryptoJS.AES.encrypt(data, config.key, CryptoJS.enc.Utf8).toString()
    encryptKeys.set(data, result)
    return result
  } else {
    return encryptKeys.get(data)!
  }
}
export function weakDecrypt(data: string) {
  const bytes = CryptoJS.AES.decrypt(data, config.key)
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
  return decryptedData
}

export function myDecrypt(passPhrase: string, data: string) {
  try {
    const bytes = CryptoJS.AES.decrypt(data, passPhrase)
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
    return decryptedData
  } catch (error) {
    console.error('decrypt error: ', error)
    return ''
  }
}
export function myDecryptBase64(passPhrase: string, data: string) {
  const bytes = CryptoJS.AES.decrypt(data, passPhrase)
  const decryptedData = bytes.toString(CryptoJS.enc.Base64url)
  return decryptedData
}
export function getGuid() {
  return crypto.randomUUID()
}

/* export function verifyLambdaDynamoPut(seed: string, encrypted: string) {
  const decrypted = myDecrypt(`${seed}`, encrypted)
  return decrypted
} */
