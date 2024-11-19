import dayjs from 'dayjs'
import { Role, Claim } from 'lib/backend/auth/userUtil'
import { getUtcNow } from 'lib/util/dateUtil'

export function mapRolesToClaims(roles?: Role[]) {
  const result: Claim[] = []
  if (!roles) {
    return result
  }
  const now = getUtcNow()
  const expirationSeconds = dayjs(now).diff(now.add(30, 'days'), 'second')
  roles.forEach((role) => {
    switch (role.Name) {
      case 'Registered User':
        result.push({
          token: crypto.randomUUID(),
          type: 'rs',
          tokenExpirationSeconds: expirationSeconds,
        })
        break
      case 'Admin':
        result.push({
          token: crypto.randomUUID(),
          type: 'rs-admin',
          tokenExpirationSeconds: expirationSeconds,
        })
        break
    }
  })
  return result
}
