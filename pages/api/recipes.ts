import { getAllRecipes } from 'lib/backend/api/contenfulApi'
import { NextRequest, NextResponse } from 'next/server'
export const config = {
  runtime: 'edge',
}
export default async function handler(req: NextRequest) {
  var data = await getAllRecipes()
  return NextResponse.json(data)
}
