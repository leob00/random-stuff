import { getRandomLoadertext } from 'lib/randomLoaderText'

export interface Model {
  message: string
}

export interface ActionType {
  type: ActionTypes
}

export type ActionTypes = 'generate' | 'init'

export function warmupReducer(state: Model, action: ActionType): Model {
  switch (action.type) {
    case 'init':
      return { ...state }
    case 'generate':
      return { ...state, message: getRandomLoadertext() }

    default:
      throw new Error()
  }
}
