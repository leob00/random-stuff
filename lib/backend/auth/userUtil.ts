import { Auth } from 'aws-amplify'

export interface AmplifyUser {
  email: string
  roles?: Role[]
}

export type RoleTypes = 'Registered User' | 'Admin'

export interface Role {
  Name: RoleTypes
}

function getRolesFromAmplifyUser(user: any) {
  const roleAttr = user.attributes['custom:roles'] as string | undefined
  let roles: Role[] = []
  if (roleAttr) {
    const arr = roleAttr.split(', ')
    roles = arr.map((item) => {
      return {
        Name: item as RoleTypes,
      }
    })
  }
  return roles
}

export async function getUserCSR() {
  try {
    const user = await Auth.currentAuthenticatedUser()
    /* const roleAttr = user.attributes['custom:roles'] as string | undefined
    let roles: Role[] = []
    if (roleAttr) {
      const arr = roleAttr.split(', ')
      roles = arr.map((item) => {
        return {
          Name: item as RoleTypes,
        }
      })
    } */
    const result: AmplifyUser = {
      email: user.attributes.email as string,
      roles: getRolesFromAmplifyUser(user),
    }
    return result
  } catch (error) {
    return null
  }
}
