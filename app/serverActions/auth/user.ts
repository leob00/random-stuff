import { createServerRunner } from '@aws-amplify/adapter-nextjs'
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth/server'
import { Amplify } from 'aws-amplify'
import amplifyConfig from 'src/amplifyconfiguration.json'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { AmplifyUser, getRolesFromAmplifyUser } from 'lib/backend/auth/userUtil'
Amplify.configure(amplifyConfig, { ssr: true })
export const { runWithAmplifyServerContext } = createServerRunner({
  config: amplifyConfig,
})
export async function getUserSSRAppRouteApi(req: NextRequest, res: NextResponse) {
  Amplify.configure(amplifyConfig, { ssr: true })
  try {
    const user = await runWithAmplifyServerContext({
      nextServerContext: { cookies }, // { request: req, response: res },
      operation: async (contextSpec) => {
        const res = await getCurrentUser(contextSpec)
        return res
      },
    })
    const userAttributes = await runWithAmplifyServerContext({
      nextServerContext: { cookies }, // { request: req, response: res },
      operation: async (contextSpec) => {
        const attr = await fetchUserAttributes(contextSpec)
        return attr
      },
    })
    const result: AmplifyUser = {
      id: user.username,
      email: userAttributes.email ?? '',
      roles: getRolesFromAmplifyUser(userAttributes),
    }
    return result
  } catch (err) {
    console.error('getUserSSRApi:: user is not logged in')
    return null
  }
}
