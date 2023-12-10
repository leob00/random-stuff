var fs = require('fs')
var https = require('https')
var _ = require('lodash')

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
          const ordered = _.orderBy(records, ['Sumbol'], ['asc'])
          fs.writeFile('public/data/symbolCompanies.json', JSON.stringify(ordered, null, 2), (err: string) => {
            if (err) {
              console.error(err)
            }
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

getSymbolCompanies().then(() => {
  return 0
})
