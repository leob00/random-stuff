import { getRecipe } from 'lib/backend/api/cms/contenfulApi'
import { NextRequest, NextResponse } from 'next/server'

export default async function handler(req: NextRequest) {
  let id = req.nextUrl.searchParams.get('id') as string
  let data = await getRecipe(id)
  return NextResponse.json(data)
}
