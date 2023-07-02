var fs = require('fs')
var https = require('https')
// const downloadStocks = (response: any, localFilePath: string, localFilName: string) => {
//   //console.log(`file name: ${fileName}`)
//   var file = fs.createWriteStream(`${localFilePath}`)
//   response.pipe(file)
//   file.on('finish', function () {
//     file.close()
//     console.log(`file downloaded: ${localFilePath}`)
//   })
// }
interface SymbolCompany {
  Symbol: string
  Company: string
}
const getSymbolCompanies = async () => {
  var url = 'https://api.quotelookup.net/api/StockSymbols?apiKey=e9032947cc9f17a7c4c82976f5a1db892485017ecc3aec6832a5fe9e24e6d469'
  https
    .get(url, (res: any) => {
      let body = ''
      res.on('data', (chunk: string) => {
        body += chunk
      })

      res.on('end', () => {
        try {
          let response = JSON.parse(body)
          const records = response.Body as SymbolCompany[]
          console.log(`downloaded ${records.length} companies`)
          fs.writeFile('public/data/symbolCompanies.json', JSON.stringify(response.Body, null, 2), (err: string) => {
            if (err) {
              console.error(err)
            } else {
              console.log('updated: public/data/symbolCompanies.json')
            }
            // file written successfully
          })
          //console.log(response.Body)
          //let file = fs.createWriteStream(`public/data/symbolCompanies.json`)
          //file.write(JSON.stringify(response.body))
          //response.pipe(file)
          // file.on('finish', function () {
          //   file.close()
          //   console.log(`file downloaded: public/data/symbolCompanies.json`)
          // })
          // https
          //   .get(result.message, function (res: any) {
          //     var fileName = result.message.substring(result.message.lastIndexOf('/') + 1)
          //     var filePath = `public/images/randomDogs/${fileName}`
          //     downloadAnimal(res, filePath, fileName)
          //   })
          //   .on('error', function (err: any) {
          //     console.log('Error: ', err.message)
          //   })
        } catch (error: any) {
          console.error(error.message)
        }
      })
    })
    .on('error', (error: any) => {
      console.error(error.message)
    })
}

getSymbolCompanies()
