// function to return encrypted text that is in base64
import crypto from 'crypto'

export function encrypt(text: string) {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(String(process.env.NEXT_PUBLIC_APP_ID)), iv)
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  }
}
