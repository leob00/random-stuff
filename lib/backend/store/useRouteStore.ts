import { Navigation } from 'components/Organizms/session/useRouteTracker'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface RouteState {
  routes: Navigation[]
  saveRoutes: (routes: Navigation[]) => void
}

export const useRouteStore = create<RouteState>()((set) => ({
  routes: [],
  saveRoutes: (routes) => set((state) => ({ ...state, routes: routes })),
}))

export const useRoutePersistentStore = create(
  persist<RouteState>(
    (set, get) => ({
      routes: [],
      saveRoutes: (routes) => set((state) => ({ ...state, routes: routes })),
    }),
    {
      name: 'route-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
