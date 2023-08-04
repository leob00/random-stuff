import { create } from 'zustand'
import { UserProfile } from '../api/aws/apiGateway'
import { AmplifyUser, Role } from './userUtil'

interface UserAuthState {
  ticket: AmplifyUser | null
  profile: UserProfile | null
  roles: Role[]
  setRoles: (roles: Role[]) => void
  lastProfileFetchDate: string
  setLastProfileFetchDate: (fetchDate: string) => void
  setTicket: (ticket: AmplifyUser | null) => void
  setProfile: (profile: UserProfile | null) => void
}

export const useAuthStore = create<UserAuthState>()((set) => ({
  ticket: null,
  profile: null,
  roles: [],
  setRoles: (roles) => set((state) => ({ ...state, roles: roles })),
  lastProfileFetchDate: '',
  setLastProfileFetchDate: (fetchDate) => set((state) => ({ ...state, lastProfileFetchDate: fetchDate })),
  setTicket: (ticket) => set((state) => ({ ...state, ticket: ticket })),
  setProfile: (profile) => set((state) => ({ ...state, profile: profile })),
}))
