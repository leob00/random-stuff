import { withSSRContext } from 'aws-amplify'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  let url = req.nextUrl

  if (url.pathname.toLowerCase().includes('protected')) {
    console.log('entering protected area')
    /* const { Auth } = withSSRContext(req.)
    try {
      const user = await Auth.currentAuthenticatedUser()
     
    } catch (error) {
      console.log(error)
     
    } */
  }
  return NextResponse.next()
  // return NextResponse.rewrite(url)
}
