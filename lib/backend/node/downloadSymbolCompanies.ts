var fs = require('fs')
var https = require('https')
var _ = require('lodash')
var dotenv = require('dotenv')
var numeral = require('numeral')
dotenv.config()
interface SymbolCompany {
  Symbol: string
  Company: string
}
const getSymbolCompanies = async () => {
  var url = `https://api.quotelookup.net/api/StockSymbols?apiKey=${process.env.NEXT_QLN_API_PUBLIC_KEY}`
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
          const ordered = _.orderBy(records, ['Symbol'], ['asc'])
          fs.writeFile('public/data/symbolCompanies.json', JSON.stringify(ordered, null, 2), (err: string) => {
            if (err) {
              console.error(err)
            }
          })
          console.info(`downloaded ${numeral(ordered.length).format('###,###')} symbol quotes`)
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
