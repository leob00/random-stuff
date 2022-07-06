import { withSSRContext } from 'aws-amplify'
import { getSiteSettings } from 'lib/store'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  let url = req.nextUrl

  switch (url.pathname.toLowerCase()) {
    case '/':
      console.log(`going home: ${url.toString()}`)
      /*  let resp = await fetch(`${url.toString()}ssr/warmup`)
      let status = await resp.status */
      //console.log('warm up status: ' + status)
      //sconsole.log(await resp.body)

      // let settings = getSiteSettings()
      //console.log(`date reloaded: ${settings.lastReloadDate}`)
      break
  }

  return NextResponse.next()
  // return NextResponse.rewrite(url)
}
