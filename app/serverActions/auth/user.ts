import { createServerRunner } from '@aws-amplify/adapter-nextjs'
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth/server'
import amplifyConfig from 'src/amplifyconfiguration.json'
import { cookies } from 'next/headers'
import { AmplifyUser, getRolesFromAmplifyUser } from 'lib/backend/auth/userUtil'
import { Amplify } from 'aws-amplify'
Amplify.configure(amplifyConfig, { ssr: true })
export const { runWithAmplifyServerContext } = createServerRunner({
  config: amplifyConfig,
})
export async function getUserSSRAppRouteApi() {
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
    console.error('getUserSSRAppRouteApi:: user is not logged in')
    return null
  }
}
