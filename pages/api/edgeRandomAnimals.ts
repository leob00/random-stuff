import { DynamoKeys, getRandomStuff } from 'lib/backend/api/aws/apiGateway'
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get('id')!
  const arg = id as DynamoKeys
  const result = await getRandomStuff(arg)
  return NextResponse.json(result)
}
