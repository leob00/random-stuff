import { getRandomStuff } from 'lib/backend/api/aws/apiGateway/apiGateway'
import { DynamoKeys } from 'lib/backend/api/aws/models/apiGatewayModels'
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  runtime: 'edge',
}
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get('id')!
  const arg = id as DynamoKeys
  const result = await getRandomStuff(arg)
  return NextResponse.json(result)
}
