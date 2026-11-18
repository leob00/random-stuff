import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CryptoSettings, UserStockSettings } from '../api/aws/models/apiGatewayModels'
import { StockQuote } from '../api/models/zModels'
import { EconomicDataItem } from '../api/qln/qlnModels'
import { DashboardWidgetWithSettings } from 'components/Organizms/dashboard/dashboardModel'
import { StockQuoteSort } from '../api/models/collections'
import { EconCalendarFilter } from 'components/Organizms/stocks/EconCalendarDisplay'
import { NewsTypeIds } from '../api/qln/qlnApi'
import { StockMovingAvgFilter } from 'components/Organizms/stocks/reports/stockMovingAvgFilter'
import { AiChatHistory, ChatBotMessage } from '../ai/models'
import { getUtcNow } from 'lib/util/dateUtil'
import dayjs from 'dayjs'

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

export type StockReportSettings = {
  topMovingAvg: {
    filter: StockMovingAvgFilter
  }
}
export type PaletteMode = 'light' | 'dark'

export interface LocalStore {
  paletteMode: PaletteMode
  savePaletteMode: (mode: PaletteMode) => void
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
  stockReportSettings: StockReportSettings
  setStockMovingAvgFilter: (filter: StockMovingAvgFilter) => void
  //stockTopMovingAvgFilter?: StockMovingAvgFilter
  getStockTopMovingAvgFilter: () => StockMovingAvgFilter
  aiChatHistory: AiChatHistory
  addToChatHistory: (item: ChatBotMessage) => void
  saveChatHistoryItem: (item: ChatBotMessage) => void
  deleteChatHistoryItem: (item: ChatBotMessage) => void
}

export const useLocalStore = create(
  persist<LocalStore>(
    (set, get) => ({
      paletteMode: 'dark',
      savePaletteMode: (mode: PaletteMode) => set((state) => ({ ...state, paletteMode: mode })),
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
      stockReportSettings: {
        topMovingAvg: {
          filter: {
            take: 100,
            days: 1,
            includeMegaCap: true,
            includeLargeCap: false,
            includeMidCap: false,
            includeSmallCap: false,
          },
        },
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
      getStockTopMovingAvgFilter: () => {
        const movingAvgFilter = get().stockReportSettings.topMovingAvg.filter
        return movingAvgFilter
      },
      stockTopMovingAvgFilter: { days: 1, take: 100 },
      setStockMovingAvgFilter: (filter: StockMovingAvgFilter) => {
        set((state) => ({ ...state, stockReportSettings: { ...state.stockReportSettings, topMovingAvg: { filter: filter } } }))
      },
      aiChatHistory: { items: [] },
      addToChatHistory: (item: ChatBotMessage) => {
        const utcNow = getUtcNow()
        const history = get().aiChatHistory
        let newItems = history.items.filter((m) => dayjs(m.expirationTimestampUtc).isAfter(utcNow))
        if (item.role === 'user') {
          newItems.unshift(item)
        } else if (item.role === 'assistant') {
          newItems.push(item)
        }

        set({ aiChatHistory: { items: newItems } })
      },
      saveChatHistoryItem: (item: ChatBotMessage) => {
        const utcNow = getUtcNow()
        const history = get().aiChatHistory.items.filter((m) => dayjs(m.expirationTimestampUtc).isAfter(utcNow))
        const newItemIndex = history.findIndex((m) => m.role === item.role && m.conversationId === item.conversationId)
        if (newItemIndex > -1) {
          history[newItemIndex] = item
          set({ aiChatHistory: { items: history } })
        }
      },
      deleteChatHistoryItem: (item: ChatBotMessage) => {
        const utcNow = getUtcNow()
        const history = get().aiChatHistory.items.filter((m) => dayjs(m.expirationTimestampUtc).isAfter(utcNow))
        const newHistory = history.filter((m) => m.conversationId !== item.conversationId)
        set({ aiChatHistory: { items: newHistory } })
      },
    }),

    {
      name: 'rs-local-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
export type LocalStoreController = ReturnType<typeof useLocalStore>
