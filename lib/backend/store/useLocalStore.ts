import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Sort, UserStockSettings } from '../api/aws/models/apiGatewayModels'
import { StockQuote } from '../api/models/zModels'

export interface StockSettings extends UserStockSettings {
  data: StockQuote[]
  lastRefreshDate?: string
}

export interface LocalStore {
  myStocks: StockSettings
  saveStockSettings: (stockSettings: StockSettings) => void
  saveStocks: (stocks: StockQuote[]) => void
  saveDefaultView: (val?: 'flat' | 'grouped') => void
  saveCustomSort: (val?: Sort[]) => void
}

export const useLocalStore = create(
  persist<LocalStore>(
    (set, get) => ({
      myStocks: {
        defaultView: 'flat',
        data: [],
      },
      saveStockSettings: (stockSettings) => set((state) => ({ ...state, stockSettings: stockSettings })),
      saveStocks: (stocks) => {
        const myStocks = get().myStocks
        set({ myStocks: { ...myStocks, data: stocks } })
      },
      saveDefaultView: (val) => {
        const myStocks = get().myStocks
        set({ myStocks: { ...myStocks, defaultView: val } })
      },
      saveCustomSort: (val?: Sort[]) => {
        const myStocks = get().myStocks
        set({ myStocks: { ...myStocks, customSort: val } })
      },
    }),
    {
      name: 'rs-local-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
export type LocalStoreController = ReturnType<typeof useLocalStore>