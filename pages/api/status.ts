import dayjs from 'dayjs'
import type { NextApiRequest, NextApiResponse } from 'next'

export interface ApiStatus {
  status: 'online' | 'loading'
  date: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiStatus>) {
  //console.log('executing api/status: ')
  const result: ApiStatus = {
    date: dayjs().format(),
    status: 'online',
  }
  res.status(200).json(result)
}
