function downloadFile(response: any, localFilePath: string) {
  var fs = require('fs')
  var https = require('https')
  var file = fs.createWriteStream(`${localFilePath}`)
  response.pipe(file)
  file.on('finish', function () {
    file.close()
    console.log(`file downloaded: ${localFilePath}`)
  })
}
/* module.exports = {
  downloadFile,
}
export type { downloadFile } */
module.exports = downloadFile
export {}
