import { GetServerSidePropsContext, NextApiRequest, NextApiResponse, PreviewData } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { AmplifyUser, getRolesFromAmplifyUser } from '../auth/userUtil'
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth/server'
import { createServerRunner } from '@aws-amplify/adapter-nextjs'
import config from 'src/amplifyconfiguration.json'

export const { runWithAmplifyServerContext } = createServerRunner({
  config,
})

export async function getUserSSR(context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) {
  try {
    const user = await runWithAmplifyServerContext({
      nextServerContext: { request: context.req, response: context.res },
      operation: (contextSpec) => getCurrentUser(contextSpec),
    })
    const userAttributes = await runWithAmplifyServerContext({
      nextServerContext: { request: context.req, response: context.res },
      operation: (contextSpec) => fetchUserAttributes(contextSpec),
    })
    const result: AmplifyUser = {
      id: user.username,
      email: userAttributes.email ?? '',
      roles: await getRolesFromAmplifyUser(userAttributes),
    }
    return result
  } catch (err) {
    console.log('getUserSSR:: user is not logged in')
    return null
  }
}

export async function getUserSSRApi(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await runWithAmplifyServerContext({
      nextServerContext: { request: req, response: res },
      operation: (contextSpec) => getCurrentUser(contextSpec),
    })
    const userAttributes = await runWithAmplifyServerContext({
      nextServerContext: { request: req, response: res },
      operation: (contextSpec) => fetchUserAttributes(contextSpec),
    })
    const result: AmplifyUser = {
      id: user.username,
      email: userAttributes.email ?? '',
      roles: getRolesFromAmplifyUser(userAttributes),
    }
    return result
  } catch (err) {
    console.log('getUserSSRApi:: user is not logged in')
    return null
  }
}
