import { getUserSSRAppRouteApi } from 'app/serverActions/auth/user'
import { updateUserRoles } from 'app/serverActions/aws/cognito/cognito'
import { Role } from 'lib/backend/auth/userUtil'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const user = await getUserSSRAppRouteApi()
  if (!user) {
    return new Response(JSON.stringify({ error: 'Please sign in.' }), { status: 401 })
  }
  const roleToAdd = (await request.json()) as Role
  if (!user.roles?.includes(roleToAdd)) {
    if (user.roles) {
      user.roles = [...user.roles, { ...roleToAdd }]
      const result = await updateUserRoles(user.email, user.roles.map((r) => r.Name).join(','))
      return NextResponse.json(user)
    }
  }

  return NextResponse.json(user)
}
