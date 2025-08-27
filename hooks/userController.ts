import dayjs from 'dayjs'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { useAuthStore } from 'lib/backend/auth/useAuthStore'
import { AmplifyUser, getUserCSR } from 'lib/backend/auth/userUtil'
import { getUserProfile } from 'lib/backend/csr/nextApiWrapper'

export const useUserController = () => {
  const { ticket, authProfile, setAuthProfile, lastProfileFetchDate, setLastProfileFetchDate, setTicket } = useAuthStore((state) => ({
    ticket: state.ticket,
    authProfile: state.profile,
    roles: state.roles,
    setRoles: state.setRoles,
    setAuthProfile: state.setProfile,
    lastProfileFetchDate: state.lastProfileFetchDate,
    setLastProfileFetchDate: state.setLastProfileFetchDate,
    setTicket: state.setTicket,
  }))

  const fetchProfile = async () => {
    if (authProfile) {
      return { ...authProfile }
    }
    const user = await getUserCSR()
    if (user) {
      const profile = (await getUserProfile(user.email)) as UserProfile

      if (profile) {
        profile.username = user.email
        setLastProfileFetchDate(dayjs().format())
        if (!profile.settings) {
          profile.settings = {}
        }
        setAuthProfile(profile)
        return profile
      } else {
        setLastProfileFetchDate('')
        setAuthProfile(null)
      }
    } else {
      setLastProfileFetchDate('')
      setAuthProfile(null)
    }
    return null
  }
  return {
    ticket: ticket,
    authProfile: authProfile,
    setTicket: async (ticket: AmplifyUser | null) => {
      setTicket(ticket)
    },
    setProfile: async (profile: UserProfile | null) => {
      setAuthProfile(profile)
      if (profile === null) {
        setLastProfileFetchDate('')
      }
    },
    getProfile: async () => {
      if (authProfile === null) {
        return await fetchProfile()
      } else {
        return authProfile
      }
    },

    fetchProfilePassive: async (seconds: number = 600) => {
      const lastDt = lastProfileFetchDate

      if (lastDt.length === 0) {
        return await fetchProfile()
      }
      const now = dayjs()
      const last = dayjs(lastDt)
      const nextFetch = last.add(seconds, 'second')

      if (nextFetch.isBefore(now)) {
        return await fetchProfile()
      }
      return authProfile
    },
  }
}
export type UserController = ReturnType<typeof useUserController>
