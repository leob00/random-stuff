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
  const body = json as Request

  const result = await deleteRandomStuff(body.key)
  return NextResponse.json(result)
}
