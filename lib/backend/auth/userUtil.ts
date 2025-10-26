import {
  signIn,
  getCurrentUser,
  fetchUserAttributes,
  FetchUserAttributesOutput,
  fetchAuthSession,
  SignInOutput,
  sendUserAttributeVerificationCode,
  confirmUserAttribute,
  ConfirmUserAttributeInput,
} from 'aws-amplify/auth'
import { Amplify } from 'aws-amplify'
import amplifyConfig from 'src/amplifyconfiguration.json'
Amplify.configure(amplifyConfig, { ssr: true })

export type ClaimType = 'qln' | 'rs' | 'rs-admin'
export interface Claim {
  type: ClaimType
  token?: string
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

export type RoleTypes = 'Registered User' | 'Admin' | 'AnthropicAiChat'

export interface Role {
  Name: RoleTypes
}

export function userHasRole(role: RoleTypes, roles?: Role[]) {
  if (!roles) {
    return false
  }
  return roles.map((item) => item.Name).includes(role)
}

export function getRolesFromAmplifyUser(attributes: FetchUserAttributesOutput) {
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
      id: user.username,
      email: attributes.email ?? '',
      roles: getRolesFromAmplifyUser(attributes),
    }
    return result
  } catch (error) {
    //console.error(error)
    return null
  }
}

export async function validateUserCSR(username: string, password: string) {
  let result: SignInOutput | null = null
  const session = await fetchAuthSession()
  console.log(session)

  try {
    result = await signIn({
      username: username,
      password: password,
    })

    return result
  } catch (err) {
    console.error('username password validation error: ', err)
    return result
  }
}

export async function sendEmailVerificationCode() {
  const result = await sendUserAttributeVerificationCode({
    userAttributeKey: 'email',
  })
  return result
}
export async function verifyEmailVerificationCode(code: string) {
  let result = false
  const payload: ConfirmUserAttributeInput = {
    userAttributeKey: 'email',
    confirmationCode: code,
  }
  try {
    await confirmUserAttribute(payload)

    result = true
  } catch (err) {
    result = false
  }
  return result
  // return result
}
