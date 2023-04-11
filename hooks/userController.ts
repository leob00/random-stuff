import dayjs from 'dayjs'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { useAuthStore } from 'lib/backend/auth/useAuthStore'
import { AmplifyUser, getUserCSR } from 'lib/backend/auth/userUtil'
import { getUserProfile } from 'lib/backend/csr/nextApiWrapper'
import shallow from 'zustand/shallow'

export const useUserController = () => {
  const { ticket, authProfile, setAuthProfile, lastProfileFetchDate, setLastProfileFetchDate, setTicket } = useAuthStore(
    (state) => ({
      ticket: state.ticket,
      authProfile: state.profile,
      roles: state.roles,
      setRoles: state.setRoles,
      setAuthProfile: state.setProfile,
      lastProfileFetchDate: state.lastProfileFetchDate,
      setLastProfileFetchDate: state.setLastProfileFetchDate,
      setTicket: state.setTicket,
    }),
    shallow,
  )
  const fetchProfile = async () => {
    const user = await getUserCSR()
    if (user !== null) {
      const profile = (await getUserProfile(user.email)) as UserProfile

      if (profile !== null) {
        profile.username = user.email
        //this can be removed 4/7/2023
        // if (!profile.secKey) {
        //   profile.secKey = myEncryptBase64(`${user.id}-${profile.username}`, `${profile.username}${user.id}`)
        //   putUserProfile(profile)
        // }
        setLastProfileFetchDate(dayjs().format())
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

    fetchProfilePassive: async (seconds: number = 300) => {
      const lastDt = lastProfileFetchDate

      if (lastDt.length === 0) {
        return await fetchProfile()
      }
      const now = dayjs()
      const last = dayjs(lastDt)
      const nextFetch = last.add(seconds, 'second')

      if (now.isAfter(last)) {
        if (nextFetch.isBefore(now)) {
          //console.log('refetching profile...')
          return await fetchProfile()
        }
      }
      return authProfile
    },
  }
}
