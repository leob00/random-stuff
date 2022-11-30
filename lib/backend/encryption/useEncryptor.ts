import CryptoJS from 'crypto-js'
import { LambdaDynamoRequest } from '../api/aws/apiGateway'
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
export function myEncryptDefault(data: string) {
  const result = CryptoJS.AES.encrypt(data, String(process.env.NEXT_PUBLIC_API_TOKEN)).toString()
  return result
}

export function myDecrypt(passPhrase: string, data: string) {
  const bytes = CryptoJS.AES.decrypt(data, passPhrase)
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
  return decryptedData
}

/* export function verifyLambdaDynamoPut(seed: string, encrypted: string) {
  const decrypted = myDecrypt(`${seed}`, encrypted)
  return decrypted
} */
