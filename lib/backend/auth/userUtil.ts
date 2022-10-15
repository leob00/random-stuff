import { Auth } from 'aws-amplify'

export interface AmplifyUser {
  email: string
}
export async function getLoggedinUserCSR() {
  try {
    let user = await Auth.currentAuthenticatedUser()
    let result: AmplifyUser = {
      email: user.attributes.email as string,
    }
    return result
  } catch (error) {
    return null
  }
}
