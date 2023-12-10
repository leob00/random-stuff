import { withSSRContext } from 'aws-amplify'
import { getSiteSettings } from 'lib/store'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  let url = req.nextUrl

  switch (url.pathname.toLowerCase()) {
    case '/':
      /*  let resp = await fetch(`${url.toString()}ssr/warmup`)
      let status = await resp.status */

      // let settings = getSiteSettings()
      break
  }

  return NextResponse.next()
  // return NextResponse.rewrite(url)
}
