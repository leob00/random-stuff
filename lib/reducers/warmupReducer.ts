import { getRandomLoaderText } from 'lib/randomLoaderText'

export interface Model {
  message: string
}

export type ActionTypes = { type: 'refresh'; payload: { message: string } } | { type: 'init' }

export function warmupReducer(state: Model, action: ActionTypes): Model {
  switch (action.type) {
    case 'init':
      return { ...state }
    case 'refresh':
      return { ...state, message: action.payload.message }

    default:
      throw new Error()
  }
}
