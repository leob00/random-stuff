import { withSSRContext } from 'aws-amplify'
import { GetServerSidePropsContext, PreviewData } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { AmplifyUser, getRolesFromAmplifyUser } from '../auth/userUtil'

export async function getUserSSR(context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) {
  const { Auth } = withSSRContext(context)
  try {
    const user = await Auth.currentAuthenticatedUser()
    let email = user.attributes.email as string
    const result: AmplifyUser = {
      email: email,
      roles: getRolesFromAmplifyUser(user),
    }
    return result
  } catch (error) {
    return null
  }
}
