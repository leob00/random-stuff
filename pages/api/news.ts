import type { NextApiRequest, NextApiResponse } from 'next'
import { getNewsBySource, getNewsFeed, NewsItem, NewsTypeIds } from 'lib/backend/api/qln/qlnApi'

import { NextRequest, NextResponse } from 'next/server'
export const config = {
  runtime: 'edge', // this is a pre-requisite
}

export default async function handler(req: NextRequest) {
  const id = (await req.nextUrl.searchParams.get('id')) as NewsTypeIds
  //console.log(id)
  //let id = json['id'] as unknown as NewsTypeIds
  let result = await getNewsBySource(id)
  return NextResponse.json(result)
}

/* export default async function handler(req: NextApiRequest, res: NextApiResponse<NewsItem[]>) {
  let id = req.query['id'] as unknown as NewsTypeIds
  let result = await getNewsBySource(id)
  res.status(200).json(result)
} */
