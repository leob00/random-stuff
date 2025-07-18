import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CryptoSettings, UserStockSettings } from '../api/aws/models/apiGatewayModels'
import { StockQuote } from '../api/models/zModels'
import { EconomicDataItem } from '../api/qln/qlnModels'
import { DashboardWidgetWithSettings } from 'components/Organizms/dashboard/dashboardModel'
import { StockQuoteSort } from '../api/models/collections'
import { EconCalendarFilter } from 'components/Organizms/stocks/EconCalendarDisplay'
import { NewsTypeIds } from '../api/qln/qlnApi'
import { Settings } from '@mui/icons-material'

export interface StockSettings extends UserStockSettings {
  data: StockQuote[]
  lastRefreshDate?: string
}
export type EconCalendarSettings = {
  filter?: EconCalendarFilter
}
export type NewsSettings = {
  newsSource: NewsTypeIds
}

export interface LocalStore {
  myStocks: StockSettings
  stockSettings: UserStockSettings
  saveStockSettings: (stockSettings: StockSettings) => void
  saveStocks: (stocks: StockQuote[]) => void
  saveDefaultView: (val?: 'flat' | 'grouped') => void
  saveCustomSort: (val?: StockQuoteSort[]) => void
  economicIndicators: EconomicDataItem[]
  saveEconomicIndicators: (val: EconomicDataItem[]) => void
  dashboardWidgets: DashboardWidgetWithSettings[]
  saveDashboardWidgets: (items: DashboardWidgetWithSettings[]) => void
  cryptoSettings: CryptoSettings | null
  saveCryptoSettings: (items: CryptoSettings) => void
  econCalendarSettings?: EconCalendarSettings
  setEconCalendarSettings: (item: EconCalendarSettings) => void
  newsSettings: NewsSettings
  setNewsSettings: (item: NewsSettings) => void
}

export const useLocalStore = create(
  persist<LocalStore>(
    (set, get) => ({
      myStocks: {
        defaultView: 'flat',
        data: [],
      },
      stockSettings: {
        defaultView: 'flat',
        earnings: {
          display: 'chart',
        },
      },
      newsSettings: {
        newsSource: 'GoogleTopStories',
      },

      saveStockSettings: (stockSettings: UserStockSettings) => set((state) => ({ ...state, stockSettings: stockSettings })),
      saveStocks: (stocks) => {
        const myStocks = get().myStocks
        set({ myStocks: { ...myStocks, data: stocks } })
      },
      saveDefaultView: (val) => {
        const myStocks = get().myStocks
        set({ myStocks: { ...myStocks, defaultView: val } })
      },
      saveCustomSort: (val?: StockQuoteSort[]) => {
        const myStocks = get().myStocks
        set({ myStocks: { ...myStocks, customSort: val } })
      },
      economicIndicators: [],
      saveEconomicIndicators: (val) => set((state) => ({ ...state, economicIndicators: val })),
      dashboardWidgets: [],
      saveDashboardWidgets: (val) => set((state) => ({ ...state, dashboardWidgets: val })),
      cryptoSettings: null,
      saveCryptoSettings: (cryptoSettings: CryptoSettings) => set((state) => ({ ...state, cryptoSettings: cryptoSettings })),
      setEconCalendarSettings: (settings: EconCalendarSettings) => set((state) => ({ ...state, econCalendarSettings: settings })),
      setNewsSettings: (settings: NewsSettings) => set((state) => ({ ...state, newsSettings: settings })),
    }),
    {
      name: 'rs-local-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
export type LocalStoreController = ReturnType<typeof useLocalStore>
