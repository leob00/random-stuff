import { getUserSSRAppRouteApi } from 'app/serverActions/auth/user'
import { NextRequest, NextResponse } from 'next/server'

type Handler = (req: NextRequest) => Promise<NextResponse>

export function withAuth(handler: Handler): Handler {
  return async (req: NextRequest) => {
    const user = await getUserSSRAppRouteApi()
    if (!user) {
      return NextResponse.json('unauthorized', { status: 401 })
    }
    return handler(req)
  }
}
