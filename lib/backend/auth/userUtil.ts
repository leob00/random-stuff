import { Auth } from 'aws-amplify'

export interface User {
  email: string
}
export async function getLoggedinUser() {
  try {
    let user = await Auth.currentAuthenticatedUser()
    let result: User = {
      email: user.attributes.email as string,
    }
    return result
  } catch (error) {
    return null
  }
}
