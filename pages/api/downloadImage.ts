import { NextApiRequest, NextApiResponse } from 'next'

// eslint-disable-next-line import/no-anonymous-default-export
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  //req.query('url')
  const id = decodeURIComponent(req.query['url'] as string)
  const resp = await fetch(id)

  if (resp.status !== 200) {
    return res.status(200).json(null)
  }
  const blob = await resp.blob()
  const buffer = Buffer.from(await blob.arrayBuffer())

  return res.status(200).json(buffer.toString('base64'))
}
