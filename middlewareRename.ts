import { withSSRContext } from 'aws-amplify'
import { getUserSSR, getUserSSRApi } from 'lib/backend/server-side/serverSideAuth'
import { getSiteSettings } from 'lib/store'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  //console.log(req.credentials)
  console.log('user: ', req.credentials)
  // let url = req.nextUrl

  // switch (url.pathname.toLowerCase()) {
  //   case '/':
  //     /*  let resp = await fetch(`${url.toString()}ssr/warmup`)
  //     let status = await resp.status */

  //     // let settings = getSiteSettings()
  //     break
  // }

  return NextResponse.next()
  // return NextResponse.rewrite(url)
}
