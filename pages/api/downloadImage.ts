import { NextApiRequest, NextApiResponse } from 'next'

// eslint-disable-next-line import/no-anonymous-default-export
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  //req.query('url')
  const id = decodeURIComponent(req.query['url'] as string)
  const resp = await fetch(id)
  //console.log(resp.status)
  if (resp.status !== 200) {
    return res.status(200).json(null)
  }
  const blob = await resp.blob()
  const buffer = Buffer.from(await blob.arrayBuffer())
  //var reader = new FileReader()
  // fs.re
  // reader.readAsDataURL(blob)
  // reader.onloadend = function () {
  //   var base64data = reader.result
  //   console.log(base64data)
  //   return res.status(200).json(base64data)
  // }

  //console.log()
  return res.status(200).json(buffer.toString('base64'))
}
