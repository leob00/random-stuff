import { withSSRContext } from 'aws-amplify'
import { GetServerSidePropsContext, PreviewData } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { AmplifyUser } from '../auth/userUtil'

export async function getUserSSR(context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) {
  const { Auth } = withSSRContext(context)
  try {
    const user = await Auth.currentAuthenticatedUser()
    let email = user.attributes.email as string
    const result: AmplifyUser = {
      email: email,
    }
    return result
  } catch (error) {
    return null
  }
}
