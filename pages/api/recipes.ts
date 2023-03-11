import { getAllRecipes } from 'lib/backend/api/contenfulApi'
import { shuffleArray } from 'lib/util/collections'
import { NextRequest, NextResponse } from 'next/server'
export const config = {
  runtime: 'edge',
}
export default async function handler(req: NextRequest) {
  const data = await getAllRecipes()
  data.items = shuffleArray(data.items)
  return NextResponse.json(data)
}
