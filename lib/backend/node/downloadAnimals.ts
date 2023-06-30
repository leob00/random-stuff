var fs = require('fs')
var https = require('https')
const downloadAnimal = (response: any, localFilePath: string, localFilName: string) => {
  //console.log(`file name: ${fileName}`)
  var file = fs.createWriteStream(`${localFilePath}`)
  response.pipe(file)
  file.on('finish', function () {
    file.close()
    console.log(`file downloaded: ${localFilePath}`)
  })
}

const getRandomDog = async () => {
  var url = 'https://dog.ceo/api/breeds/image/random'
  https
    .get(url, (res: any) => {
      let body = ''
      res.on('data', (chunk: string) => {
        body += chunk
      })

      res.on('end', () => {
        try {
          let result = JSON.parse(body)
          https
            .get(result.message, function (res: any) {
              var fileName = result.message.substring(result.message.lastIndexOf('/') + 1)
              var filePath = `public/images/randomDogs/${fileName}`
              downloadAnimal(res, filePath, fileName)
            })
            .on('error', function (err: any) {
              console.log('Error: ', err.message)
            })
        } catch (error: any) {
          console.error(error.message)
        }
      })
    })
    .on('error', (error: any) => {
      console.error(error.message)
    })
}

const getRandomCat = async () => {
  var url = 'https://api.thecatapi.com/v1/images/search'
  https
    .get(url, (res: any) => {
      let body = ''
      res.on('data', (chunk: string) => {
        body += chunk
      })

      res.on('end', () => {
        try {
          let result = JSON.parse(body) as any[]
          https
            .get(result[0].url, function (res: any) {
              var fileName = result[0].url.substring(result[0].url.lastIndexOf('/') + 1)
              var filePath = `public/images/randomCats/${fileName}`
              downloadAnimal(res, filePath, fileName)
            })
            .on('error', function (err: any) {
              console.log('Error: ', err.message)
            })
        } catch (error: any) {
          console.error(error.message)
        }
      })
    })
    .on('error', (error: any) => {
      console.error(error.message)
    })
}

getRandomDog()
getRandomCat()
