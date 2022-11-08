import create from 'zustand'
import { UserProfile } from '../api/aws/apiGateway'
import { devtools, persist } from 'zustand/middleware'
import { Role } from './userUtil'

interface UserAuthState {
  isLoggedIn: boolean
  username: string | null
  profile: UserProfile | null
  roles: Role[]
  setRoles: (roles: Role[]) => void
  lastProfileFetchDate: string
  setLastProfileFetchDate: (fetchDate: string) => void
  setIsLoggedIn: (loggedIn: boolean) => void
  setUsername: (username: string | null) => void
  setProfile: (profile: UserProfile | null) => void
}

export const useAuthStore = create<UserAuthState>()((set) => ({
  isLoggedIn: false,
  username: null,
  profile: null,
  roles: [],
  setRoles: (roles) => set((state) => ({ ...state, roles: roles })),
  lastProfileFetchDate: '',
  setLastProfileFetchDate: (fetchDate) => set((state) => ({ ...state, lastProfileFetchDate: fetchDate })),
  setIsLoggedIn: (loggedIn) => set((state) => ({ ...state, isLoggedIn: loggedIn })),
  setUsername: (username) => set((state) => ({ ...state, username: username })),
  setProfile: (profile) => set((state) => ({ ...state, profile: profile })),
}))
