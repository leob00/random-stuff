import { profile } from 'console'
import dayjs from 'dayjs'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { useAuthStore } from 'lib/backend/auth/useAuthStore'
import { getUserCSR } from 'lib/backend/auth/userUtil'
import { getUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { getUtcNow } from 'lib/util/dateUtil'
import shallow from 'zustand/shallow'

export const useUserController = () => {
  const { username, authProfile, setAuthProfile, lastProfileFetchDate, setLastProfileFetchDate, setIsLoggedin, setUsername } = useAuthStore(
    (state) => ({
      isLoggedIn: state.isLoggedIn,
      username: state.username,
      authProfile: state.profile,
      setAuthProfile: state.setProfile,
      lastProfileFetchDate: state.lastProfileFetchDate,
      setLastProfileFetchDate: state.setLastProfileFetchDate,
      setIsLoggedin: state.setIsLoggedIn,
      setUsername: state.setUsername,
    }),
    shallow,
  )
  const fetchProfile = async () => {
    const user = await getUserCSR()
    if (user !== null) {
      const profile = (await getUserProfile(user.email)) as UserProfile

      if (profile !== null) {
        profile.username = user.email
        setLastProfileFetchDate(getUtcNow().format())
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
    username: username,
    authProfile: authProfile,
    setIsLoggedIn: async (loggedIn: boolean) => {
      setIsLoggedin(loggedIn)
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
      }
      return authProfile
    },
    refetchProfile: async (seconds: number) => {
      const lastDt = lastProfileFetchDate
      if (lastDt.length === 0) {
        return await fetchProfile()
      }
      const now = getUtcNow()
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
    setUsername: async (username: string | null) => {
      setUsername(username)
    },
  }
}
