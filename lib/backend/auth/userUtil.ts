import { Auth } from 'aws-amplify'
export type ClaimType = 'qln' | 'rs' | 'rs-admin'
export interface Claim {
  type: ClaimType
  token: string
  tokenExpirationDate?: string
  tokenExpirationSeconds: number
}

export interface AmplifyUser {
  id: string
  email: string
  roles?: Role[]
}

export interface QlnUser {
  Token: string
  TokenExpirationDate: string
  TokenExpirationSeconds: number
}

export type RoleTypes = 'Registered User' | 'Admin'

export interface Role {
  Name: RoleTypes
}

export function userHasRole(role: RoleTypes, roles?: Role[]) {
  if (!roles) {
    return false
  }
  return roles.map((item) => item.Name).includes(role)
}

export function getRolesFromAmplifyUser(user: any) {
  const roleAttr = user.attributes['custom:roles'] as string | undefined
  let roles: Role[] = []
  if (roleAttr) {
    const arr = roleAttr.split(',')
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
    //console.log(user)
    const result: AmplifyUser = {
      id: String(user.username),
      email: String(user.attributes.email),
      roles: getRolesFromAmplifyUser(user),
    }
    return result
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function validateUserCSR(username: string, password: string) {
  //const session = await Auth.userSession()
  try {
    const result = await Auth.signIn(username, password, {
      reason: 're-enter-password',
    })
    return result
  } catch (err) {
    console.log('error password validation: ', err)
    return null
  }
}
