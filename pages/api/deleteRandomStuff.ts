import { deleteRandomStuff } from 'lib/backend/api/aws/apiGateway'
import { NextRequest, NextResponse } from 'next/server'
interface Request {
  key: string
}
export const config = {
  runtime: 'edge',
}
export default async function handler(req: NextRequest) {
  const json = await req.json()
  //console.log(json)
  const body = json as Request

  const result = await deleteRandomStuff(body.key)
  //console.log('api result: ', result)
  return NextResponse.json(result)
}
