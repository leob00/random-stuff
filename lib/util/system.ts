export const isBrowser = () => typeof window !== 'undefined'

export interface WindowDimension {
  width: number
  height: number
}

export const getWindowDimensions = () => {
  const hasWindow = typeof window !== 'undefined'
  let dimension: WindowDimension = {
    width: 320,
    height: 320,
  }
  if (hasWindow) {
    const { innerWidth: width, innerHeight: height } = window
    dimension.width = window.screen.width
    dimension.height = window.screen.height
  }
  return dimension
}
