import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosRequestConfig } from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  let id = req.query['id'] as string
  let config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'text/html',
    },
  }
  let resp = await axios.get(id, config)
  let data = resp.data
  res.status(200).json(data)
}
