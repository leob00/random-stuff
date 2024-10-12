import type { NextApiRequest, NextApiResponse } from 'next'
import { getNewsBySource, getNewsFeed, NewsItem, NewsTypeIds } from 'lib/backend/api/qln/qlnApi'

import { NextRequest, NextResponse } from 'next/server'
export const config = {
  runtime: 'edge', // this is a pre-requisite
}

export default async function handler(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id') as NewsTypeIds
  let result = await getNewsBySource(id)
  return NextResponse.json(result)
}
