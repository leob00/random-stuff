import { weakDecrypt, weakEncrypt } from 'lib/backend/encryption/useEncryptor'

export type PageStateSupportedRoute = '/csr/stocks/earnings-calendar' | '/csr/stocks/details' | '/protected/csr/dashboard'

type PageArg = {
  key: string
  value: string
}

export type PageState = {
  route: PageStateSupportedRoute
  args: PageArg[]
  pageIndex?: number
}

export function encryptPageState(state: PageState) {
  return encodeURIComponent(weakEncrypt(JSON.stringify(state)))
}
export function decryptPageState(state: string) {
  const raw = decodeURIComponent(weakDecrypt(state))
  return JSON.parse(raw) as PageState
}
