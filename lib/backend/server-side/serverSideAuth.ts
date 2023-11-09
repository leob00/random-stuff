import { Amplify, withSSRContext } from 'aws-amplify'
import { GetServerSidePropsContext, NextApiRequest, PreviewData } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { AmplifyUser, getRolesFromAmplifyUser } from '../auth/userUtil'
import awsExports from '../../../src/aws-exports'
import { NextRequest } from 'next/server'
Amplify.configure({ ...awsExports, ssr: true })

export async function getUserSSR(context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) {
  const { Auth } = withSSRContext(context)
  try {
    const user = await Auth.currentAuthenticatedUser()
    let email = user.attributes.email as string
    const result: AmplifyUser = {
      id: user.username,
      email: email,
      roles: getRolesFromAmplifyUser(user),
    }
    return result
  } catch (error) {
    return null
  }
}

export async function getUserSSRApi(req: NextApiRequest | NextRequest) {
  const { Auth } = withSSRContext({ req })
  try {
    const user = await Auth.currentAuthenticatedUser()
    let email = user.attributes.email as string
    const result: AmplifyUser = {
      id: user.username,
      email: email,
      roles: getRolesFromAmplifyUser(user),
    }
    return result
  } catch (error) {
    console.log(`getUserSSRApi: user not authorized.`)
    return null
  }
}
