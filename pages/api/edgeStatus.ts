import dayjs from 'dayjs'
import { NextRequest, NextResponse } from 'next/server'
import { ApiStatus } from './status'

export const config = {
  runtime: 'experimental-edge', // this is a pre-requisite
}

export default async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const result: ApiStatus = {
    date: dayjs().format(),
    status: 'online',
  }
  return NextResponse.json(result)
}
