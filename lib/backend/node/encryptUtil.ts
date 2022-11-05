//let { downloadFile } = require('./node/downloadFileUtil')

const encrypt = (passPhrase: string, data: string) => {
  var CryptoJS = require('crypto-js')
  //console.log(`file name: ${fileName}`)
  const result = CryptoJS.AES.encrypt(data, passPhrase).toString()
  return result
}

const decrypt = (passPhrase: string, data: string) => {
  var CryptoJS = require('crypto-js')
  const bytes = CryptoJS.AES.decrypt(data, passPhrase)
  const result = bytes.toString(CryptoJS.enc.Utf8)
  return result
}

const encrypted = encrypt('loco live is one of the greatest live albums of all time', 'hello world!')
console.log(`encrypted: ${encrypted}`)
const decrypted = decrypt('loco live is one of the greatest live albums of all time', encrypted)
console.log(`decrypted: ${decrypted}`)
