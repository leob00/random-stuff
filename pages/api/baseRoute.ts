import { NextRequest, NextResponse } from 'next/server'

export const config = {
  runtime: 'edge',
}
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get('id')!
  return NextResponse.json({ id: id })
}
