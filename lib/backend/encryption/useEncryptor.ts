import CryptoJS from 'crypto-js'
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

export function weakEncrypt(data: string) {
  const result = CryptoJS.AES.encrypt(data, String(process.env.NEXT_PUBLIC_API_TOKEN), CryptoJS.enc.Utf8).toString()
  return result
}
export function weakDecrypt(data: string) {
  const bytes = CryptoJS.AES.decrypt(data, String(process.env.NEXT_PUBLIC_API_TOKEN))
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
  return decryptedData
}

export function myDecrypt(passPhrase: string, data: string) {
  const bytes = CryptoJS.AES.decrypt(data, passPhrase)
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
  return decryptedData
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
