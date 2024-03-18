import type { NextApiRequest, NextApiResponse } from 'next'
import { getCoinflipStats, putCoinflipStats } from 'lib/backend/api/aws/apiGateway/apiGateway'
import { Coin } from 'components/Organizms/CoinFlipLayout'
import { CoinFlipStats } from 'lib/backend/api/aws/models/apiGatewayModels'

export default async function handler(req: NextApiRequest, res: NextApiResponse<CoinFlipStats | null>) {
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

  res.status(200).json(dbResult)
}
