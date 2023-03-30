import dayjs from 'dayjs'
import { NextRequest, NextResponse } from 'next/server'
import { ApiStatus } from './status'

export const config = {
  runtime: 'edge', // this is a pre-requisite
}
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextRequest) => {
  const result: ApiStatus = {
    date: dayjs().format(),
    status: 'online',
  }
  return NextResponse.json(result)
}
