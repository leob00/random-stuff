import { signOut, signIn, getCurrentUser, AuthUser, fetchUserAttributes, FetchUserAttributesOutput } from 'aws-amplify/auth'
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

export function getRolesFromAmplifyUser(user: AuthUser, attributes: FetchUserAttributesOutput) {
  const roleAttr = attributes['custom:roles'] as string | undefined
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
    const user = await getCurrentUser()
    const attributes = await fetchUserAttributes()
    const result: AmplifyUser = {
      id: String(user.username),
      email: String(attributes.email),
      roles: getRolesFromAmplifyUser(user, attributes),
    }
    return result
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function validateUserCSR(username: string, password: string) {
  //const session = await Auth.userSession()
  try {
    const result = await signIn({
      username: username,
      password: password,
    })

    return result
  } catch (err) {
    console.error('error password validation: ', err)
    return null
  }
}
