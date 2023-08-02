import { Navigation } from 'components/Organizms/session/useRouteTracker'
import create from 'zustand'

interface RouteState {
  routesMap: Map<string, Navigation>
  saveRouteMap: (route: Map<string, Navigation>) => void
}

export const useRouteStore = create<RouteState>()((set) => ({
  routesMap: new Map<string, Navigation>(),
  saveRouteMap: (map) => set((state) => ({ ...state, routesMap: map })),
}))
