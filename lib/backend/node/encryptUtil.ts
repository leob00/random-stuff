//let { downloadFile } = require('./node/downloadFileUtil')

const encryptNative = (text: string) => {
  var crypto = require('crypto')

  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(String('testing key')), iv)
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  }
}

const encrypt = (passPhrase: string, data: string) => {
  var CryptoJS = require('crypto-js')
  //console.log(`file name: ${fileName}`)
  const result = CryptoJS.AES.encrypt(data, passPhrase).toString().toString(16)
  return result
}

const decrypt = (passPhrase: string, data: string) => {
  var CryptoJS = require('crypto-js')
  const bytes = CryptoJS.AES.decrypt(data, passPhrase)
  const result = bytes.toString(CryptoJS.enc.Utf8)
  return result
}
//const enc1 = encryptNative('testing 163563- -88er')
//console.log(enc1)
const toEncrypt = 'hellO World, You silly Goo$$e!'

const encrypted = encrypt('/L0g3ZcqpbaAZEXSMjjFr0mFccn9MNYf/zhcTq9QJNMph9VUN2WmJq9nyCRRqQ=', toEncrypt)
console.log(`encrypted ${toEncrypt}: ${encrypted}`)
const decrypted = decrypt('/L0g3ZcqpbaAZEXSMjjFr0mFccn9MNYf/zhcTq9QJNMph9VUN2WmJq9nyCRRqQ=', encrypted)
console.log(`decrypted: ${decrypted}`)
