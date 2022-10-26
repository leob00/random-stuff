import create from 'zustand'

import { UserProfile } from '../api/aws/apiGateway'

import { devtools, persist } from 'zustand/middleware'

interface UserAuthState {
  isLoggedIn: boolean

  username: string | null

  profile: UserProfile | null

  setIsLoggedIn: (loggedIn: boolean) => void

  setUsername: (username: string | null) => void

  setProfile: (profile: UserProfile | null) => void
}

export const useAuthStore = create<UserAuthState>()((set) => ({
  isLoggedIn: false,

  username: null,

  profile: null,

  setIsLoggedIn: (loggedIn) => set((state) => ({ isLoggedIn: loggedIn })),

  setUsername: (username) => set((state) => ({ username: username })),

  setProfile: (profile) => set((state) => ({ profile: profile })),
}))
