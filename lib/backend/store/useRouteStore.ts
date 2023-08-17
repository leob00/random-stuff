import { Navigation } from 'components/Organizms/session/useRouteTracker'
import dayjs from 'dayjs'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Sort } from '../api/aws/apiGateway'

interface CommunityStocksSettings {
  defaultSort?: Sort[]
}

interface SessionState {
  palette: 'light' | 'dark'
  routes: Navigation[]
  saveRoutes: (routes: Navigation[]) => void
  savePalette: (palette: 'light' | 'dark') => void
  communityStocks: CommunityStocksSettings
  saveCommunityStocksSort: (sort?: Sort[]) => void
}

export const useRouteStore = create<SessionState>()((set) => ({
  palette: 'light',
  routes: [],
  saveRoutes: (routes) => set((state) => ({ ...state, routes: routes })),
  savePalette: (palette: 'light' | 'dark') => set((state) => ({ ...state, palette: palette })),
  communityStocks: {},
  saveCommunityStocksSort: (sort) => set((state) => ({ ...state, communityStocks: { defaultSort: sort } })),
}))

export const useSessionPersistentSore = create(
  persist<SessionState>(
    (set, get) => ({
      palette: 'light',
      routes: [],
      saveRoutes: (routes) => set((state) => ({ ...state, routes: routes, lastRefreshDate: dayjs().format() })),
      savePalette: (palette: 'light' | 'dark') => set((state) => ({ ...state, palette: palette })),
      communityStocks: {},
      saveCommunityStocksSort: (sort) => set((state) => ({ ...state, communityStocks: { defaultSort: sort } })),
    }),
    {
      name: 'route-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
