import dayjs from 'dayjs'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Claim } from '../auth/userUtil'
import { Navigation } from 'components/Organizms/session/useSessionSettings'
import { StockQuoteSort } from '../api/models/collections'

interface CommunityStocksSettings {
  defaultSort?: StockQuoteSort[]
}

export interface StockChartSettings {
  defaultDays: number
}

interface SessionState {
  palette: 'light' | 'dark'
  routes: Navigation[]
  communityStocks: CommunityStocksSettings
  claims: Claim[]
  stocksChart: StockChartSettings
  saveRoutes: (routes: Navigation[]) => void
  savePalette: (palette: 'light' | 'dark') => void
  saveCommunityStocksSort: (sort?: StockQuoteSort[]) => void
  saveClaims: (claims: Claim[]) => void
  saveStockChart: (settings: StockChartSettings) => void
}

export const useSessionStore = create(
  persist<SessionState>(
    (set, get) => ({
      palette: 'dark',
      routes: [],
      communityStocks: {},
      claims: [],
      stocksChart: {
        defaultDays: 90,
      },
      saveRoutes: (routes) => set((state) => ({ ...state, routes: routes, lastRefreshDate: dayjs().format() })),
      savePalette: (palette: 'light' | 'dark') => set((state) => ({ ...state, palette: palette })),
      saveCommunityStocksSort: (sort) => set((state) => ({ ...state, communityStocks: { defaultSort: sort } })),
      saveClaims: (claims) => set((state) => ({ ...state, claims: claims })),
      saveStockChart: (settings) => set((state) => ({ ...state, stocksChart: settings })),
    }),
    {
      name: 'rs-session-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
