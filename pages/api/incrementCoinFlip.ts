import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllBlogs as getBogCollection } from 'lib/backend/api/contenfulApi'
import { BlogCollection } from 'lib/models/cms/contentful/blog'
import { CoinFlipStats, getCoinflipStats, getRandomStuff, putCoinflipStats, putRandomStuff } from 'lib/backend/api/aws/apiGateway'
import { Coin } from 'components/Organizms/CoinFlipLayout'

export default async function handler(req: NextApiRequest, res: NextApiResponse<CoinFlipStats | null>) {
  //var data = await getBogCollection()
  //console.log(`api result: ${JSON.stringify(data)}`)
  //console.log(JSON.stringify(req.body))
  let body = req.body as Coin
  let dbResult = await getCoinflipStats()
  if (dbResult) {
    switch (body.face) {
      case 'heads':
        dbResult.heads += 1
        break
      case 'tails':
        dbResult.tails += 1
        break
    }
    await putCoinflipStats(dbResult)
  }

  //await putRandomStuff('coinflip-community', body)
  //console.log(`api result: ${JSON.stringify(result)}`)
  res.status(200).json(dbResult)
}
