import { Recipe } from 'lib/models/cms/contentful/recipe'
import { getRecipe } from 'lib/backend/api/contenfulApi'
import { NextRequest, NextResponse } from 'next/server'
export const config = {
  runtime: 'edge',
}
export default async function handler(req: NextRequest) {
  let id = req.nextUrl.searchParams.get('id') as string
  let data = await getRecipe(id)
  return NextResponse.json(data)
}
