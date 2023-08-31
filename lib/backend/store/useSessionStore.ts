import { Navigation } from 'components/Organizms/session/useRouteTracker'
import dayjs from 'dayjs'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Sort } from '../api/aws/apiGateway'
import { Claim } from '../auth/userUtil'

interface CommunityStocksSettings {
  defaultSort?: Sort[]
}

interface SessionState {
  palette: 'light' | 'dark'
  routes: Navigation[]
  communityStocks: CommunityStocksSettings
  claims: Claim[]
  saveRoutes: (routes: Navigation[]) => void
  savePalette: (palette: 'light' | 'dark') => void
  saveCommunityStocksSort: (sort?: Sort[]) => void
  saveClaims: (claims: Claim[]) => void
}

export const useSessionStore = create<SessionState>()((set) => ({
  palette: 'light',
  routes: [],
  communityStocks: {},
  claims: [],
  saveRoutes: (routes) => set((state) => ({ ...state, routes: routes })),
  savePalette: (palette: 'light' | 'dark') => set((state) => ({ ...state, palette: palette })),
  saveCommunityStocksSort: (sort) => set((state) => ({ ...state, communityStocks: { defaultSort: sort } })),
  saveClaims: (claims) => set((state) => ({ ...state, claims: claims })),
}))

export const useSessionPersistentSore = create(
  persist<SessionState>(
    (set, get) => ({
      palette: 'light',
      routes: [],
      communityStocks: {},
      claims: [],
      saveRoutes: (routes) => set((state) => ({ ...state, routes: routes, lastRefreshDate: dayjs().format() })),
      savePalette: (palette: 'light' | 'dark') => set((state) => ({ ...state, palette: palette })),
      saveCommunityStocksSort: (sort) => set((state) => ({ ...state, communityStocks: { defaultSort: sort } })),
      saveClaims: (claims) => set((state) => ({ ...state, claims: claims })),
    }),
    {
      name: 'rs-session-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
