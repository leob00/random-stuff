import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { UserStockSettings } from '../api/aws/models/apiGatewayModels'
import { StockQuote } from '../api/models/zModels'

export interface StockSettings extends UserStockSettings {
  data: StockQuote[]
  lastRefreshDate?: string
}

export interface LocalStoreModel {
  myStocks: StockSettings
}

export const useLocalStore = create(
  persist<LocalStoreModel>(
    (set, get) => ({
      myStocks: {
        defaultView: 'flat',
        data: [],
      },
      saveStockSettings: (stockSettings: StockSettings) => set((state) => ({ ...state, stockSettings: stockSettings })),
      saveStocks: (stocks: StockQuote[]) => {
        const myStocks = get().myStocks
        set({ myStocks: { ...myStocks, data: stocks } })
      },
      //saveStockSettings(settings) => set((state)=> ({...state, stockSettings: settings})),

      // palette: 'dark',
      // routes: [],
      // communityStocks: {},
      // claims: [],
      // saveRoutes: (routes) => set((state) => ({ ...state, routes: routes, lastRefreshDate: dayjs().format() })),
      // savePalette: (palette: 'light' | 'dark') => set((state) => ({ ...state, palette: palette })),
      // saveCommunityStocksSort: (sort) => set((state) => ({ ...state, communityStocks: { defaultSort: sort } })),
      // saveClaims: (claims) => set((state) => ({ ...state, claims: claims })),
    }),
    {
      name: 'rs-local-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
export type LocalStoreController = ReturnType<typeof useLocalStore>
