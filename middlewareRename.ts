import { NextRequest, NextResponse } from 'next/server'
import { Auth } from 'aws-amplify'

export function middleware(req: NextRequest) {
  //const basicAuth = req.headers.get('authorization')
  let url = req.nextUrl
  //console.log('url ' + url.pathname)
  if (url.pathname.toLowerCase().includes('protected')) {
    //kick out
  }
  return NextResponse.next()

  /* let headers = req.headers
  console.log(JSON.stringify(headers))
 */
  /* if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    if (user === '4dmin' && pwd === 'testpwd123') {
      return NextResponse.next()
    }
  } */
  url.pathname = '/login'

  return NextResponse.rewrite(url)
}
